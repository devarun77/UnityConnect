import React, { useEffect } from 'react';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/action/authAction';
import styles from "./index.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function Discoverpage() {
    
    const authState = useSelector( (state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  const users = (authState.all_users || []).filter((profile) => profile?.userId);
  return (
    <UserLayout>
             <DashboardLayout>
              <div>
                <h1>Discover</h1>
                <div className={styles.allUsersProfile}>

                  {!authState.all_profiles_fetched && <p>Loading users...</p>}

                  {authState.all_profiles_fetched && users.length === 0 && <p>No users found.</p>}

                  {authState.all_profiles_fetched && users.map((user) => {
                      const username = user?.userId?.username;

                      return (
                          <div  onClick={ () => {
                            if (!username) return;
                            router.push({
                              pathname: "/view_profile/[username]",
                              query: { username },
                            });
                          }}
                          key={user._id} className={styles.userCard}>
                            <img
                              src={`${BASE_URL}/${user.userId.profilePicture}`}
                              alt={user.userId.name || "Profile"}
                              className={styles.userCard__image}
                            />
                           <div>
                                <h2>{user.userId.name}</h2>
                                <p>@{user.userId.username}</p>
                           </div>
                          </div>
                      )
                  })}

                </div>
              </div>
              </DashboardLayout>
            </UserLayout>
  )
}
