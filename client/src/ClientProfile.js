import React, { useContext, useEffect, useParams } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import MessagesView from "./MeesagesView";
import { Link } from "react-router-dom";
const ClientProfile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
  } = useContext(UserContext);

  console.log("userProfile", userProfile);

  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }

    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);

  return (
    <ClientProfileDiv>
      <h1>
        Client {userProfile.firstName} {userProfile.lastName} profile
      </h1>
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
      <LinkToAppointmentsPage to="/client-upcoming-appointments">
        Upcoming appointments:
      </LinkToAppointmentsPage>
      <MessagesView />
    </ClientProfileDiv>
  );
};
const LinkToAppointmentsPage = styled(Link)``;
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div``;

export default ClientProfile;
