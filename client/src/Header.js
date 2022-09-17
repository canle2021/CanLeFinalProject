import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading";
import { MdOutlineNotificationsActive } from "react-icons/md";

import { keyframes } from "styled-components";
const Header = () => {
  const [loadingLogin, setLoadingLogin] = useState();
  const [loadingMessages, setLoadingMessages] = useState();
  const [loadingAppointments, setLoadingAppointments] = useState();
  const navigate = useNavigate();
  const {
    userProfile,
    setUserProfile,
    emailToFetchUser,
    setEmailToFetchUser,
    sucessfullyVerification,
    setSucessfullyVerification,
    setUserInDatabase,
    setAllMessagesReveived,
    listOfNewSenders,
    setListOfNewSenders,
    SetAllAppointmentsReveived,
    listOfNewAppointmentSenders,
    setListOfNewAppointmentSenders,

    setUserProfilePicture,
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
            setLoadingLogin(true);

            if (!res.ok) {
              throw new Error("Loading data error");
            }
            return res.json();
          })
          .then((data) => {
            if (data.status === 200) {
              setUserProfile(data.userData || []);
              setUserProfilePicture(data.userPicture || []);
              setUserInDatabase(true);
              return data.userData;
            } else {
              return navigate("/signUp");
            }
          })
          // a post method here to check if the email registered is existing

          .catch((err) => {
            console.log("err", err);
            navigate("/*");
          })
          .finally(() => {
            setLoadingLogin(false);
          })
      );
      // wait for fetching of user profile then fetch all the messages received by logged in user.

      Promise.all(userId).then((data) => {
        // Fetch new messages here to show notification new messages right after sign in successfully because this notification is in Header
        fetch(`/api/get-all-messages-by-receiverId/${data[0]._id}`)
          .then((res) => {
            setLoadingMessages(true);
            console.log("res", res);
            if (!res.ok) {
              throw new Error("Loading messages error");
            }
            return res.json();
          })
          .then((data) => {
            console.log("dataMessage", data);
            if (data.status === 200) {
              setAllMessagesReveived(data.data);
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

          .catch((err) => {
            console.log("err", err);
            alert(
              "WARNING! You don't have any recieved message or we can not show all your messages at this time."
            );
            // we can not use navigate("/*") because it will redirect to error page with no having message user.
          })
          .finally(() => {
            setLoadingMessages(false);
          });
      });

      // fetch new appointments

      Promise.all(userId).then(async (data) => {
        if (data[0].status !== "lawyer") {
          //  we must put setLoadingAppointments in this if because only fetch new appoinments for client user (the only receiver). If put setLoadingAppointments out of this if, lawyer user will have loading forever because the next setLoadingAppointments in this Promise will never be touched)
          setLoadingAppointments(true);
          try {
            const fetchAppoitment = await fetch(
              `/api/get-appointments-by-receiverId/${data[0]._id}`
            );

            if (!fetchAppoitment.ok) {
              throw new Error("Loading data error");
            }
            const toJson = await fetchAppoitment.json();
            console.log("fetchAppoitment ", toJson.data);

            await SetAllAppointmentsReveived(toJson.data);
            // to filt which appointmnet not confirm still in the future
            // if it is in the past (ending time in the past) it will not be shown  here
            const filterNewSender = await toJson.data.filter((apointment) => {
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
            console.log("apointment sender", senderIdsArray);
            setListOfNewAppointmentSenders(senderIdsArray);
          } catch (err) {
            console.log("err", err);
            alert(
              "WARNING! You don't have any recieved appointment or we can not show all your appointments at this time."
            );
            // we can not use navigate("/*") because it will redirect to error page with no having appointment user.
          } finally {
            setLoadingAppointments(false);
          }
        }
      });
    }
  }, [user, sucessfullyVerification, emailToFetchUser]);

  const logUserOut = async () => {
    await logout();
    // reset() // an action on the context to set the state back to initial state
    setEmailToFetchUser("");
    setSucessfullyVerification(false);
  };
  const signUserUp = async () => {
    // await for signUp page done job, then sign up the password and user
    // loginWithRedirect();
    navigate("/signUp");
  };

  return !loadingLogin && !loadingAppointments && !loadingMessages ? (
    <HeaderDiv>
      <NameDiv>
        <LinkToHome to="/">
          <button>THE LEGAL BRIDGE</button>
        </LinkToHome>
      </NameDiv>
      {sucessfullyVerification && emailToFetchUser ? (
        <AfterLoginDiv>
          <AlertDiv>
            {listOfNewSenders && listOfNewSenders.length > 0 ? (
              <LinkTo to={`new-message-senderIds-list`}>
                <button>
                  <span>
                    <MdOutlineNotificationsActive />
                  </span>{" "}
                  Message
                </button>
              </LinkTo>
            ) : null}
            {listOfNewAppointmentSenders &&
            listOfNewAppointmentSenders.length > 0 ? (
              <LinkTo to={`new-appointments-senderIds-list`}>
                <button>
                  <span>
                    <MdOutlineNotificationsActive />
                  </span>{" "}
                  Appointment
                </button>
              </LinkTo>
            ) : null}
          </AlertDiv>
          <HelloDiv>
            <LinkTo
              to={
                userProfile.status === "client"
                  ? "/ClientProfile"
                  : "/LawyerProfile"
              }
            >
              <Button>Hello {userProfile.firstName}</Button>
            </LinkTo>
            <Button onClick={logUserOut}>Logout</Button>
          </HelloDiv>
        </AfterLoginDiv>
      ) : (
        <LogoutDiv>
          <Button onClick={() => signUserUp()}>Sign Up</Button>
          <Button onClick={() => loginWithRedirect()}>Login</Button>
        </LogoutDiv>
      )}
    </HeaderDiv>
  ) : (
    <LoadingDiv>
      <Loading />
    </LoadingDiv>
  );
};
const LinkTo = styled(Link)`
  text-decoration: none;
`;
const LoadingDiv = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Button = styled.button`
  width: 200px;
  height: 35px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
  background-color: #30b06b;
  color: #fff;
  margin-right: 30px;

  &:hover {
    color: blue;
    transition: 0.5s ease-in-out;
  }
`;
const LogoutDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 80%;
  margin-right: 30px;
  margin-bottom: 20px;
`;
const AfterLoginDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const HelloDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-left: 80%; */
  margin-right: 30px;
  margin-bottom: 20px;
`;
const slidein = keyframes`
  from {
    transform: rotate(-10deg);
  }
  to {
    transform: rotate(10deg);
  }
`;
const AlertDiv = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-right: 80%;
  margin-right: 30px;
  margin-bottom: 20px;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    margin-right: 30px;
    margin-left: 40px;
    text-decoration: none;
    width: 200px;
    height: 35px;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
    background-color: #30b06b;
    color: #fff;
    span {
      font-size: 1.8rem;
      animation: ${slidein} 0.05s infinite alternate;
      margin-right: 5px;
      color: yellow;
    }
    &:hover {
      /* background-color: white; */
      color: blue;
      transition: 0.5s ease-in-out;
    }
  }
`;

const HeaderDiv = styled.div`
  color: #fff;
  background-color: black;
  height: auto;
  text-align: center;
  width: 100vw;
`;
const NameDiv = styled.div`
  margin-top: 25px;
`;
const LinkToHome = styled(Link)`
  button {
    text-decoration: none;
    width: 350px;
    height: 80px;
    border-radius: 10px;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    font-family: "Roboto", sans-serif;
    background-color: #30b06b;
    color: #fff;

    &:hover {
      /* background-color: white; */
      color: blue;
      transition: 0.5s ease-in-out;
    }
  }
`;

export default Header;
