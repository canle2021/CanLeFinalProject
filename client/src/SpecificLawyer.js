import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
const SpecificLawyer = () => {
  const { _id } = useParams();

  const {
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

  console.log("specificLawyer", specificLawyer);
  console.log("specificLawyerPicture", specificLawyerPicture);
  return (
    <SpecificLawyerDiv>
      <LawyerpictureDiv>
        <Picture src={specificLawyerPicture.picture}></Picture>
        <Name>
          {specificLawyer.firstName} {specificLawyer.lastName}, Lawyer
        </Name>
      </LawyerpictureDiv>
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
