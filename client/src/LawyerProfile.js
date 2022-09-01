import React, { useContext, useEffect, useParams } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const LawyerProfile = () => {
  const navigate = useNavigate();
  const { userProfile, sucessfullyVerification } = useContext(UserContext);

  console.log("userProfile", userProfile);
  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }
  }, [sucessfullyVerification]);
  return (
    <LawyerProfileDiv>
      <h1>this is the Lawyer page</h1>
      <InformationDiv>
        <p>Picture Id: {userProfile.pictureId}</p>
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
