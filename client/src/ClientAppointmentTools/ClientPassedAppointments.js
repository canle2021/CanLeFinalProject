import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const ClientPassedAppointments = () => {
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
  const navigate = useNavigate();

  let appointmentDetailArray = [];
  const [appointmentsDetail, setAppointmentsDetail] = useState([]);

  useEffect(() => {
    if (sucessfullyVerification && emailToFetchUser) {
      appointmentDetailArray.push(
        fetch(`/api/get-appointments-by-receiverId/${userProfile._id}`)
          .then((res) => {
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
        // setAppointmentsDetail(data[0]);
        const nextAppointmentsFilter = data[0].filter((element) => {
          const newDateOfTimeEnd = new Date(element.timeEndAppointment);
          const timeEndToNumber = newDateOfTimeEnd.getTime();
          // includes not confirmed and passed
          if (timeEndToNumber < Date.now()) {
            return true;
          } else {
            return false;
          }
        });
        setAppointmentsDetail(nextAppointmentsFilter);
        console.log("nextAppointmentsFilter", nextAppointmentsFilter);
        console.log("data[0]", data[0]);
      });
    } else {
      return navigate("/");
    }
  }, [appointmentIdConfirmed]);

  return (
    <UpComingAppointmentsDiv>
      <h1>Client's passed appointments:</h1>
      {appointmentsDetail.length < 1 ? (
        <h2>You have no passed appointment!</h2>
      ) : (
        <div>
          {appointmentsDetail.map((appointment, index) => {
            // to get the format Sat Sep 10 2022 16:16:00 GMT-0600 (Mountain Daylight Time)
            const timeStart = new Date(appointment.timeStartAppointment);
            const timeStartToNumber = timeStart.getTime();
            const timeStartToString = new Date(timeStartToNumber).toString();
            //
            const timeEnd = new Date(appointment.timeEndAppointment);
            const timeEndToNumber = timeEnd.getTime();
            const timeEndToString = new Date(timeEndToNumber).toString();
            return (
              <Appointment key={index}>
                <SubjectP>Appointment ID: {appointment._id}</SubjectP>
                <SubjectP>Subject: {appointment.subject}</SubjectP>
                <Link to={`/message-sender-profile/${appointment.senderId}`}>
                  <SenderP>Lawyer: {appointment.lawyer}</SenderP>
                </Link>
                <p>Lawyer's Email: {appointment.lawyerEmail}</p>

                <SenderP>Client: {appointment.client}</SenderP>

                <p>Client's Email: {appointment.clientEmail}</p>
                <SenderP>Message: {appointment.message}</SenderP>
                <p>Appointent will start at : {timeStartToString}</p>
                <p>Appointent will end at: {timeEndToString}</p>

                <p>Duration: {appointment.duration} minutes</p>
                <p>Location: {appointment.location} </p>
                <p>Hour rate: ${appointment.hourRate}/hr</p>

                <p>
                  Booked at: {appointment.timeOfCreateingAppointmentToString}
                </p>
                <p>
                  Confirmed by client:{" "}
                  {appointment.isConfirmed ? "Yes" : "Not yet"}
                </p>
              </Appointment>
            );
          })}
        </div>
      )}
    </UpComingAppointmentsDiv>
  );
};
const UpComingAppointmentsDiv = styled.div`
  min-height: 100vh;
`;
const PastAppointment = styled.h2``;
const SenderP = styled.p`
  font-weight: bold;
`;
const SubjectP = styled.p`
  font-weight: bold;
`;
const Appointment = styled.div`
  border-bottom: 2px solid blue;
`;

export default ClientPassedAppointments;
