import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const ListOfSendersForNewMessages = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
    viewMessageSenderProfile,
    setViewMessageSenderProfile,
    viewMessageSenderPicture,
    setViewMessageSenderPicture,
    listOfNewSenders,
    setListOfNewSenders,
  } = useContext(UserContext);

  // Fetch new messages here agatin to update the list of new message senders after click on it to read (will be eleminated after click to view)
  useEffect(() => {
    fetch(`/api/get-all-messages-by-receiverId/${userProfile._id}`)
      .then((res) => {
        console.log("res.json", res);
        return res.json();
      })
      .then((data) => {
        if (data.status === 200) {
          setAllMessagesReveived(data.data);
          console.log("AllMessagesReveived", data);
          const filterNewSender = data.data.filter(
            (message) => message.isRead === false
          );
          console.log("filterNewSender", filterNewSender);
          let senderIdsRepeated = [];
          filterNewSender.forEach((element) => {
            senderIdsRepeated.push({
              senderId: element.senderId,
              receiverId: element.receiverId,
              firstName: element.firstName,
              lastName: element.lastName,
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
          setListOfNewSenders(senderIdsArray);
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
    if (listOfNewSenders && listOfNewSenders.length < 1) {
      alert("You have no more new messages!");
      navigate("/");
    }

    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);

  console.log("allMessagesReveived", allMessagesReveived);
  return (
    <ListOfSendersForNewMessagesDiv>
      {listOfNewSenders && listOfNewSenders.length > 0 ? (
        <NewMessagesDiv>
          <h1>You have new message(s) from:</h1>

          {listOfNewSenders &&
            listOfNewSenders.map((sender, index) => {
              // fetch to update isRead => true
              const updateMessageToRead = () => {
                fetch(
                  "/api/update-all-messages-by-senderId-receiverId-to-read",
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      senderId: sender.senderId,
                      receiverId: userProfile._id,
                    }),
                  }
                ).catch((err) => {
                  console.error(err);
                });
              };
              return (
                <EachSenderDiv key={index}>
                  <LinktoSenderProfile
                    to={`/message-sender-profile/${sender.senderId}`}
                    onClick={updateMessageToRead}
                  >
                    {sender.firstName} {sender.lastName}
                  </LinktoSenderProfile>
                  {sender.senderId === "System Appointment Confirmed" ? (
                    <LinktoSenderProfile>
                      {/* to={`/message-sender-profile/${sender.senderId}` */}
                      {/* // onClick={updateMessageToRead} */}
                      {/* // > */}
                      System Appointment Confirmed from:
                      {sender.firstName} {sender.lastName}
                    </LinktoSenderProfile>
                  ) : null}
                </EachSenderDiv>
              );
            })}
        </NewMessagesDiv>
      ) : (
        <h1>Thank you, you have checked all the new message(s)!</h1>
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

export default ListOfSendersForNewMessages;
