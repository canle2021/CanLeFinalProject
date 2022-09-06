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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
