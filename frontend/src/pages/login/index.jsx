import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { loginUser, registerUser} from "@/config/redux/action/authAction";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const authMessage =
    typeof authState.message === "string"
      ? authState.message
      : authState.message?.message || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");


  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect( () => {
    dispatch(emptyMessage());

  }, [userLoginMethod]);

  const handleLogin = (e) => {
    console.log("Logging");
    dispatch(loginUser({ email, password }));
  }
  const handleRegister = (e) => {
    
      console.log("Registering");
      dispatch(registerUser({ username, password, email, name }))
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>

            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {authMessage && (
              <p style={{ color: authState.isError ? "red" : "green" }}>
                {authMessage}
              </p>
            )}

            <div className={styles.inputContainers}>
              { !userLoginMethod && <div className={styles.inputRow}>
                <input
                onChange={ (e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                  className={styles.inputField}
                />
                <input
                onChange={ (e) => setName(e.target.value)}
                  type="text"
                  placeholder="Name"
                  className={styles.inputField}
                />
              </div>}
              <input
              onChange={ (e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                  className={styles.inputField}
                />
               <input
               onChange={ (e) => setPassword(e.target.value)}
                  type="text"
                  placeholder="Password"
                  className={styles.inputField}
                />
                <div className={styles.buttonWithOutline} onClick={ () => {
                 
                  if (userLoginMethod) {
                      handleLogin();

                  } else {
                      handleRegister();
                  }
                 
                }}>
                  {userLoginMethod ? "Sign In" : "Sign Up "}
                </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            
            
              {userLoginMethod ? <p>Don't Have an Account ?</p> : <p>Already Have an Account ?</p>}

                  <div style={{color: "black", textAlign:"center"}} className={styles.buttonWithOutline} onClick={ () => {
                  setUserLoginMethod(!userLoginMethod); 
                }}>
                  {userLoginMethod ? "Sign Up" : "Sign In"}

            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
