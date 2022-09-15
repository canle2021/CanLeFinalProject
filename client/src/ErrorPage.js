import React from "react";
import styled from "styled-components";
import { BiError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const ErrorPage = () => {
  const navigate = useNavigate();
  const homepageButton = (e) => {
    navigate("/");
  };
  return (
    <ErrorPageDiv>
      <h1>
        Sorry, we have some unexpected errors! Please reload the page or
        relocate the right website's path.
      </h1>
      <ErrorIcon>
        <BiError />
      </ErrorIcon>
      <BackHomepage onClick={homepageButton}>Go to home page</BackHomepage>
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
    width: 56%;
    margin-top: -200px;
  }
`;

export default ErrorPage;
