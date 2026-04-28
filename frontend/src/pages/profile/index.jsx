"use client";
import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const handleWorkInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);   

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);

      let post = (postState?.posts || []).filter((post) => {
        return post.userId.username === authState.user.userId?.username;
      });

      console.log(
        "User Posts",
        post,
        "USer Name",
        authState.user.userId.username,
      );
      setUserPosts(post);
    }
  }, [authState.profileFetched, postState?.posts, authState.userId?.username]);

  const uploadProfilePicture = async (file) => {

    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post("/update_profile_picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {

    const request = await clientServer.post("/user_update", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.username,
    });

    const response = await clientServer.post('/update_profile_data', {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name, 
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    toast.success("Profile Updated Successfully", {
        icon: () => <span style={{ color: "#fff" }}>✓</span>,
        });

  }

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>

              <label htmlFor="profilePictureUpload" className={styles.backDrop__overlay}>
                <p>Edit</p>
              </label>
              <input type="file" id="profilePictureUpload" hidden onChange={(e) => uploadProfilePicture(e.target.files[0])} />

              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt={userProfile.userId.name || "Profile"}
                className={styles.backDrop}
              />
            </div>
            <div className={styles.profileContainer__details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} 
                    onChange={ (e) => { setUserProfile( {...userProfile, userId: { ...userProfile.userId, name: e.target.value }})}} />
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    <textarea value={userProfile.bio} onChange={ (e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                    }}
                     rows={Math.max(3, Math.ceil(userProfile.bio.length / 80 ))} style={{ width: "100%" }} placeholder="Introduce yourself in a few words...">

                    </textarea>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
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
                {userProfile.pastWork.map((work) => {
                  return (
                    <div key={work._id} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company}-{work.position}
                      </p>
                      <p>{work.years} years</p>
                    </div>
                  );
                })
                }

                <button className={styles.addWorkBtn} onClick={ () => {
                    setIsModalOpen(true);               
                }}
                >Add Work Experience</button>

              </div>
            </div>

            { userProfile != authState.user && 
                        <div  onClick={ () => {
                            updateProfileData();
                        }}
                        className={styles.updateProfileBtn  }>
                            Update Profile
                        </div>
            
            }
          </div>
        )}

        {
        isModalOpen && 
       
        <div  onClick={async  () => {
            setIsModalOpen(false);
        }}

        className={styles.commentsContainer}>

              <div  onClick={ (e) => {
                e.stopPropagation();
              }}
    
              className={styles.allCommentsContainer}>

 <input    onChange={ handleWorkInputChange}
                  type="text"
                  placeholder="Enter Company Name"
                  className={styles.inputField}
                  name="company"
                />
                <input    onChange={ handleWorkInputChange}
                  type="text"
                  placeholder="Position"
                  className={styles.inputField}
                  name="position"
                />
                <input    onChange={ handleWorkInputChange}
                  type="text"
                  placeholder="Years of Experience"
                  className={styles.inputField}
                    name="years"
                />

                <div  onClick={ () => {
                    setUserProfile({ ...userProfile, pastWork:[...userProfile.pastWork, inputData ]});
                    setIsModalOpen(false);
                }}
                className={styles.updateProfileBtn}>
                    Add Work Experience
                </div>
                
              </div>
        </div>
      }
      </DashboardLayout>
    </UserLayout>
  );
}
