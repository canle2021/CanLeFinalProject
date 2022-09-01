import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const {
    userProfile,
    setUserProfile,
    emailToFetchUser,
    setEmailToFetchUser,
    sucessfullyVerification,
    setSucessfullyVerification,
  } = useContext(UserContext);

  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    // getAccessTokenWithPopup,
    logout,
  } = useAuth0();

  console.log("isAuthenticated", isAuthenticated);
  // console.log("getAccessTokenWithPopup", getAccessTokenWithPopup);
  console.log("user", user);
  setSucessfullyVerification(isAuthenticated);
  useEffect(() => {
    if (user?.email) {
      console.log("user.email", user.email);
      setEmailToFetchUser(user.email);
    }
  }, [user]);

  console.log("email", emailToFetchUser);
  const logUserOut = async () => {
    await logout();
    // reset() // an action on the context to set the staet back to initial state
  };
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
                : "LawyerProfile"
            }
          >
            <button>Profile</button>
          </Link>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
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
