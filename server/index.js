"use strict";

const express = require("express");
const morgan = require("morgan");
const { createAccount, addPicture } = require("./addAccount&Picture");
const {
  editPicture,
  editUserName,
  editName,
} = require("./updateProfileHandlers");
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
  .post(`/api/add-user`, createAccount)
  .post(`/api/add-user-picture`, addPicture)
  .patch("/api/update-picture", editPicture)
  .patch("/api/update-userName", editUserName)
  .patch("/api/update-name", editName)
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })
  .listen(PORT, () => console.info(`LISTENING ON PORT ${PORT}`));
