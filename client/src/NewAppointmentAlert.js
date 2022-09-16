import React from "react";

import styled from "styled-components";

const NewAppointmentAlert = () => {
  return (
    <NewAppointmentAlertDiv>
      <button>
        You still have new appointment to confirm? Click here to check!
      </button>
    </NewAppointmentAlertDiv>
  );
};

const NewAppointmentAlertDiv = styled.div``;

export default NewAppointmentAlert;
