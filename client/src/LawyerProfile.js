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
    userProfilePicture,
    setUserProfilePicture,
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
        <Picture src={userProfilePicture.picture}></Picture>
        <EditDiv>
          <InformationP>Username: {userProfile.userName}</InformationP>
          <LinkToEditPage to="/edit-username">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        {/*  */}
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

        <InformationP>Status: {userProfile.status}</InformationP>

        <EditDiv>
          <InformationP>Phone: {userProfile.phone}</InformationP>

          <LinkToEditPage to="/edit-phone-number">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        <EditDiv>
          <InformationP>
            Practice Areas : {userProfile.practiceAreas}
          </InformationP>

          <LinkToEditPage to="/edit-practice-areas">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>

        <EditDiv>
          <InformationP>Education: {userProfile.education}</InformationP>
          <LinkToEditPage to="/edit-education">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>

        <EditDiv>
          <InformationP>Experience: {userProfile.experience}</InformationP>
          <LinkToEditPage to="/edit-experience">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>

        <EditDiv>
          <InformationP>Credentials: {userProfile.credentials}</InformationP>
          <LinkToEditPage to="/edit-credentials">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>
        <EditDiv>
          <InformationP>Languages: {userProfile.languages}</InformationP>
          <LinkToEditPage to="/edit-languages">
            <Button>Edit</Button>
          </LinkToEditPage>
        </EditDiv>

        <InformationP>City: {userProfile.city}</InformationP>
        <InformationP>Province: {userProfile.province}</InformationP>
        <InformationP>Postal Code: {userProfile.postalCode}</InformationP>
        <InformationP>Country: {userProfile.country}</InformationP>
        <InformationP>Quote: {userProfile.quote}</InformationP>
      </InformationDiv>
    </LawyerProfileDiv>
  );
};
const NameDiv = styled.div``;
const LinkToEditPage = styled(Link)``;
const EditDiv = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: center;
  /* text-align: center; */
  align-items: center;
  align-content: center;
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
const Button = styled.button`
  font-size: 1.2rem;
  font-weight: bold;
`;
const LinkToAppointmentsPage = styled(Link)``;

const InformationDiv = styled.div``;

const LawyerProfileDiv = styled.div`
  min-height: 100vh;
`;

export default LawyerProfile;
