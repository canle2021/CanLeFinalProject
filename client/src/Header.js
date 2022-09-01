import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    setUserProfile,
    emailToFetchUser,
    setEmailToFetchUser,
    sucessfullyVerification,
    setSucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
  } = useContext(UserContext);

  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  setSucessfullyVerification(isAuthenticated);
  useEffect(() => {
    if (user?.email) {
      setEmailToFetchUser(user.email);
    }
    if (sucessfullyVerification && emailToFetchUser) {
      fetch(`/api/get-specific-user-by-email/${emailToFetchUser}`)
        .then((res) => {
          console.log("res.json", res);
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            setUserProfile(data.userData || []);
            setUserInDatabase(true);
            console.log("date", data);
          } else {
            return navigate("/signUp");
          }
        })
        // a post method here to check if the email registered is existing
        // show the alert if the email is already use

        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [user, sucessfullyVerification, emailToFetchUser]);
  const logUserOut = async () => {
    await logout();
    // reset() // an action on the context to set the staet back to initial state
    setEmailToFetchUser("");
    setSucessfullyVerification(false);
  };
  const signUserUp = async () => {
    // await for signUp page done job, then sign up the password and user
    // loginWithRedirect();
    navigate("/signUp");
  };
  console.log("userProfile", userProfile);
  return (
    <HeaderDiv>
      <Link to="/">
        <h1>Header</h1>
      </Link>
      <input type="date" />
      <input type="time" />
      {sucessfullyVerification && emailToFetchUser ? (
        <div>
          <button onClick={logUserOut}>Logout</button>
          <Link
            to={
              userProfile.status === "client"
                ? "/ClientProfile"
                : "/LawyerProfile"
            }
          >
            <button>Profile</button>
          </Link>
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Login</button>
          <button onClick={() => signUserUp()}>Sign Up</button>
        </div>
      )}
    </HeaderDiv>
  );
};

const HeaderDiv = styled.div`
  color: #fff;
  background-color: black;
  height: auto;
  text-align: center;
  width: 100vw;
`;

export default Header;
