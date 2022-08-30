"use strict";
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(MONGO_URI, options);

const dbName = "FinalProject";
const db = client.db(dbName);
/**********************************************************/
/*   create Appointment
/**********************************************************/

const addAppointment = async (req, res) => {
  const body = req.body;
  // with the time, duration, we should have chose list in F.E
  // supposed the posting method wil have a req.body with this format:
  //{_id
  // "senderId": from the logged in user
  // "receiverId": from the current viewed page of lawyer profile
  //   "message": "this is the test message",
  //   "date": "10-10-2022"
  //   "time": "10:30am"
  //   "duration": "60 mins",
  //   "hourRate": "$100",
  //   "location": "location",
  // }
  // remember to copy all this to F.E

  const newAppointment = {
    _id: uuidv4(),
    ...body,
  };
  if (
    !body.senderId ||
    !body.receiverId ||
    !body.message ||
    !body.date ||
    !body.time ||
    !body.duration ||
    !body.hourRate ||
    !body.location
  ) {
    return res.status(400).json({
      status: 400,
      message: "Sorry. Please provide all the required information ",
    });
  }
  if (body.senderId === body.receiverId) {
    return res.status(400).json({
      status: 400,
      message: "Sorry. You can not give a message to yourselve ",
    });
  }

  try {
    await client.connect();
    // need to check the availability of the lawyer's schedule like what we did with slingAir project?
    const findSenderId = await db
      .collection("users")
      .findOne({ _id: body.senderId });
    const findReceiverId = await db
      .collection("users")
      .findOne({ _id: body.receiverId });
    if (!findReceiverId || !findSenderId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Sorry. sender's Id or reciever's Id was not found ",
      });
    }

    const insertAppointment = await db
      .collection("appointments")
      .insertOne(newAppointment);

    if (insertAppointment.insertedId !== "") {
      //  this is to make sure the <appointments> collection was updated successfully

      return res.status(200).json({
        status: 200,
        data: body,
        message: ` The Appointment with id: ${newAppointment._id}was successfully added`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, Appointment was NOT successfully added for some reason`,
      });
    }
  } catch (err) {
    console.log("Insert Appointment endpoint", err);
    //
  }
  client.close();
};

/**********************************************************/
/*   delete appointment
/**********************************************************/
module.exports = {
  addAppointment,
};
