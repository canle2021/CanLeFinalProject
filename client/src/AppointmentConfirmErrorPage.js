import React from "react";
import styled from "styled-components";
import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const AppointmentConfirmErrorPage = () => {
  const navigate = useNavigate();
  const homepageButton = (e) => {
    navigate("/");
    // go back to homepage and reload the page too
    window.location.reload();
  };
  return (
    <ErrorPageDiv>
      <h1>
        Sorry, some errors with you appointment confirmation. Please contact
        your lawyer to have more information.
      </h1>
      <ErrorIcon>
        <BiError />
      </ErrorIcon>
      <BackHomepage onClick={homepageButton}>Go to the home page</BackHomepage>
    </ErrorPageDiv>
  );
};
const BackHomepage = styled.button`
  height: 50px;
  width: 200px;
  border: 2px solid blue;
  border-radius: 15px;
  text-transform: uppercase;
  background-color: transparent;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    background-color: blue;
    color: white;
    transition: 0.5s ease-out;
  }
  margin-top: 40px;
`;

const ErrorIcon = styled.div`
  font-size: 25rem;
  color: red;
`;
const ErrorPageDiv = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    color: red;
    width: 80%;
    margin-top: -200px;
  }
`;

export default AppointmentConfirmErrorPage;
