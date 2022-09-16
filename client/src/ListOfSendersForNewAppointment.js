import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Loading from "./Loading";
const ListOfSendersForNewAppointment = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    listOfNewAppointmentSenders,
    setListOfNewAppointmentSenders,
  } = useContext(UserContext);
  const [loading, setLoading] = useState();

  // Fetch new messages here agatin to update the list of new message senders after click on it to read (will be eleminated after click to view)
  useEffect(() => {
    setLoading(true);

    fetch(`/api/get-appointments-by-receiverId/${userProfile._id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Loading data error");
        }

        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          setListOfNewAppointmentSenders(data.data);

          // to filt which appointmnet not confirm still in the future
          // if it is in the past (ending time in the past) it will not show in here
          const filterNewSender = data.data.filter((apointment) => {
            const newDateOfTimeEnd = new Date(apointment.timeEndAppointment);
            const timeEndToNumber = newDateOfTimeEnd.getTime();
            if (
              timeEndToNumber > Date.now() &&
              apointment.isConfirmed === false
            ) {
              return true;
            } else {
              return false;
            }
          });

          let senderIdsRepeated = [];
          filterNewSender.forEach((element) => {
            senderIdsRepeated.push({
              senderId: element.senderId,
              receiverId: element.receiverId,
              lawyer: element.lawyer,
              date: element.date,
              client: element.client,
            });
          });
          const intermediateArray = [];
          const senderIdsArray = senderIdsRepeated.filter((element, index) => {
            const isDuplicate = intermediateArray.includes(element.senderId);
            if (!isDuplicate) {
              intermediateArray.push(element.senderId);
              return true;
            }
            return false;
          });
          setListOfNewAppointmentSenders(senderIdsArray);
        } else {
        }
      })
      // a post method here to check if the email registered is existing
      // show the alert if the email is already use

      .catch((err) => {
        console.log("err", err);
        navigate("/*");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }
    if (listOfNewAppointmentSenders && listOfNewAppointmentSenders.length < 1) {
      alert("You have no more new appointment!");
      navigate("/");
    }

    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);

  return !loading ? (
    <ListOfSendersForNewMessagesDiv>
      {listOfNewAppointmentSenders && listOfNewAppointmentSenders.length > 0 ? (
        <NewMessagesDiv>
          <h1>You have new appointment(s) from:</h1>

          {listOfNewAppointmentSenders &&
            listOfNewAppointmentSenders.map((apointment, index) => {
              return (
                <EachSenderDiv key={index}>
                  <LinktoSenderProfile
                    to={`/client-not-confirmed-appointments`}
                    // onClick={updateMessageToRead}
                  >
                    <span>Lawyer: {apointment.lawyer}</span>
                  </LinktoSenderProfile>
                </EachSenderDiv>
              );
            })}
        </NewMessagesDiv>
      ) : (
        <h1>Thank you, you have checked all the new appoitment(s)!</h1>
      )}
    </ListOfSendersForNewMessagesDiv>
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
const LinktoSenderProfile = styled(Link)`
  text-decoration: none;
  span {
    display: list-item;
    font-family: Georgia, serif;
    font-size: 18px;
    margin-left: 15px;
    color: blue;
  }
`;

const EachSenderDiv = styled.div``;
const NewMessagesDiv = styled.div``;
const ListOfSendersForNewMessagesDiv = styled.div`
  height: 100vh;
`;

export default ListOfSendersForNewAppointment;
