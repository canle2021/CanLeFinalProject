import React from "react";
import styled from "styled-components";

const Header = () => {
  return (
    <HeaderDiv>
      <h1>Header</h1>
    </HeaderDiv>
  );
};

const HeaderDiv = styled.div`
  color: #fff;
  background-color: black;
  height: auto;
  text-align: center;
  width: 100vw;
`;

export default Header;
