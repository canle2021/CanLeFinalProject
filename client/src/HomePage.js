import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [allLawyersInformation, setAllLawyersInformation] = useState([]);
  const [allLawyersPicture, setAllLawyersPicture] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`/api/get-lawyers`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Loading data error");
        }
        return res.json();
      })
      .then((data) => {
        setAllLawyersInformation(data.lawyersInfomation || []);
        setAllLawyersPicture(data.lawyerspicture || []);
      })
      .catch((err) => {
        console.log("err", err);
        navigate("/*");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return !loading ? (
    <HomePageDiv>
      <h1>MEET OUR TEAM</h1>
      <Team>
        {allLawyersPicture.map((picture, index) => {
          return (
            <Box key={index}>
              <LinkToProfile to={`/lawyer/${picture._id}`}>
                <LawyerpictureDiv>
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
              </LinkToProfile>
            </Box>
          );
        })}
      </Team>
    </HomePageDiv>
  ) : (
    <LoadingDiv>
      <Loading />
    </LoadingDiv>
  );
};

const LoadingDiv = styled.div`
  width: 100vw;
  height: 100vh;
  font-size: 50px;
  color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LinkToProfile = styled(Link)`
  text-decoration: none;
`;
const Picture = styled.img`
  width: 100%;
  margin: 0;
`;
const LawyerpictureDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Team = styled.div`
  flex-wrap: wrap;
  gap: 60px 50px;
  width: 1280px;
  display: flex;
  justify-content: center;
`;
const HomePageDiv = styled.div``;
const Box = styled.div`
  width: 280px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(39, 7, 214, 0.8) 0px 2px 8px 0px;
  :hover& {
    cursor: pointer;
    box-shadow: rgba(39, 7, 214, 0.8) 0px 4px 16px 10px;
    transition: 0.5s ease-in-out;
  }
`;
const Name = styled.button`
  font-family: Georgia, serif;
  width: 100%;
  height: 80px;
  background: transparent;

  border: none;
  margin: 0;
  font-size: 18px;
  color: white;
  text-transform: uppercase;
  font-weight: 600;

  background: linear-gradient(
    90deg,
    rgba(0, 54, 245, 0.8) 0%,
    rgba(39, 7, 214, 0.8) 100%
  );
  :hover& {
    cursor: pointer;
    transition: 0.5s ease-in-out;
  }
`;
export default HomePage;
