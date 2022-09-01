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

  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  setSucessfullyVerification(isAuthenticated);
  useEffect(() => {
    if (user?.email) {
      setEmailToFetchUser(user.email);
    }
    if (sucessfullyVerification && emailToFetchUser) {
      fetch(`/api/get-specific-user-by-email/${emailToFetchUser}`)
        .then((res) => {
          console.log("work until here");
          return res.json();
        })
        .then((data) => {
          setUserProfile(data.userData || []);
        })
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
