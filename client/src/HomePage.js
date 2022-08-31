import React, { useState, useEffect } from "react";
import styled from "styled-components";

const HomePage = () => {
  const [allLawyersInformation, setAllLawyersInformation] = useState([]);
  const [allLawyersPicture, setAllLawyersPicture] = useState([]);
  useEffect(() => {
    fetch(`/api/get-lawyers`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAllLawyersInformation(data.lawyersInfomation || []);
        setAllLawyersPicture(data.lawyerspicture || []);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  console.log("allLawyersInformation", allLawyersInformation);
  console.log("allLawyersPicture", allLawyersPicture);

  return (
    <HomePageDiv>
      <h1>HOME PAGE</h1>
      {allLawyersPicture.map((picture, index) => {
        return (
          <LawyerpictureDiv key={index}>
            <Picture src={picture.picture}></Picture>
            <Name>
              {allLawyersInformation.map((eachLawyer, index) => {
                if (eachLawyer._id === picture._id) {
                  return (
                    <span key={index}>
                      {eachLawyer.firstName} {eachLawyer.lastName}, Lawyer
                    </span>
                  );
                }
              })}
            </Name>
          </LawyerpictureDiv>
        );
      })}
    </HomePageDiv>
  );
};
const Name = styled.p``;
const Picture = styled.img``;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HomePageDiv = styled.div``;

export default HomePage;
