import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FcCheckmark } from "react-icons/fc";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import MessageReplyMessage from "./MessageReplyMessage";
import ConversationView from "./ConversationView";
import AppointmentCreate from "./appointmentCreate";
import AppointmentView from "./AppointmentView";
const MessageSenderProfile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    viewMessageSenderProfile,
    setViewMessageSenderProfile,
    viewMessageSenderPicture,
    setViewMessageSenderPicture,
  } = useContext(UserContext);
  const { _id } = useParams();

  const [toggleAppointment, setToggleAppointment] = useState(false);
  const [toggleMessage, setToggleMessage] = useState(true);
  const clickToShowMessage = () => {
    setToggleMessage(!toggleMessage);
  };
  const clickToShowAppointment = () => {
    setToggleAppointment(!toggleAppointment);
  };

  useEffect(() => {
    fetch(`/api/get-specific-user/${_id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setViewMessageSenderProfile(data.userData || []);
        setViewMessageSenderPicture(data.userPicture || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

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
        View your working history with {viewMessageSenderProfile.firstName}{" "}
        {viewMessageSenderProfile.lastName}
      </h1>
      <InformationAndPicture>
        {viewMessageSenderPicture.picture ? (
          <LawyerpictureDiv>
            <Picture src={viewMessageSenderPicture.picture}></Picture>
          </LawyerpictureDiv>
        ) : null}
        <InformationDiv>
          <p>
            <FcCheckmark /> FirstName: {viewMessageSenderProfile.firstName}
          </p>
          <p>
            <FcCheckmark /> LastName: {viewMessageSenderProfile.lastName}
          </p>
          <p>
            <FcCheckmark /> Email: {viewMessageSenderProfile.email}
          </p>
          <p>
            <FcCheckmark /> Status: {viewMessageSenderProfile.status}
          </p>
          <p>
            <FcCheckmark /> Phone: {viewMessageSenderProfile.phone}
          </p>
          <p>
            <FcCheckmark /> Street: {viewMessageSenderProfile.streetNumber}
          </p>
          <p>
            <FcCheckmark /> City: {viewMessageSenderProfile.city}
          </p>
          <p>
            <FcCheckmark /> Province: {viewMessageSenderProfile.province}
          </p>
          <p>
            <FcCheckmark /> Postal Code: {viewMessageSenderProfile.postalCode}
          </p>
          <p>
            <FcCheckmark /> Country: {viewMessageSenderProfile.country}
          </p>
        </InformationDiv>
        <MessageReplyMessage />
      </InformationAndPicture>
      {userProfile.status !== "client" ? <AppointmentCreate /> : null}
      <HistoryDiv>
        <ListDiv>
          <HistoryShowButton onClick={clickToShowAppointment}>
            Show/Hide appointment history
          </HistoryShowButton>
          {toggleAppointment ? <AppointmentView senderId={_id} /> : null}
        </ListDiv>
        <ListDiv>
          <HistoryShowButton onClick={clickToShowMessage}>
            Show/Hide conversation
          </HistoryShowButton>
          {toggleMessage ? <ConversationView senderId={_id} /> : null}
        </ListDiv>
      </HistoryDiv>
    </ClientProfileDiv>
  );
};

const InformationAndPicture = styled.div`
  display: flex;
  align-items: center;
  /* margin-left: 12%; */
`;
const HistoryDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const HistoryShowButton = styled.button`
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
    background-color: blue;

    transition: 0.5s ease-in-out;
  }
`;
const ListDiv = styled.div`
  margin-left: 10.5%;
`;
const Picture = styled.img`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  :hover& {
    box-shadow: rgba(51, 2, 251, 0.8) 0px 4px 16px 10px;
    transition: 0.5s ease-in-out;
  }
`;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 80px;
`;
const InformationDiv = styled.div`
  margin-right: 80px;
`;

const ClientProfileDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  min-height: 100vh;
`;

export default MessageSenderProfile;
