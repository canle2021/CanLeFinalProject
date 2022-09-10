import React, { useContext, useEffect, useParams } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "./UserContext";
import MessagesView from "./MeesagesView";
import UpComingAppointments from "./UpComingAppointments";
const LawyerProfile = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    sucessfullyVerification,
    userInDatabase,
    setUserInDatabase,
  } = useContext(UserContext);

  console.log("userProfile", userProfile);
  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }
    // check already in database? not redirect to sign up page
    if (!userInDatabase) {
      navigate("/signUp");
    }
  }, [sucessfullyVerification]);
  return (
    <LawyerProfileDiv>
      <h1>
        Lawyer {userProfile.firstName} {userProfile.lastName} page
      </h1>
      <InformationDiv>
        <p>Picture Id: {userProfile.pictureId}</p>
        <p>Username: {userProfile.userName}</p>
        <p>FirstName: {userProfile.firstName}</p>
        <p>LastName: {userProfile.lastName}</p>
        <p>Email: {userProfile.email}</p>
        <p>Status: {userProfile.status}</p>
        <p>Phone: {userProfile.phone}</p>
        <p>City: {userProfile.city}</p>
        <p>Province: {userProfile.province}</p>
        <p>Postal Code: {userProfile.postalCode}</p>
        <p>Country: {userProfile.country}</p>
      </InformationDiv>
      <LinkToUpcomingAppointmentsPage to="/upcoming-appointments">
        <UpComingAppointmentsDiv>
          Up coming appointments
        </UpComingAppointmentsDiv>
      </LinkToUpcomingAppointmentsPage>
      <LinkToUpcomingAppointmentsPage to="/not-confimed-upcoming-appointments">
        <UpComingAppointmentsDiv>
          Not confirmed appointments
        </UpComingAppointmentsDiv>
      </LinkToUpcomingAppointmentsPage>

      <MessagesView />
    </LawyerProfileDiv>
  );
};
const UpComingAppointmentsDiv = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;
const LinkToUpcomingAppointmentsPage = styled(Link)``;

const InformationDiv = styled.div``;

const LawyerProfileDiv = styled.div``;

export default LawyerProfile;
