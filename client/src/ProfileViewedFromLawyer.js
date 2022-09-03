import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import MessageSending from "./MessageSending";
const ProfileViewedFromLawyer = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
    allMessagesReveived,
    setAllMessagesReveived,
    clientViewFromLawyer,
    setClientViewFromLawyer,
  } = useContext(UserContext);

  console.log("allMessagesReveived", allMessagesReveived);
  const { _id } = useParams();

  useEffect(() => {
    fetch(`/api/get-specific-user/${_id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientViewFromLawyer(data.userData || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }

    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);

  return (
    <ClientProfileDiv>
      <h1>this is the Profile Viewed From Lawyer</h1>
      <InformationDiv>
        <p>UserId: {clientViewFromLawyer._id}</p>
        <p>Username: {clientViewFromLawyer.userName}</p>
        <p>FirstName: {clientViewFromLawyer.firstName}</p>
        <p>LastName: {clientViewFromLawyer.lastName}</p>
        <p>Email: {clientViewFromLawyer.email}</p>
        <p>Status: {clientViewFromLawyer.status}</p>
        <p>Phone: {clientViewFromLawyer.phone}</p>
        <p>City: {clientViewFromLawyer.city}</p>
        <p>Province: {clientViewFromLawyer.province}</p>
        <p>Postal Code: {clientViewFromLawyer.postalCode}</p>
        <p>Country: {clientViewFromLawyer.country}</p>
      </InformationDiv>
      <MessageSending />
    </ClientProfileDiv>
  );
};
const InformationDiv = styled.div``;

const ClientProfileDiv = styled.div``;

export default ProfileViewedFromLawyer;
