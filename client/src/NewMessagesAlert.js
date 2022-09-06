import React, { useContext, useEffect, useParams } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const NewMessagesAlert = () => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,
    allMessagesReveived,
    setAllMessagesReveived,
  } = useContext(UserContext);
  const findnewMessage = allMessagesReveived.find(
    (message) => message.isRead === false
  );
  console.log("allMessagesReveived", allMessagesReveived);
  return (
    <NewMessagesAlertDiv>
      {findnewMessage ? <button>You have new message(s)</button> : null}
      <InformationDiv></InformationDiv>
    </NewMessagesAlertDiv>
  );
};
const Message = styled.div``;
const InformationDiv = styled.div``;

const NewMessagesAlertDiv = styled.div``;

export default NewMessagesAlert;
