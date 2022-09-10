import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
    viewMessageSenderProfile,
    setViewMessageSenderProfile,
    viewMessageSenderPicture,
    setViewMessageSenderPicture,
  } = useContext(UserContext);
  const { _id } = useParams();

  const [toggleAppointment, setToggleAppointment] = useState(false);
  const [toggleMessage, setToggleMessage] = useState(false);
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
      <h1>This is the Message Sender's Profile</h1>
      <LawyerpictureDiv>
        <Picture src={viewMessageSenderPicture.picture}></Picture>
      </LawyerpictureDiv>
      <InformationDiv>
        <p>FirstName: {viewMessageSenderProfile.firstName}</p>
        <p>LastName: {viewMessageSenderProfile.lastName}</p>
        <p>Email: {viewMessageSenderProfile.email}</p>
        <p>Status: {viewMessageSenderProfile.status}</p>
        <p>Phone: {viewMessageSenderProfile.phone}</p>
        <p>City: {viewMessageSenderProfile.city}</p>
        <p>Province: {viewMessageSenderProfile.province}</p>
        <p>Postal Code: {viewMessageSenderProfile.postalCode}</p>
        <p>Country: {viewMessageSenderProfile.country}</p>
      </InformationDiv>
      {userProfile.status !== "client" ? <AppointmentCreate /> : null}
      <MessageReplyMessage />
      <HistoryDiv>
        <ListDiv>
          <HistoryShowButton onClick={clickToShowAppointment}>
            Show/Colapse appointment history
          </HistoryShowButton>
          {toggleAppointment ? <AppointmentView senderId={_id} /> : null}
        </ListDiv>
        <ListDiv>
          <HistoryShowButton onClick={clickToShowMessage}>
            Show/Colapse conversation history
          </HistoryShowButton>
          {toggleMessage ? <ConversationView senderId={_id} /> : null}
        </ListDiv>
      </HistoryDiv>
    </ClientProfileDiv>
  );
};
const HistoryDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  margin-bottom: 50px;
`;
const HistoryShowButton = styled.button``;
const ListDiv = styled.div`
  margin-left: 60px;
`;
const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div``;

export default MessageSenderProfile;
