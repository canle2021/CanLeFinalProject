import React, { useContext, useEffect, useParams, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

import { Link } from "react-router-dom";
import MessageSenderList from "./MessageSenderList";
const ClientProfile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
  } = useContext(UserContext);
  const [toggleSenderList, setToggleSenderList] = useState(false);
  const clickToSee = () => {
    setToggleSenderList(!toggleSenderList);
  };

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
        <Button> Upcoming appointments</Button>
      </LinkToAppointmentsPage>
      <LinkToAppointmentsPage to="/client-not-confirmed-appointments">
        <Button> Not confirmed appointments</Button>
      </LinkToAppointmentsPage>
      <LinkToAppointmentsPage to="/client-passed-appointments">
        <Button> Passed appointments</Button>
      </LinkToAppointmentsPage>

      <SenderManagementTools>
        <Button onClick={clickToSee}>Message senders list</Button>
        {toggleSenderList ? <MessageSenderList /> : null}
      </SenderManagementTools>
    </ClientProfileDiv>
  );
};
const SenderManagementTools = styled.div``;
const Button = styled.button``;
const LinkToAppointmentsPage = styled(Link)``;
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div`
  min-height: 100vh;
`;

export default ClientProfile;
