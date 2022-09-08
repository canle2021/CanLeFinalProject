import React, { useContext, useEffect, useParams } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const AppointmentView = ({ senderId }) => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    viewMessageSenderProfile,
    setAllMessagesReveived,
    conversation,
    setConversation,
    allAppointmentsReveiveIdSenderId,
    SetAllAppointmentsReveiveIdSenderId,
  } = useContext(UserContext);
  console.log("userProfile", userProfile._id);
  console.log(
    "allAppointmentsReveiveIdSenderId",
    allAppointmentsReveiveIdSenderId
  );

  useEffect(() => {
    fetch(`/api/get-appointment-both-sides/${userProfile._id}/${senderId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        SetAllAppointmentsReveiveIdSenderId(data.data || []);
        console.log("data.data", data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <MessagesViewDiv>
      <h1>
        Appointment with {viewMessageSenderProfile.firstName}{" "}
        {viewMessageSenderProfile.lastName}:
      </h1>
      {allAppointmentsReveiveIdSenderId &&
        allAppointmentsReveiveIdSenderId.map((appointment, index) => {
          // fetch to update isConfirm => true
          const updateAppointmentToConfirmed = () => {
            fetch(`/api/update-conversation-to-confirmed`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                _id: appointment._id,
              }),
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                if (data.status === 200) {
                  alert("You successfully confirm the appointment ");
                } else {
                  alert(
                    "Sorry! You can not confirm this appointment at this time. Please try again. "
                  );
                }
              })
              .catch((err) => {
                console.error(err);
              });
          };

          return (
            <Message key={index}>
              <SubjectP>Appointment ID: {appointment._id}</SubjectP>
              <SubjectP>Subject: {appointment.subject}</SubjectP>
              <SenderP>Lawyer: {appointment.lawyer}</SenderP>
              <SenderP>Client: {appointment.client}</SenderP>

              <p>Message: {appointment.message}</p>
              <p>Start: {appointment.start}</p>
              <p>End: {appointment.end}</p>
              <p>Duration: {appointment.duration} minutes</p>
              <p>Date: {appointment.date}</p>
              <p>Booked at: {appointment.timeOfCreateingAppointmentToString}</p>
              <ConfirmButton onClick={updateAppointmentToConfirmed}>
                Confirm
              </ConfirmButton>
            </Message>
          );
        })}
    </MessagesViewDiv>
  );
};
const ConfirmButton = styled.button``;
const SenderP = styled.p`
  font-weight: bold;
`;
const SubjectP = styled.p`
  font-weight: bold;
`;
const Message = styled.div`
  border-bottom: 2px solid blue;
`;
const InformationDiv = styled.div``;

const MessagesViewDiv = styled.div``;

export default AppointmentView;
