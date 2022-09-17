import React, { useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Footer = () => {
  const { userProfile, sucessfullyVerification, userInDatabase } =
    useContext(UserContext);
  return (
    <FooterDiv>
      <NavigationDiv>
        <h1>Navigation</h1>
        <LinkToHomePage to={`/`}>
          <p>Home</p>
        </LinkToHomePage>
      </NavigationDiv>
      <QuoteDiv>
        <h1>
          " The most authentic thing about us is our capacity to create, to
          overcome, to endure, to transform, to love and to be greater than our
          suffering. "
        </h1>

        <p>Ben Okri</p>
      </QuoteDiv>
    </FooterDiv>
  );
};
const LinkToHomePage = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.5rem;
`;
const NavigationDiv = styled.div`
  margin-left: 10%;
  margin-bottom: 20px;
  width: 50vw;
`;
const QuoteDiv = styled.div`
  width: 50vw;
  margin-right: 10%;
  margin-bottom: 20px;
`;
const FooterDiv = styled.div`
  color: #fff;
  background-color: black;
  height: auto;

  justify-content: space-between;
  justify-items: center;

  display: flex;

  width: 100vw;
`;

export default Footer;
