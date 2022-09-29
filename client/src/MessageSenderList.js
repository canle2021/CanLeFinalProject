import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const MessageSenderList = () => {
  const { allMessagesReveived } = useContext(UserContext);
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

  return (
    <MessagesViewDiv>
      {senderIdsArray.length < 1 ? (
        <Sorry>Sorry, there is nothing to show for message sender list.</Sorry>
      ) : (
        <div>
          {senderIdsArray.map((message, index) => {
            return (
              <Message key={index}>
                {message.senderId !== "6d612474-7ff5-45b9-a29a-f107ec348118" ? (
                  <LinkTo
                    // 6d612474-7ff5-45b9-a29a-f107ec348118 is the system user id
                    to={`/message-sender-profile/${message.senderId}`}
                  >
                    <List>{message.firstName + " " + message.lastName}</List>
                  </LinkTo>
                ) : null}
              </Message>
            );
          })}
        </div>
      )}
      <InformationDiv></InformationDiv>
    </MessagesViewDiv>
  );
};
const Sorry = styled.p`
  color: red;
  font-weight: bold;
`;
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
