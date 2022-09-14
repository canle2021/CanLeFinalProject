import React, { useContext, useEffect, useParams, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { AiOutlineEdit } from "react-icons/ai";

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
      <InformationDiv>
        <h1>
          Client: {userProfile.firstName} {userProfile.lastName}
        </h1>
        <EditDiv>
          <InformationP>Username: {userProfile.userName}</InformationP>
          <LinkTo to="/edit-username">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkTo>
        </EditDiv>
        <BreakDiv />

        <EditDiv>
          <NameDiv>
            <InformationP>FirstName: {userProfile.firstName}</InformationP>
            <InformationP>LastName: {userProfile.lastName}</InformationP>
          </NameDiv>
          <LinkTo to="/edit-name">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkTo>
        </EditDiv>
        <BreakDiv />

        <EditDiv>
          <InformationP>Email: {userProfile.email}</InformationP>
          <LinkTo to="/edit-email">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkTo>
        </EditDiv>
        <BreakDiv />

        <p>Status: {userProfile.status}</p>
        <BreakDiv />

        <EditDiv>
          <InformationP>Phone: {userProfile.phone}</InformationP>
          <LinkTo to="/edit-phone-number">
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkTo>
        </EditDiv>
        <BreakDiv />

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
            <Button>
              <AiOutlineEdit />
            </Button>
          </LinkToEditPage>
        </EditDiv>
      </InformationDiv>
      <Tools>
        <AppointmentTools>
          <LinkTo to="/client-upcoming-appointments">
            <ToolButton> Upcoming appointments</ToolButton>
          </LinkTo>
          <LinkTo to="/client-not-confirmed-appointments">
            <ToolButton> Not confirmed appointments</ToolButton>
          </LinkTo>
          <LinkTo to="/client-passed-appointments">
            <ToolButton> Passed appointments</ToolButton>
          </LinkTo>
        </AppointmentTools>

        <SenderManagementTools>
          <ToolButton onClick={clickToSee}>Message senders list</ToolButton>
          {toggleSenderList ? <MessageSenderList /> : null}
        </SenderManagementTools>
      </Tools>
    </ClientProfileDiv>
  );
};
const BreakDiv = styled.div`
  height: 2px;
  background-color: rgba(62, 140, 228, 0.8);
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
const Tools = styled.div`
  margin-left: 150px;
`;
const SenderManagementTools = styled.div`
  margin-top: 40px;
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
const LinkTo = styled(Link)`
  text-decoration: none;
`;
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div`
  min-height: 100vh;
  display: flex;
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
`;
const InformationP = styled.p``;

const AppointmentTools = styled.div`
  display: flex;
  flex-direction: column;
`;

const LawyerProfileDiv = styled.div`
  min-height: 100vh;
`;

export default ClientProfile;
