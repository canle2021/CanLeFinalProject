import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
const ClientNotConfirmedAppointments = () => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,
    appointmentIdConfirmed,
    setAppointmentIdConfirmed,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  let appointmentDetailArray = [];
  const [appointmentsDetail, setAppointmentsDetail] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (sucessfullyVerification && emailToFetchUser) {
      appointmentDetailArray.push(
        fetch(`/api/get-appointments-by-receiverId/${userProfile._id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Loading data error");
            }
            return res.json();
          })
          .then((data) => {
            return data.data;
          })
          .catch((err) => {
            console.log("err", err);
            alert(
              `* ALERT * You don't have any not confirmed appointments or we can not show all of them as this time.`
            );
          })
          .finally(() => {
            setLoading(false);
          })
      );
      Promise.all(appointmentDetailArray).then((data) => {
        // change here to the end time still not passed yet
        const nextAppointmentsFilter = data[0].filter((element) => {
          const newDateOfTimeEnd = new Date(element.timeEndAppointment);
          const timeEndToNumber = newDateOfTimeEnd.getTime();
          if (timeEndToNumber > Date.now() && element.isConfirmed === false) {
            return true;
          } else {
            return false;
          }
        });
        setAppointmentsDetail(nextAppointmentsFilter);
      });
    } else {
      return navigate("/");
    }
  }, [appointmentIdConfirmed]);

  return !loading ? (
    <UpComingAppointmentsDiv>
      <h1>Client's not confirmed appointments:</h1>
      {appointmentsDetail.length < 1 ? (
        <h2>You have no not confirmed appointment!</h2>
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
            //
            //update appointment fuction
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
                  if (!res.ok) {
                    throw new Error("Confirm appointment error");
                  }
                  return res.json();
                })
                .then((data) => {
                  if (data.status === 200) {
                    alert("You successfully confirm the appointment ");
                    setAppointmentIdConfirmed(data.data);

                    localStorage.setItem("appointmentId", `${data.data}`);
                    // navigate(`/AppointmentConfirmed`);
                    //

                    let objectToBePosted = {
                      appointmentId: appointment._id,
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
                        if (!posting.ok) {
                          throw new Error("Loading data error");
                        }
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
                        alert(
                          "WARNING! ERROR IN SENDING APPOINTMENT CONFIRMATION. PLEASE CONTACT YOUR LAWYER TO CONFIRM AGAIN. "
                        );
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
                  alert(
                    "WARNING! ERROR IN CONFIRMING APPOINTMENT . PLEASE CONTACT YOUR LAWYER TO CONFIRM AGAIN. "
                  );
                  navigate("/appointment-confirm-error");
                });
            };

            //
            //
            return (
              <Appointment key={index}>
                <ConfirmButton onClick={updateAppointmentToConfirmed}>
                  Confirm
                </ConfirmButton>
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
  ) : (
    <LoadingDiv>
      <Loading />
    </LoadingDiv>
  );
};
const LoadingDiv = styled.div`
  width: 100vw;
  height: 100vh;
  font-size: 50px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ConfirmButton = styled.button`
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: white;
  background-color: #30b06b;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 60px;
  height: 30px;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover {
    background-color: blue;
    transition: 0.5s ease-in-out;
  }
`;
const UpComingAppointmentsDiv = styled.div`
  min-height: 100vh;
`;

const SenderP = styled.p`
  font-weight: bold;
`;
const SubjectP = styled.p`
  font-weight: bold;
`;
const Appointment = styled.div`
  border-bottom: 2px solid blue;
`;

export default ClientNotConfirmedAppointments;
