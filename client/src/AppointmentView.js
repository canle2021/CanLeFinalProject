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
    appointmentIdConfirmed,
    setAppointmentIdConfirmed,
  } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("userProfile", userProfile._id);
  console.log(
    "allAppointmentsReveiveIdSenderId",
    allAppointmentsReveiveIdSenderId
  );

  useEffect(() => {
    // this makes sure that can fetch data based on 2 sides of id
    fetch(
      `/api/get-appointment-both-sides/${
        userProfile.status === "client" ? userProfile._id : senderId
      }/${userProfile.status === "client" ? senderId : userProfile._id}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        SetAllAppointmentsReveiveIdSenderId(data.data || []);
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
                  setAppointmentIdConfirmed(data.data);
                  console.log("setAppointmentIdConfirmed", data.data);
                  localStorage.setItem("appointmentId", `${data.data}`);
                  // navigate(`/AppointmentConfirmed`);
                  //

                  let objectToBePosted = {
                    senderId: "6d612474-7ff5-45b9-a29a-f107ec348118",
                    firstName: appointment.receiverId,
                    lastName: "System",
                    isRead: false,
                    receiverId: appointment.senderId,
                    subject: `From System, System Appointment Confirmed!`,
                    message: `The client ${appointment.client}/email ${appointment.clientEmail} has confirmed the appointment with Id: ${appointment._id}`,
                    time: Date.now(),
                    timeToString: Date(Date.now()).toString(),
                    //  this is for both when a client click on a specific lawyer page or click on message to see who sent that message
                  };
                  // post a message to lawyer to confirm the client has confirmed the appointment.
                  const postMessageFromSystem = async () => {
                    try {
                      const posting = await fetch(`/api/add-message`, {
                        method: "POST",
                        body: JSON.stringify(objectToBePosted),
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                      });
                      const converToJson = await posting.json();
                      if (converToJson.status === 200) {
                        alert(
                          `THANK YOU! You successfully sent a confirmation to the lawyer ${appointment.lawyer}.`
                        );
                      } else {
                        alert(converToJson.message);
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  };
                  //
                  postMessageFromSystem();
                  navigate(`/AppointmentConfirmed`);
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
              {!appointment.isConfirmed ? (
                <ConfirmButton onClick={updateAppointmentToConfirmed}>
                  Confirm
                </ConfirmButton>
              ) : (
                <PastAppointment>Appointment was confirmed</PastAppointment>
              )}
              <SubjectP>Appointment ID: {appointment._id}</SubjectP>
              <SubjectP>Subject: {appointment.subject}</SubjectP>
              <SenderP>Lawyer: {appointment.lawyer}</SenderP>
              <SenderP>Client: {appointment.client}</SenderP>

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
                Was booked at: {appointment.timeOfCreateingAppointmentToString}
              </p>
            </Message>
          );
        })}
    </MessagesViewDiv>
  );
};
const PastAppointment = styled.h2``;
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
