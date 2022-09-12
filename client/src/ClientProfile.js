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
      <InformationDiv>
        <EditDiv>
          <InformationP>Username: {userProfile.userName}</InformationP>
          <LinkToEditPage to="/edit-username">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        <EditDiv>
          <NameDiv>
            <InformationP>FirstName: {userProfile.firstName}</InformationP>
            <InformationP>LastName: {userProfile.lastName}</InformationP>
          </NameDiv>
          <LinkToEditPage to="/edit-name">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        <EditDiv>
          <InformationP>Email: {userProfile.email}</InformationP>
          <LinkToEditPage to="/edit-email">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>

        <p>Status: {userProfile.status}</p>

        <EditDiv>
          <InformationP>Phone: {userProfile.phone}</InformationP>
          <LinkToEditPage to="/edit-phone-number">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        <EditDiv>
          <h3>Address:</h3>

          <AddressDiv>
            <InformationP>Street: {userProfile.streetNumber}</InformationP>
            <InformationP>City: {userProfile.city}</InformationP>
            <InformationP>Province: {userProfile.province}</InformationP>
            <InformationP>Postal Code: {userProfile.postalCode}</InformationP>
            <InformationP>Country: {userProfile.country}</InformationP>
          </AddressDiv>
          <LinkToEditPage to="/edit-address">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
      </InformationDiv>
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
const AddressDiv = styled.div``;
const NameDiv = styled.div``;
const LinkToEditPage = styled(Link)``;
const EditDiv = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-items: center;
  align-content: center;
  border-bottom: dotted 1px green;
  border-top: dotted 1px green;
`;
const Picture = styled.img``;
const InformationP = styled.p``;
const ClientTools = styled.div`
  margin-top: 20px;
`;
const AppointmentTools = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LawyerProfileDiv = styled.div`
  min-height: 100vh;
`;

export default ClientProfile;
