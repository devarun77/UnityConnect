import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMyConnectionRequest, acceptConnectionRequest,getConnectionRequests } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {

  const dispatch = useDispatch();
  const authState = useSelector( (state) => state.auth);
  const router = useRouter();

  useEffect( () => {
      dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
      dispatch(getConnectionRequests({ token: localStorage.getItem("token") }));
  
  }, []);

  return (
    <UserLayout>
         <DashboardLayout>
          <div style={{ display: "flex", flexDirection:"column", gap:"1.7rem"}}>
            <h4>My Connections</h4>

            { (authState.connectionRequest || []).length > 0 ? (authState.connectionRequest || []).filter( (connection) => connection.status_accepted === null).map((connection) => {
              const username = connection?.userId?.username;
              return (
                <div onClick={ () => {
                  if (!username) return;
                  router.push({
                    pathname: "/view_profile/[username]",
                    query: { username },
                  });
                }}

                 key={connection._id || connection?.userId?._id} className={styles.userCard}>


                   <div styles={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}  className={styles.myConnections}> 

                    <div  className={styles.profilePicture}>

                          <img src={`${BASE_URL}/${connection?.userId?.profilePicture}` || "/default-profile.png"} alt={connection?.userId?.name} />
                    </div>

                    <div className={styles.userInfo}>
                      <h3>{connection?.userId?.name}</h3>
                      <p>@{connection?.userId?.username}</p>
                    </div>
                            <button  onClick={ (e) => {
                              e.stopPropagation();
                              dispatch(acceptConnectionRequest({ token: localStorage.getItem("token"), connectionId: connection._id, action: "accept" }));
                            }}
                            className={styles.connectedButton}>Accept</button>
                   </div>
                </div>
              )
            }) : <h5>No connection requests yet.</h5>}


              <h4>My Network</h4>
              {/* {console.log(authState.connections, "connections")} */}
              {/** Build merged network from incoming (connectionRequest) and outgoing (connections) lists **/}
              {(() => {
                const incoming = authState.connectionRequest || [];
                const outgoing = authState.connections || [];

                const incomingAccepted = incoming.filter(c => c.status_accepted === true).map(c => c.userId);
                const outgoingAccepted = outgoing.filter(c => c.status_accepted === true).map(c => c.connectionId);

                // merge and dedupe by user _id
                const merged = [...incomingAccepted, ...outgoingAccepted];
                const uniqueById = {};
                const networkUsers = [];
                merged.forEach(u => {
                  if(!u) return;
                  if(!uniqueById[u._id]){
                    uniqueById[u._id] = true;
                    networkUsers.push(u);
                  }
                });

                if(networkUsers.length === 0) return <h4>No connections yet.</h4>;

                return networkUsers.map((user) => {
                  const username = user?.username;
                  return (
                    <div onClick={ () => {
                      if (!username) return;
                      router.push({ pathname: "/view_profile/[username]", query: { username } });
                    }} key={user._id} className={styles.userCard}>
                      <div styles={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}  className={styles.myConnections}>
                        <div className={styles.profilePicture}>
                          <img src={`${BASE_URL}/${user?.profilePicture}` || "/default-profile.png"} alt={user?.name} />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user?.name}</h3>
                          <p>@{user?.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
          </div>
          </DashboardLayout>
        </UserLayout>
  )
}
