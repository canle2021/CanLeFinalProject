import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const ListOfSendersForNewAppointment = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    allMessagesReveived,
    listOfNewAppointmentSenders,
    allAppointmentsReveived,
    SetAllAppointmentsReveived,
    setListOfNewAppointmentSenders,
  } = useContext(UserContext);

  // Fetch new messages here agatin to update the list of new message senders after click on it to read (will be eleminated after click to view)
  useEffect(() => {
    fetch(`/api/get-appointments-by-receiverId/${userProfile._id}`)
      .then((res) => {
        console.log("res.json", res);
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          setListOfNewAppointmentSenders(data.data);
          const filterNewSender = data.data.filter(
            (apointment) => apointment.isConfirmed === false
          );
          console.log("filterNewSender", filterNewSender);
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

  console.log("listOfNewAppointmentSenders", listOfNewAppointmentSenders);
  return (
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
                    Lawyer: {apointment.lawyer}/ Appointment Date:{" "}
                    {apointment.date}
                  </LinktoSenderProfile>
                </EachSenderDiv>
              );
            })}
        </NewMessagesDiv>
      ) : (
        <h1>Thank you, you have checked all the new appoitment(s)!</h1>
      )}
    </ListOfSendersForNewMessagesDiv>
  );
};
const LinktoSenderProfile = styled(Link)``;
const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const EachSenderDiv = styled.div``;
const NewMessagesDiv = styled.div``;
const ListOfSendersForNewMessagesDiv = styled.div`
  height: 100vh;
`;

export default ListOfSendersForNewAppointment;
