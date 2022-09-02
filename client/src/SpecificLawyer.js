import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import MessageSending from "./MessageSending";
const SpecificLawyer = () => {
  // if already created password but not in the database yet, redirect to signup page if the client click on book appointment/send message to the lawyer

  const { _id } = useParams();

  const {
    userProfile,
    sucessfullyVerification,
    specificLawyer,
    setSpecificLawyer,
    specificLawyerPicture,
    setSpecificLawyerPicture,
  } = useContext(UserContext);

  useEffect(() => {
    fetch(`/api/get-specific-user/${_id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setSpecificLawyer(data.userData || []);
        setSpecificLawyerPicture(data.userPicture || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  // console.log("specificLawyer", specificLawyer);
  // console.log("specificLawyerPicture", specificLawyerPicture);
  return (
    // should have a send a message component for only the logged in user
    <SpecificLawyerDiv>
      <LawyerpictureDiv>
        <Picture src={specificLawyerPicture.picture}></Picture>
        <Name>
          {specificLawyer.firstName} {specificLawyer.lastName}, Lawyer
        </Name>
      </LawyerpictureDiv>
      {sucessfullyVerification && userProfile._id ? (
        <MessageSending specificLawyer={specificLawyer} />
      ) : null}
    </SpecificLawyerDiv>
  );
};
const Name = styled.p``;
const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SpecificLawyerDiv = styled.div``;

export default SpecificLawyer;
