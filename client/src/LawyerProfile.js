import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { AiOutlineEdit } from "react-icons/ai";

import MessageSenderList from "./MessageSenderList";
const LawyerProfile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,

    userProfilePicture,
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
      <InformationDiv>
        <h1>
          Lawyer {userProfile.firstName} {userProfile.lastName}
        </h1>
        <EditDiv>
          <Picture src={userProfilePicture.picture}></Picture>
          <LinkToEditPage to="/edit-picture">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Username: {userProfile.userName}</InformationP>
          <LinkToEditPage to="/edit-username">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <NameDiv>
            <InformationP>FirstName: {userProfile.firstName}</InformationP>
            <InformationP>LastName: {userProfile.lastName}</InformationP>
          </NameDiv>
          <LinkToEditPage to="/edit-name">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Email: {userProfile.email}</InformationP>
          <LinkToEditPage to="/edit-email">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <InformationP>Status: {userProfile.status}</InformationP>

        <EditDiv>
          <InformationP>Phone: {userProfile.phone}</InformationP>
          <LinkToEditPage to="/edit-phone-number">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>
            Practice Areas : {userProfile.practiceAreas}
          </InformationP>
          <LinkToEditPage to="/edit-practice-areas">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Education: {userProfile.education}</InformationP>
          <LinkToEditPage to="/edit-education">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Experience: {userProfile.experience}</InformationP>
          <LinkToEditPage to="/edit-experience">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Credentials: {userProfile.credentials}</InformationP>
          <LinkToEditPage to="/edit-credentials">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Languages: {userProfile.languages}</InformationP>
          <LinkToEditPage to="/edit-languages">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <AddressDiv>
            <InformationP>City: {userProfile.city}</InformationP>
            <InformationP>Province: {userProfile.province}</InformationP>
            <InformationP>Postal Code: {userProfile.postalCode}</InformationP>
            <InformationP>Country: {userProfile.country}</InformationP>
          </AddressDiv>
          <LinkToEditPage to="/edit-address">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
        <BreakDiv />
        <EditDiv>
          <InformationP>Quote: {userProfile.quote}</InformationP>
          <LinkToEditPage to="/edit-quote">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
      </InformationDiv>
      <Tools>
        <AppointmentTools>
          <LinkToAppointmentsPage to="/upcoming-appointments">
            <ToolButton>Up coming appointments</ToolButton>
          </LinkToAppointmentsPage>
          <LinkToAppointmentsPage to="/not-confimed-upcoming-appointments">
            <ToolButton>Not confirmed appointments</ToolButton>
          </LinkToAppointmentsPage>
          <LinkToAppointmentsPage to="/ongoing-appointments">
            <ToolButton>Ongoing appointments</ToolButton>
          </LinkToAppointmentsPage>
          <LinkToAppointmentsPage to="/passed-appointments">
            <ToolButton>Passed appointments</ToolButton>
          </LinkToAppointmentsPage>
        </AppointmentTools>

        <ClientTools>
          <ToolButton onClick={clickToSee}>Message senders list</ToolButton>
          {toggleSenderList ? <MessageSenderList /> : null}
        </ClientTools>
      </Tools>
    </LawyerProfileDiv>
  );
};
const BreakDiv = styled.div`
  height: 2px;
  background-color: rgba(62, 140, 228, 0.8);
`;
const Tools = styled.div`
  margin-left: 150px;
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
  /* border-bottom: dotted 1px green;
  border-top: dotted 1px green; */
`;
const Picture = styled.img``;
const InformationP = styled.p``;
const ClientTools = styled.div`
  margin-top: 40px;
`;
const AppointmentTools = styled.div`
  display: flex;

  flex-direction: column;
`;
const Button = styled.button`
  margin-left: 20px;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: white;
  background-color: #30b06b;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 60px;
  height: 30px;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover {
    background-color: purple;
    transition: 0.5s ease-in-out;
  }
`;
const ToolButton = styled.button`
  font-weight: 500;
  font-size: 20px;
  cursor: pointer;
  color: white;
  background-color: #30b06b;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 405px;
  height: 60px;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover {
    background-color: purple;

    transition: 0.5s ease-in-out;
  }
`;

const LinkToAppointmentsPage = styled(Link)`
  text-decoration: none;
`;

const InformationDiv = styled.div`
  h1 {
    font-family: Georgia, serif;
  }
`;

const LawyerProfileDiv = styled.div`
  min-height: 100vh;
  display: flex;
`;

export default LawyerProfile;
