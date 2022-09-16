import React from "react";

import styled from "styled-components";
import { UserContext } from "./UserContext";
const NewMessagesAlert = () => {
  return (
    <NewMessagesAlertDiv>
      <button>You still have new message(s)? Click here to check!</button>
    </NewMessagesAlertDiv>
  );
};

const NewMessagesAlertDiv = styled.div``;

export default NewMessagesAlert;
