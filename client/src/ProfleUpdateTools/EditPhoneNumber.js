import React, { useContext, useEffect, useParams, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { AiOutlineForm } from "react-icons/ai";

const EditPhoneNumber = () => {
  const navigate = useNavigate();

  const { userProfile, sucessfullyVerification } = useContext(UserContext);
  // remember to delete all the white space begining and at the end of each input
  // show the alert if the email is already use

  const [values, setValues] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value.trim();
    setValues((values) => ({ ...values, [name]: value }));
    // values is just a temperary variable which is holding an object contents inputs
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let objectToBePosted = {
      _id: userProfile._id,
      ...values,
    };
    try {
      const posting = await fetch(`/api/update-phone-number`, {
        method: "PATCH",
        body: JSON.stringify(objectToBePosted),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const converToJson = await posting.json();
      console.log("converToJson", converToJson);
      if (converToJson.status === 200) {
        alert(
          "THANK YOU! You successfully edit your username. Please refresh 'My page' to see the update"
        );
        navigate("/LawyerProfile");
      } else {
        alert(converToJson.message);
      }
    } catch (err) {
      console.log(err);
    }

    console.log("objectToBePosted", objectToBePosted);
  };

  useEffect(() => {
    if (!sucessfullyVerification) {
      navigate("/");
    }
    // check already signed in? not redirect to sign up page
  }, [sucessfullyVerification]);
  return (
    <SignUpPageDiv>
      {/* conditional rendering those lines cause we have 2 possible cases of sign up */}

      <FormDiv>
        <Form onSubmit={handleSubmit}>
          <SignUpTitle>
            <AiOutlineForm style={{ marginRight: "10px", fontSize: "30px" }} />
            Update phone number
          </SignUpTitle>

          <HeadLine>Current phone number: {userProfile.phone}</HeadLine>
          <HeadLine>New phone number:</HeadLine>
          <Input
            placeholder="Phone Number (required)"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            name="phone"
            required
            onChange={handleChange}
          />
          <small>* Phone Number Format: 123-456-7890</small>

          <SubmitButton
            type="submit"
            value="Submit"
            name="confirmButton"
          ></SubmitButton>
        </Form>
      </FormDiv>
    </SignUpPageDiv>
  );
};

const HeadLine = styled.h1`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const SubmitButton = styled.input`
  font-weight: 500;
  font-size: 20px;
  cursor: pointer;
  color: white;
  background-color: #30b06b;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 60px;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  border: none;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  &:hover {
    background-color: #269157;

    transition: 0.5s ease-in-out;
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SignUpTitle = styled.h3`
  font-size: 35px;
  color: black;
  font-family: "IBM Plex Sans", sans-serif;
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid lightgrey;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const Input = styled.input`
  width: 390px;
  height: 40px;
  margin-bottom: 10px;
  padding-left: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

const FormDiv = styled.div`
  border: solid 2px var(--color-alabama-crimson);
  height: fit-content;
`;
const SignUpPageDiv = styled.div`
  min-height: 100vh;
`;

export default EditPhoneNumber;
