import React, { useContext, useEffect, useParams } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const ConversationView = ({ senderId }) => {
  const {
    userProfile,

    viewMessageSenderProfile,

    conversation,
    setConversation,
  } = useContext(UserContext);
  console.log("userProfile", userProfile._id);
  console.log("senderId", senderId);

  useEffect(() => {
    fetch(`/api/get-conversation/${userProfile._id}/${senderId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setConversation(data.conversationArray || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <MessagesViewDiv>
      <h1>
        Conversation with {viewMessageSenderProfile.firstName}{" "}
        {viewMessageSenderProfile.lastName}:
      </h1>
      {conversation &&
        conversation.map((message, index) => {
          return (
            <Message key={index}>
              <SenderP>
                Sender: {message.firstName} {message.lastName}
              </SenderP>
              <SubjectP>Subject: {message.subject}</SubjectP>
              <p>Message: {message.message}</p>
              <p>Time: {message.timeToString}</p>
            </Message>
          );
        })}
    </MessagesViewDiv>
  );
};
const SenderP = styled.p`
  font-weight: bold;
`;
const SubjectP = styled.p`
  font-weight: bold;
`;
const Message = styled.div`
  border-bottom: 2px solid blue;
  max-width: 700px;
`;
const InformationDiv = styled.div``;

const MessagesViewDiv = styled.div``;

export default ConversationView;
