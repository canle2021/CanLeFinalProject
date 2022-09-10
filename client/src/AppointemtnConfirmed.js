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
  const [timeEndStartappointment, setTimeEndStartappointment] = useState({});
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
      // to get the format : Sat Sep 10 2022 12:42:00 GMT-0600 (Mountain Daylight Time), this format includes weekday
      const timeStart = new Date(data[0].timeStartAppointment);
      const timeStartToNumber = timeStart.getTime();
      const timeStartToString = new Date(timeStartToNumber).toString();
      //
      const timeEnd = new Date(data[0].timeEndAppointment);
      const timeEndToNumber = timeEnd.getTime();
      const timeEndToString = new Date(timeEndToNumber).toString();
      setTimeEndStartappointment({
        start: timeStartToString,
        end: timeEndToString,
      });
    });
  }, [appointmentIdConfirmed]);

  return (
    <AppointmentConfirmedDiv>
      <h1>Appointment Confirmation:</h1>
      <Message>
        <SubjectP>Appointment ID: {appointmentDetail._id}</SubjectP>
        <SubjectP>Subject: {appointmentDetail.subject}</SubjectP>
        <SenderP>Lawyer: {appointmentDetail.lawyer}</SenderP>
        <p>Lawyer's Email: {appointmentDetail.lawyerEmail}</p>
        <SenderP>Client: {appointmentDetail.client}</SenderP>
        <p>Client's Email: {appointmentDetail.clientEmail}</p>
        <SenderP>Message: {appointmentDetail.message}</SenderP>
        <p>Appointent will start at : {timeEndStartappointment.start}</p>
        <p>Appointent will end at: {timeEndStartappointment.end}</p>

        <p>Duration: {appointmentDetail.duration} minutes</p>
        <p>Location: {appointmentDetail.location} </p>
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
