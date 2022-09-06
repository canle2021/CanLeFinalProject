import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const ListOfSendersForNewMessages = () => {
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

  const listOfSendersNotRepeated = allMessagesReveived.filter(
    (message) => message.isRead === false
  );
  console.log("listOfSendersRepeated", listOfSendersNotRepeated);

  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }

    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);

  console.log("allMessagesReveived", allMessagesReveived);
  return (
    <ListOfSendersForNewMessagesDiv>
      <p>You have new message(s) from:</p>

      {listOfSendersNotRepeated.map((sender, index) => {
        // fetch and show all the messges from this sender in this page
        return (
          <EachSenderDiv key={index}>
            <Link to={`/message-sender-profile/${sender.senderId}`}>
              {sender.firstName} {sender.lastName}
            </Link>
          </EachSenderDiv>
        );
      })}
    </ListOfSendersForNewMessagesDiv>
  );
};

const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const EachSenderDiv = styled.div``;

const ListOfSendersForNewMessagesDiv = styled.div``;

export default ListOfSendersForNewMessages;
