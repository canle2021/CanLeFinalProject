import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import MessageToLawyer from "./MessageToLawyer";
import Slider from "./Slider";
import Welcome from "./Asset/Welcome.jpg";
import { FcCheckmark } from "react-icons/fc";
import { SiWikiquote } from "react-icons/si";

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

  return (
    // should have a send a message component for only the logged in user
    <SpecificLawyerDiv>
      <Slider Welcome={Welcome} />
      <Box>
        <LawyerpictureDiv>
          <Picture src={specificLawyerPicture.picture}></Picture>
          <Name>
            {specificLawyer.firstName} {specificLawyer.lastName}, Lawyer
          </Name>
        </LawyerpictureDiv>
      </Box>
      <QuoteDiv>
        <p>
          <SiWikiquote /> {specificLawyer.quote}
        </p>
      </QuoteDiv>
      <InfomationDiv>
        <InformationP>
          <FcCheckmark></FcCheckmark> Phone: {specificLawyer.phone}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Email: {specificLawyer.email}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Practice Areas :{" "}
          {specificLawyer.practiceAreas}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Education: {specificLawyer.education}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Experience: {specificLawyer.experience}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Credentials: {specificLawyer.credentials}
        </InformationP>
        <InformationP>
          <FcCheckmark></FcCheckmark> Languages: {specificLawyer.languages}
        </InformationP>
      </InfomationDiv>
      <MessageDiv>
        {sucessfullyVerification &&
        userProfile._id &&
        userProfile.status === "client" ? (
          <MessageToLawyer />
        ) : null}
      </MessageDiv>
    </SpecificLawyerDiv>
    // Lawyer can not message to lawyer
  );
};
const QuoteDiv = styled.div`
  margin-left: 20%;
  margin-top: -150px;
  margin-bottom: 50px;
  width: 850px;
  height: fit-content;
  font-size: 1.5rem;
  font-family: Georgia, serif;
  font-weight: bold;
  line-height: 1.7;
  border-bottom: 2px solid rgba(51, 2, 251, 0.8);
`;
const MessageDiv = styled.div`
  margin-left: 20%;
`;
const InfomationDiv = styled.div`
  margin-left: 20%;
`;
const InformationP = styled.p``;
const Name = styled.p``;
const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100vw; */
`;
const SpecificLawyerDiv = styled.div`
  min-height: 100vh;
  width: 100vw;
`;
const Box = styled.div`
  margin-left: 70%;
  margin-top: -230px;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  :hover& {
    cursor: pointer;
    box-shadow: rgba(51, 2, 251, 0.8) 0px 4px 16px 10px;
    transition: 0.5s ease-in-out;
  }
`;
export default SpecificLawyer;
