import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import NewMessagesAlert from "./NewMessagesAlert";
import NewAppointmentAlert from "./NewAppointmentAlert";
const Header = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    setUserProfile,
    emailToFetchUser,
    setEmailToFetchUser,
    sucessfullyVerification,
    setSucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
    listOfNewSenders,
    setListOfNewSenders,
    allAppointmentsReveived,
    SetAllAppointmentsReveived,
    listOfNewAppointmentSenders,
    setListOfNewAppointmentSenders,
  } = useContext(UserContext);
  let userId = [];
  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  setSucessfullyVerification(isAuthenticated);
  useEffect(() => {
    if (user?.email) {
      setEmailToFetchUser(user.email);
    }
    if (sucessfullyVerification && emailToFetchUser) {
      userId.push(
        fetch(`/api/get-specific-user-by-email/${emailToFetchUser}`)
          .then((res) => {
            console.log("res.json", res);
            return res.json();
          })
          .then((data) => {
            if (data.status === 200) {
              setUserProfile(data.userData || []);
              setUserInDatabase(true);
              console.log("date", data);
              console.log("data.userData._id", data.userData._id);
              return data.userData._id;
            } else {
              return navigate("/signUp");
            }
          })
          // a post method here to check if the email registered is existing
          // show the alert if the email is already use

          .catch((err) => {
            console.log("err", err);
          })
      );
      // wait for fetching of user profile then fetch all the messages received by logged in user.

      Promise.all(userId).then((data) => {
        // Fetch new messages here to show notification new messages right after sign in successfully because this notification is in Header
        fetch(`/api/get-all-messages-by-receiverId/${data}`)
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
              const senderIdsArray = senderIdsRepeated.filter(
                (element, index) => {
                  const isDuplicate = intermediateArray.includes(
                    element.senderId
                  );
                  if (!isDuplicate) {
                    intermediateArray.push(element.senderId);
                    return true;
                  }
                  return false;
                }
              );
              setListOfNewSenders(senderIdsArray);
            } else {
            }
          })
          // a post method here to check if the email registered is existing
          // show the alert if the email is already use

          .catch((err) => {
            console.log("err", err);
          });
      });

      // fetch new appointment

      Promise.all(userId).then(async (data) => {
        try {
          const fetchAppoitment = await fetch(
            `/api/get-appointments-by-receiverId/${data}`
          );
          console.log("res.json appointment ", data);
          console.log("fetchAppoitment ", fetchAppoitment);

          const toJson = await fetchAppoitment.json();
          console.log("fetchAppoitment ", toJson.data);

          await SetAllAppointmentsReveived(toJson.data);

          const filterNewSender = await toJson.data.filter(
            (apointment) => apointment.isConfirmed === false
          );
          console.log("filterNewSender", filterNewSender);
          let senderIdsRepeated = [];
          await filterNewSender.forEach((element) => {
            senderIdsRepeated.push({
              senderId: element.senderId,
              receiverId: element.receiverId,
              lawyer: element.lawyer,
              client: element.client,
              date: element.date,
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
          console.log("apointment sender", senderIdsArray);
          setListOfNewAppointmentSenders(senderIdsArray);
          console.log(
            "listOfNewAppointmentSenders",
            listOfNewAppointmentSenders.length
          );
        } catch (err) {
          console.log("err", err);
        }
      });
      // a post method here to check if the email registered is existing
      // show the alert if the email is already use
    }
  }, [user, sucessfullyVerification, emailToFetchUser]);

  // Fetch new messages here to show notification new messages right after sign in successfully because this notification is in Header

  const logUserOut = async () => {
    await logout();
    // reset() // an action on the context to set the staet back to initial state
    setEmailToFetchUser("");
    setSucessfullyVerification(false);
  };
  const signUserUp = async () => {
    // await for signUp page done job, then sign up the password and user
    // loginWithRedirect();
    navigate("/signUp");
  };
  console.log("userProfile", userProfile);
  console.log("all messages", allMessagesReveived);
  return (
    <HeaderDiv>
      <Link to="/">
        <h1>Header</h1>
      </Link>
      <input type="date" />
      <input type="time" />
      {sucessfullyVerification && emailToFetchUser ? (
        <div>
          <button onClick={logUserOut}>Logout</button>
          <Link
            to={
              userProfile.status === "client"
                ? "/ClientProfile"
                : "/LawyerProfile"
            }
          >
            <button>My page</button>
          </Link>
          {listOfNewSenders && listOfNewSenders.length > 0 ? (
            <Link to={`new-message-senderIds-list`}>
              <NewMessagesAlert />
            </Link>
          ) : null}
          {listOfNewAppointmentSenders &&
          listOfNewAppointmentSenders.length > 0 ? (
            <Link to={`new-appointments-senderIds-list`}>
              <NewAppointmentAlert />
            </Link>
          ) : null}
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Login</button>
          <button onClick={() => signUserUp()}>Sign Up</button>
        </div>
      )}
    </HeaderDiv>
  );
};

const HeaderDiv = styled.div`
  color: #fff;
  background-color: black;
  height: auto;
  text-align: center;
  width: 100vw;
`;

export default Header;
