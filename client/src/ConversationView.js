import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import Loading from "./Loading";
const ConversationView = ({ senderId }) => {
  const {
    userProfile,

    viewMessageSenderProfile,

    conversation,
    setConversation,
  } = useContext(UserContext);

  const [loading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);

    fetch(`/api/get-conversation/${userProfile._id}/${senderId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Loading data error");
        }
        return res.json();
      })
      .then((data) => {
        setConversation(data.conversationArray || []);
      })
      .catch((err) => {
        console.log("err", err);
        alert(
          `* * ALERT * Sorry, you do not have any conversation to show or we can not show it at this time.`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <MessagesViewDiv>
      <h1>
        Conversation with {viewMessageSenderProfile.firstName}{" "}
        {viewMessageSenderProfile.lastName}:
      </h1>
      {conversation && conversation.length > 0 ? (
        <div>
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
        </div>
      ) : (
        <h2>Sorry! You don't have any conversation here.</h2>
      )}
    </MessagesViewDiv>
  ) : (
    <LoadingDiv>
      <Loading />
    </LoadingDiv>
  );
};
const LoadingDiv = styled.div`
  width: 100%;
  height: 100vh;
  font-size: 50px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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

const MessagesViewDiv = styled.div``;

export default ConversationView;
