import React, { useContext, useEffect, useParams, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import { AiOutlineForm } from "react-icons/ai";

const EditAddress = () => {
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
      const posting = await fetch(`/api/update-address`, {
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
        alert("THANK YOU! You successfully editted your address.");
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
      <FormDiv>
        <Form onSubmit={handleSubmit}>
          <SignUpTitle>
            <AiOutlineForm style={{ marginRight: "10px", fontSize: "30px" }} />
            Update Address
          </SignUpTitle>
          <HeadLine>New Address:</HeadLine>
          <Input
            placeholder="House Number And Street Name (required)"
            type="text"
            name="streetNumber"
            required
            onChange={handleChange}
          />
          <Input
            placeholder="City (required)"
            type="text"
            name="city"
            required
            onChange={handleChange}
          />
          <Input
            placeholder="Province (required)"
            type="text"
            name="province"
            required
            onChange={handleChange}
          />

          <Input
            placeholder="Country (required)"
            type="text"
            name="country"
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Postal code (required)"
            type="text"
            name="postalCode"
            pattern="[A-Z]{1}[0-9]{1}[A-Z]{1} [0-9]{1}[A-Z]{1}[0-9]{1}"
            minlength="6"
            maxlength="7"
            size="10"
            required
            onChange={handleChange}
          />
          <small>* Postal Code Format: T4L 0C2</small>

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
    background-color: purple;

    transition: 0.5s ease-in-out;
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

export default EditAddress;
