import React, { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const UpComingAppointments = () => {
  const {
    emailToFetchUser,
    userProfile,
    sucessfullyVerification,

    appointmentIdConfirmed,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  let appointmentDetailArray = [];
  const [appointmentsDetail, setAppointmentsDetail] = useState([]);

  useEffect(() => {
    if (
      sucessfullyVerification &&
      emailToFetchUser &&
      userProfile.status === "lawyer"
    ) {
      setLoading(true);

      appointmentDetailArray.push(
        fetch(`/api/get-appointments-by-senderId/${userProfile._id}`)
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
              `* ALERT * You don't have any upcoming appointments or we can not show all of them as this time.`
            );
          })
          .finally(() => {
            setLoading(false);
          })
      );
      Promise.all(appointmentDetailArray).then((data) => {
        const nextAppointmentsFilter = data[0].filter((element) => {
          const newDateOfTime = new Date(element.timeStartAppointment);
          const timeToNumber = newDateOfTime.getTime();
          if (timeToNumber > Date.now() && element.isConfirmed === true) {
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
      <h1>Upcoming Appointments:</h1>
      {appointmentsDetail.length < 1 ? (
        <h2>You have no upcoming appointment!</h2>
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

            const objectToBeDeleted = {
              userId: userProfile._id,
              _id: appointment._id,
            };

            const deleteAppoinment = async () => {
              try {
                const deleting = await fetch(`/api/delete-appointment`, {
                  method: "DELETE",
                  body: JSON.stringify(objectToBeDeleted),
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                });
                const converToJson = await deleting.json();
                if (converToJson.status === 200) {
                  alert(
                    `THANK YOU! You successfully deleted the appointment with id ${appointment._id}.`
                  );
                } else {
                  alert(`* DELETE ERROR ALERT *${converToJson.message}`);
                }
              } catch (err) {
                console.log(err);
                alert(`* DELETE ERROR ALERT * ${err}`);
              }
            };

            return (
              <Appointment key={index}>
                <Button onClick={deleteAppoinment}>Delete</Button>

                <SubjectP>Appointment ID: {appointment._id}</SubjectP>
                <SubjectP>Subject: {appointment.subject}</SubjectP>
                <SenderP>Lawyer: {appointment.lawyer}</SenderP>
                <p>Lawyer's Email: {appointment.lawyerEmail}</p>
                <Link to={`/message-sender-profile/${appointment.receiverId}`}>
                  <SenderP>Client: {appointment.client}</SenderP>
                </Link>
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
const Button = styled.button`
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  color: white;
  background-color: blue;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 60px;
  height: 35px;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover {
    background-color: red;

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

export default UpComingAppointments;
