import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Loading from "./Loading";
const ListOfSendersForNewMessages = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
    listOfNewSenders,
    setListOfNewSenders,
  } = useContext(UserContext);
  const [loading, setLoading] = useState();

  // Fetch new messages here agatin to update the list of new message senders after click on it to read (will be eleminated after click to view)
  useEffect(() => {
    setLoading(true);

    fetch(`/api/get-all-messages-by-receiverId/${userProfile._id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Loading data error");
        }
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
              message: element.message,
              time: element.time,
            });
          });
          const appointmentConfirmMessages = senderIdsRepeated.filter(
            (element) =>
              element.senderId === "6d612474-7ff5-45b9-a29a-f107ec348118"
          );
          console.log("appointmentConfirmMessages", appointmentConfirmMessages);
          // we need to seperate the messages from client and messages from system
          // the messages from system have the same senderId, and we need to render all them out
          const intermediateArray = [];
          const senderNotFromSystemArray = senderIdsRepeated.filter(
            (element, index) => {
              if (element.senderId !== "6d612474-7ff5-45b9-a29a-f107ec348118") {
                const isDuplicate = intermediateArray.includes(
                  element.senderId
                );
                if (!isDuplicate) {
                  intermediateArray.push(element.senderId);
                  return true;
                }
                return false;
              }
              return false;
            }
          );
          const senderIdsArray = [].concat(
            appointmentConfirmMessages,
            senderNotFromSystemArray
          );

          setListOfNewSenders(senderIdsArray);
          console.log("senderIdsArray", senderIdsArray);
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
  return !loading ? (
    <ListOfSendersForNewMessagesDiv>
      {listOfNewSenders && listOfNewSenders.length > 0 ? (
        <NewMessagesDiv>
          <h1>You have new message(s) from:</h1>

          {listOfNewSenders &&
            listOfNewSenders.map((sender, index) => {
              // fetch to update isRead => true
              const updateMessageToRead = () => {
                if (
                  sender.senderId !== "6d612474-7ff5-45b9-a29a-f107ec348118"
                ) {
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
                }
                // to update isRead => true for each appointment confirm message
                // because the api above only update not come from system message
                else {
                  fetch("/api/update-all-messages-by-system-to-read", {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      senderId: sender.senderId,
                      receiverId: userProfile._id,
                      time: sender.time,
                    }),
                  }).catch((err) => {
                    console.error(err);
                  });
                }
              };
              return (
                // the appointment confirmed also be announced here too (after client click appointment confirm button)
                <EachSenderDiv key={index}>
                  <LinktoSenderProfile
                    to={
                      sender.senderId === "6d612474-7ff5-45b9-a29a-f107ec348118"
                        ? `/message-sender-profile/${sender.firstName}`
                        : `/message-sender-profile/${sender.senderId}`
                    }
                    onClick={updateMessageToRead}
                  >
                    {sender.senderId ===
                    "6d612474-7ff5-45b9-a29a-f107ec348118" ? (
                      <span>
                        System Appointment Confirmed: {sender.message}
                      </span>
                    ) : (
                      <span>
                        {sender.firstName} {sender.lastName}
                      </span>
                    )}
                  </LinktoSenderProfile>
                </EachSenderDiv>
              );
            })}
        </NewMessagesDiv>
      ) : (
        <h1>Thank you, you have checked all the new message(s)!</h1>
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

const EachSenderDiv = styled.div`
  margin: 24px 24px 24px 24px;
`;
const NewMessagesDiv = styled.div``;
const ListOfSendersForNewMessagesDiv = styled.div`
  height: 100vh;
`;

export default ListOfSendersForNewMessages;
