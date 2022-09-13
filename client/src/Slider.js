import React from "react";
import styled from "styled-components";

const Slider = ({ Welcome }) => {
  return (
    <CompContainer>
      <SliderBanner Welcome={Welcome}></SliderBanner>
    </CompContainer>
  );
};

const CompContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
`;

const SliderBanner = styled.div`
  width: 100%;
  height: 400px;
  background-color: rgba(47, 5, 220, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => props.Welcome});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const TextPosition = styled.div`
  width: 1280px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default Slider;
