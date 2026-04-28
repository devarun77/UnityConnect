import { BASE_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getConnectionRequests, getMyConnectionRequest, sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postState = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    React.useState(false);

  const [isSendingConnection, setIsSendingConnection] = useState(false);
  const[isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequests({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    let post = (postState?.posts || []).filter((post) => {
      return post.userId.username === router.query.username;
    });

    setUserPosts(post);

  }, [postState?.posts, router.query.username]);

  useEffect(() => {

    const sentConnection = (authState?.connections || []).find(
      (user) => user?.connectionId?._id === userProfile?.userId?._id,
    );
    const receivedConnection = (authState?.connectionRequest || []).find(
      (user) => user?.userId?._id === userProfile?.userId?._id,
    );
    const matchedConnection = sentConnection || receivedConnection;

    setIsCurrentUserInConnection(Boolean(matchedConnection));
    setIsConnectionNull(matchedConnection?.status_accepted !== true);

  }, [authState?.connections, userProfile?.userId?._id, authState?.connectionRequest]);

  useEffect(() => {
    getUserPosts();

  }, []);

  const handleSendConnectionRequest = async () => {
    try {
      setIsSendingConnection(true);

      await dispatch(
        sendConnectionRequest({
          token: localStorage.getItem("token"),
          userId: userProfile.userId._id,
        }),
      ).unwrap();

      await dispatch(getConnectionRequests({ token: localStorage.getItem("token") }));
      setIsCurrentUserInConnection(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingConnection(false);
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt={userProfile.userId.name || "Profile"}
              className={styles.backDrop}
            />
          </div>

          <div className={styles.profileContainer__details}>
            <div  className={styles.profileContainer__flex} style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

               <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedBtn}> {isConnectionNull ? "Pending": "Connected"}</button>
                  ) : (
                    <button
                      onClick={handleSendConnectionRequest}
                      disabled={isSendingConnection}
                      className={styles.connectBtn}
                    >
                      {isSendingConnection ? "Connecting..." : "Connect"}
                    </button>
                  )}

                  <div  onClick={ async () => {
                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                        window.open(`${BASE_URL}/${response.data.message}`, "_blank");
                          
                        }}
                  
                  style={{ cursor: "pointer"}}> 
                    <svg  style={{ width: "1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                  </div>
               </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3 style={{marginBottom:"0.5rem"}}>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card__profileContainer}>
                          {post.media !== "" ? (

                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt={post.userId.name || "Profile"}
                              className={styles.card__profileContainer__image}
                            />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

                  <div className="workHistory">
                    <h4>Work History</h4>


                    <div className={styles.workHistoryContainer}>  

                      { userProfile.pastWork.map((work) => { 
                          return (
                            <div key={work._id} className={styles.workHistoryCard}>
                              
                              <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company}-{work.position}</p>
                              <p>{work.years} years</p>
                            </div>
                        );
                      })}
                    </div>
                  </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    },
  );

  return { props: { userProfile: request.data.profile } };
}
