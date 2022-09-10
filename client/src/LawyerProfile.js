import React, { useContext, useEffect, useParams, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";

import MessageSenderList from "./MessageSenderList";
const LawyerProfile = () => {
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
    <LawyerProfileDiv>
      <h1>
        Lawyer {userProfile.firstName} {userProfile.lastName} page
      </h1>
      <AppointmentTools>
        <LinkToAppointmentsPage to="/upcoming-appointments">
          <Button>Up coming appointments</Button>
        </LinkToAppointmentsPage>
        <LinkToAppointmentsPage to="/not-confimed-upcoming-appointments">
          <Button>Not confirmed appointments</Button>
        </LinkToAppointmentsPage>
        <LinkToAppointmentsPage to="/ongoing-appointments">
          <Button>Ongoing appointments</Button>
        </LinkToAppointmentsPage>
        <LinkToAppointmentsPage to="/passed-appointments">
          <Button>Passed appointments</Button>
        </LinkToAppointmentsPage>
      </AppointmentTools>

      <ClientTools>
        <Button onClick={clickToSee}>Message senders list</Button>
        {toggleSenderList ? <MessageSenderList /> : null}
      </ClientTools>
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

const ClientTools = styled.div`
  margin-top: 20px;
`;
const AppointmentTools = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Button = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
`;
const LinkToAppointmentsPage = styled(Link)``;

const InformationDiv = styled.div``;

const LawyerProfileDiv = styled.div`
  min-height: 100vh;
`;

export default LawyerProfile;
