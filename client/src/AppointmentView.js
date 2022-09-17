import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
import Loading from "./Loading";
const AppointmentView = ({ senderId }) => {
  const {
    userProfile,

    viewMessageSenderProfile,

    allAppointmentsReveiveIdSenderId,
    SetAllAppointmentsReveiveIdSenderId,
  } = useContext(UserContext);
  const [loading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);

    // this makes sure that can fetch data based on 2 sides of id
    fetch(
      `/api/get-appointment-both-sides/${
        userProfile.status === "client" ? userProfile._id : senderId
      }/${userProfile.status === "client" ? senderId : userProfile._id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Loading data error");
        }
        return res.json();
      })
      .then((data) => {
        SetAllAppointmentsReveiveIdSenderId(data.data || []);
      })
      .catch((err) => {
        console.log("err", err);
        alert(
          `* ALERT* Sorry, you do not have any appointment to show or we can not show them all at this time.`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return !loading ? (
    <MessagesViewDiv>
      <h1>
        Appointment with {viewMessageSenderProfile.firstName}{" "}
        {viewMessageSenderProfile.lastName}:
      </h1>

      {allAppointmentsReveiveIdSenderId &&
      allAppointmentsReveiveIdSenderId.length > 0 ? (
        <div>
          {allAppointmentsReveiveIdSenderId &&
            allAppointmentsReveiveIdSenderId.map((appointment, index) => {
              return (
                <Message key={index}>
                  <SubjectP>Appointment ID: {appointment._id}</SubjectP>
                  <SubjectP>Subject: {appointment.subject}</SubjectP>
                  <SenderP>Lawyer: {appointment.lawyer}</SenderP>
                  <SenderP>Client: {appointment.client}</SenderP>
                  <p>Confirmed: {appointment.isConfirmed ? `Yes` : "No"}</p>

                  <p>Message: {appointment.message}</p>
                  <p>
                    Starts at:{" "}
                    {new Date(
                      new Date(appointment.timeStartAppointment).getTime()
                    ).toString()}
                  </p>
                  <p>
                    Ends at:{" "}
                    {new Date(
                      new Date(appointment.timeEndAppointment).getTime()
                    ).toString()}
                  </p>
                  <p>Duration: {appointment.duration} minutes</p>

                  <p>
                    Was booked at:{" "}
                    {appointment.timeOfCreateingAppointmentToString}
                  </p>
                </Message>
              );
            })}
        </div>
      ) : (
        <h2>Sorry! You do not have any appointment here.</h2>
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
`;

const MessagesViewDiv = styled.div``;

export default AppointmentView;
