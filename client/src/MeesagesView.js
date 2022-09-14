import React, { useContext, useEffect, useParams } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const MessagesView = () => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
  } = useContext(UserContext);

  console.log("userProfile", userProfile);

  return (
    <MessagesViewDiv>
      {allMessagesReveived.map((message, index) => {
        return (
          <Message key={index}>
            <h1>
              Message(s) from{" "}
              <Link to={`/message-sender-profile/${message.senderId}`}>
                {message.firstName} {""} {message.lastName}
              </Link>
            </h1>
            {userProfile.status !== "client" ? (
              <p>Sender ID: {message.senderId}</p>
            ) : null}

            <p>Subject: {message.subject}</p>
            <p>Content: {message.message}</p>
            <p>Time: {message.timeToString}</p>
          </Message>
        );
      })}
    </MessagesViewDiv>
  );
};
const Message = styled.div``;
const InformationDiv = styled.div``;

const MessagesViewDiv = styled.div``;

export default MessagesView;
