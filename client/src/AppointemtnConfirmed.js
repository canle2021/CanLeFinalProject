import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import MessageToLawyer from "./MessageToLawyer";
const AppointmentConfirmed = () => {
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
    appointmentIdConfirmed,
    setAppointmentIdConfirmed,
  } = useContext(UserContext);
  let appointmentDetailArray = [];
  const [appointmentDetail, setAppointmentDetail] = useState([]);
  useEffect(() => {
    appointmentDetailArray.push(
      fetch(`/api/get-appointment/${appointmentIdConfirmed}`)
        .then((res) => {
          console.log("appointmentIdConfirmed", appointmentIdConfirmed);
          return res.json();
        })
        .then((data) => {
          return data.data;
        })
        .catch((err) => {
          console.log("err", err);
        })
    );
    Promise.all(appointmentDetailArray).then((data) => {
      setAppointmentDetail(data[0]);
    });
  }, [appointmentIdConfirmed]);

  return (
    <AppointmentConfirmedDiv>
      <h1>Appointment Confirmed:</h1>
      <Message>
        <SubjectP>Appointment ID: {appointmentDetail._id}</SubjectP>
        <SubjectP>Subject: {appointmentDetail.subject}</SubjectP>
        <SenderP>Lawyer: {appointmentDetail.lawyer}</SenderP>
        <p>Lawyer's Email: {appointmentDetail.lawyerEmail}</p>
        <SenderP>Client: {appointmentDetail.client}</SenderP>
        <p>Client's Email: {appointmentDetail.clientEmail}</p>
        <SenderP>Message: {appointmentDetail.message}</SenderP>
        <p>Appointent will start at : {appointmentDetail.start}</p>
        <p>Appointent will end at: {appointmentDetail.end}</p>
        <p>Appointent's date: {appointmentDetail.date}</p>
        <p>Duration: {appointmentDetail.duration} minutes</p>
        <p>Location: {appointmentDetail.location} minutes</p>
        <p>Hour rate: ${appointmentDetail.hourRate}/hr</p>

        <p>Booked at: {appointmentDetail.timeOfCreateingAppointmentToString}</p>
      </Message>
    </AppointmentConfirmedDiv>
  );
};

const AppointmentConfirmedDiv = styled.div`
  height: 100vh;
`;
const PastAppointment = styled.h2``;
const SenderP = styled.p`
  font-weight: bold;
`;
const SubjectP = styled.p`
  font-weight: bold;
`;
const Message = styled.div`
  border-bottom: 2px solid blue;
`;

export default AppointmentConfirmed;
