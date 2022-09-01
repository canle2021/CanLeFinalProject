import React, { useContext, useEffect, useParams } from "react";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const LawyerProfile = () => {
  const {
    userProfile,
    setUserProfile,
    emailToFetchUser,
    setEmailToFetchUser,
    sucessfullyVerification,
    setSucessfullyVerification,
  } = useContext(UserContext);
  useEffect(() => {
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
  }, [sucessfullyVerification, emailToFetchUser]);
  console.log("email", emailToFetchUser);
  console.log("sucessfullyVerification", sucessfullyVerification);

  console.log("userProfile", userProfile);
  return (
    <LawyerProfileDiv>
      <h1>this is the Lawyer page</h1>
      <InformationDiv>
        <p>Username: {userProfile.userName}</p>
        <p>FirstName: {userProfile.firstName}</p>
        <p>LastName: {userProfile.lastName}</p>
        <p>Email: {userProfile.email}</p>
        <p>Status: {userProfile.status}</p>
        <p>Phone: {userProfile.phone}</p>
        <p>City: {userProfile.city}</p>
        <p>Province: {userProfile.province}</p>
        <p>Postal Code: {userProfile.postalCode}</p>
        <p>Country: {userProfile.country}</p>
      </InformationDiv>
    </LawyerProfileDiv>
  );
};
const InformationDiv = styled.div``;

const LawyerProfileDiv = styled.div``;

export default LawyerProfile;
