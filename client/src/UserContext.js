import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [specificLawyer, setSpecificLawyer] = useState([]);
  const [specificLawyerPicture, setSpecificLawyerPicture] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [emailToFetchUser, setEmailToFetchUser] = useState("");
  const [sucessfullyVerification, setSucessfullyVerification] = useState(false);
  const [userInDatabase, setUserInDatabase] = useState(false);
  const [allMessagesReveived, setAllMessagesReveived] = useState([]);
  const [viewMessageSenderProfile, setViewMessageSenderProfile] = useState([]);
  const [viewMessageSenderPicture, setViewMessageSenderPicture] = useState([]);
  const [listOfNewSenders, setListOfNewSenders] = useState();
  const [conversation, setConversation] = useState();
  const [allAppointmentsReveived, SetAllAppointmentsReveived] = useState([]);
  const [
    allAppointmentsReveiveIdSenderId,
    SetAllAppointmentsReveiveIdSenderId,
  ] = useState([]);
  const [listOfNewAppointmentSenders, setListOfNewAppointmentSenders] =
    useState();
  const [appointmentIdConfirmed, setAppointmentIdConfirmed] = useState(
    localStorage.getItem("appointmentId")
      ? localStorage.getItem("appointmentId")
      : null
  );
  return (
    <UserContext.Provider
      value={{
        specificLawyer,
        setSpecificLawyer,
        specificLawyerPicture,
        setSpecificLawyerPicture,
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
        viewMessageSenderProfile,
        setViewMessageSenderProfile,
        viewMessageSenderPicture,
        setViewMessageSenderPicture,
        listOfNewSenders,
        setListOfNewSenders,
        conversation,
        setConversation,
        allAppointmentsReveived,
        SetAllAppointmentsReveived,
        listOfNewAppointmentSenders,
        setListOfNewAppointmentSenders,
        allAppointmentsReveiveIdSenderId,
        SetAllAppointmentsReveiveIdSenderId,
        appointmentIdConfirmed,
        setAppointmentIdConfirmed,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
