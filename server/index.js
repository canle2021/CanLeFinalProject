"use strict";

const express = require("express");
const morgan = require("morgan");
const { getAllUsers } = require("./getHandlers");
const { createAccount, addPicture } = require("./addAccount&Picture");
const {
  editPicture,
  editUserName,
  editName,
} = require("./updateProfileHandlers");
const { editEmail, editPhone, editAddress } = require("./updateProfilePart2");
const {
  editQuote,
  editPracticeAreas,
  editCredentials,
} = require("./lawyerProfileHandlers");
const { editEducation, editExperience } = require("./lawyerHandlersPart2");
const PORT = 8000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // RESTFUL endpoints

  // RESTFUL endpoints
  .get(`/api/get-all-users`, getAllUsers)
  .post(`/api/add-user`, createAccount)
  .post(`/api/add-user-picture`, addPicture)
  .patch("/api/update-picture", editPicture)
  .patch("/api/update-userName", editUserName)
  .patch("/api/update-name", editName)
  .patch("/api/update-email", editEmail)
  .patch("/api/update-phone-number", editPhone)
  .patch("/api/update-address", editAddress)
  .patch("/api/update-quote", editQuote)
  .patch("/api/update-practice-areas", editPracticeAreas)
  .patch("/api/update-credentials", editCredentials)
  .patch("/api/update-education", editEducation)
  .patch("/api/update-experience", editExperience)
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })
  .listen(PORT, () => console.info(`LISTENING ON PORT ${PORT}`));
