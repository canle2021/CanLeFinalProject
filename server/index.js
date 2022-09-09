"use strict";

const express = require("express");
const morgan = require("morgan");
const {
  getAllUsers,
  getSpecificUser,
  getLawyers,
  getAppointments,
  getSpecificUserByEmail,
} = require("./getHandlers");
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
const {
  editEducation,
  editExperience,
  editLanguages,
  editHourRate,
} = require("./lawyerHandlersPart2");
const {
  addMessage,
  getAllMessagesByReceiverId,
  getAllMessagesBySenderId,
  changeMessageToRead,
  getConversation,
} = require("./messageHandlers");
const {
  addAppointment,
  deleteSpecificAppointments,
  getAllAppointmentsReceiverId,
  getAllAppointmentsReceiverIdAndSenderId,
  changeAppointmentsToConfirmed,
  getAppointmentById,
  getAllAppointmentsBySenderId,
} = require("./appointmentHandlers");
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
  .get(`/api/get-specific-user/:_id`, getSpecificUser)
  .get(`/api/get-specific-user-by-email/:email`, getSpecificUserByEmail)
  .get(`/api/get-lawyers`, getLawyers)
  .get(`/api/get-appointments`, getAppointments)
  .get(`/api/get-appointment/:_id`, getAppointmentById)
  .get(
    `/api/get-appointments-by-senderId/:senderId`,
    getAllAppointmentsBySenderId
  )
  .get(
    `/api/get-appointments-by-receiverId/:receiverId`,
    getAllAppointmentsReceiverId
  )
  .get(
    `/api/get-all-messages-by-receiverId/:receiverId`,
    getAllMessagesByReceiverId
  )

  .get(`/api/get-all-messages-by-senderId/:senderId`, getAllMessagesBySenderId)
  .get(`/api/get-conversation/:receiverId/:senderId`, getConversation)
  .get(
    `/api/get-appointment-both-sides/:receiverId/:senderId`,
    getAllAppointmentsReceiverIdAndSenderId
  )
  .patch(
    `/api/update-all-messages-by-senderId-receiverId-to-read`,
    changeMessageToRead
  )
  .patch(`/api/update-conversation-to-confirmed`, changeAppointmentsToConfirmed)

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
  .patch("/api/update-languages", editLanguages)
  .patch("/api/update-hour-rate", editHourRate)
  .post(`/api/add-message`, addMessage)
  .post(`/api/add-appointment`, addAppointment)
  .delete(`/api/delete-appointment/:_id`, deleteSpecificAppointments)

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "We dont have any endpoint like what you put in.",
    });
  })
  .listen(PORT, () => console.info(`LISTENING ON PORT ${PORT}`));
