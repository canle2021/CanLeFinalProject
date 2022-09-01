import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [specificLawyer, setSpecificLawyer] = useState([]);
  const [specificLawyerPicture, setSpecificLawyerPicture] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [emailToFetchUser, setEmailToFetchUser] = useState("");
  const [sucessfullyVerification, setSucessfullyVerification] = useState(false);
  const [userInDatabase, setUserInDatabase] = useState(false);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
