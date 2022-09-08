import React, { useContext, useEffect } from "react";
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

  console.log("allMessagesReveived", allMessagesReveived);
  const { _id } = useParams();

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
        {userProfile.status !== "client" ? (
          <p>UserId: {viewMessageSenderProfile._id}</p>
        ) : null}
        <p>Username: {viewMessageSenderProfile.userName}</p>
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
      <AppointmentView senderId={_id} />
      <AppointmentCreate />
      <MessageReplyMessage />
      <ConversationView senderId={_id} />
    </ClientProfileDiv>
  );
};

const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div``;

export default MessageSenderProfile;
