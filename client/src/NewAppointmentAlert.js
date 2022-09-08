import React, { useContext, useEffect, useParams } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const NewAppointmentAlert = () => {
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
    <NewAppointmentAlertDiv>
      {/* {findnewMessage ? ( */}
      <button>
        You still have new appointment to confirm? Click here to check!
      </button>
      {/* ) : null} */}
      <InformationDiv></InformationDiv>
    </NewAppointmentAlertDiv>
  );
};

const InformationDiv = styled.div``;

const NewAppointmentAlertDiv = styled.div``;

export default NewAppointmentAlert;
