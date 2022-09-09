import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import HomePage from "./HomePage";
import Footer from "./Footer";

import SignUpPage from "./SignUp";
import SpecificLawyer from "./SpecificLawyer";
import ClientProfile from "./ClientProfile";
import LawyerProfile from "./LawyerProfile";
import LawyerWorkingPage from "./LawyerWrokingPage";
import AppointmentConfirmed from "./AppointemtnConfirmed";
import MessageSenderProfile from "./MessageSenderProfile";
import ListOfSendersForNewMessages from "./ListOfSendersForNewMessages";
import ListOfSendersForNewAppointment from "./ListOfSendersForNewAppointment";
import UpComingAppointments from "./UpComingAppointments";
import ErrorPage from "./ErrorPage";
function App() {
  return (
    <Router>
      <SizeContainer>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route exact path="/lawyer/:_id" element={<SpecificLawyer />} />

          <Route exact path="/signUp" element={<SignUpPage />} />
          <Route path="/clientProfile" element={<ClientProfile />} />
          <Route path="/lawyerProfile" element={<LawyerProfile />} />
          <Route
            path="/message-sender-profile/:_id"
            element={<MessageSenderProfile />}
          />
          <Route
            path="/new-message-senderIds-list"
            element={<ListOfSendersForNewMessages />}
          />
          <Route
            path="/new-appointments-senderIds-list"
            element={<ListOfSendersForNewAppointment />}
          />
          <Route
            path="/LawyerWorkingPage/:id"
            element={<LawyerWorkingPage />}
          />
          <Route
            path="/upcoming-appointments"
            element={<UpComingAppointments />}
          />
          <Route
            path="/AppointmentConfirmed"
            element={<AppointmentConfirmed />}
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </SizeContainer>
    </Router>
  );
}

const SizeContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default App;
