import React, { useContext, useEffect, useParams, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const MessageSenderList = () => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
  } = useContext(UserContext);
  let senderIdsRepeated = [];

  allMessagesReveived.forEach((element) => {
    senderIdsRepeated.push({
      senderId: element.senderId,
      receiverId: element.receiverId,
      firstName: element.firstName,
      lastName: element.lastName,
      message: element.message,
    });
  });
  const intermediateArray = [];
  const senderIdsArray = senderIdsRepeated.filter((element, index) => {
    const isDuplicate = intermediateArray.includes(element.senderId);
    if (!isDuplicate) {
      intermediateArray.push(element.senderId);
      return true;
    }
    return false;
  });
  console.log("senderIdsArray", senderIdsArray);
  return (
    <MessagesViewDiv>
      {senderIdsArray.map((message, index) => {
        return (
          <Message key={index}>
            <LinkTo
              // 6d612474-7ff5-45b9-a29a-f107ec348118 is the system user id
              to={`/message-sender-profile/${
                message.senderId !== "6d612474-7ff5-45b9-a29a-f107ec348118"
                  ? message.senderId
                  : message.firstName
              }`}
            >
              {message.senderId !== "6d612474-7ff5-45b9-a29a-f107ec348118" ? (
                <List>{message.firstName + " " + message.lastName}</List>
              ) : (
                <List>
                  Appointment confirmed notice (click to see from whom)
                </List>
              )}
            </LinkTo>
          </Message>
        );
      })}
      <InformationDiv></InformationDiv>
    </MessagesViewDiv>
  );
};
const List = styled.p`
  display: list-item;
  font-family: Georgia, serif;
  font-size: 18px;
  margin-left: 15px;
  color: blue;
`;
const LinkTo = styled(Link)`
  text-decoration: none;
`;
const Message = styled.div``;
const InformationDiv = styled.div``;

const MessagesViewDiv = styled.div``;

export default MessageSenderList;
