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
  // "senderId": "from the logged in user"
  // "receiverId": "from the current viewed page of lawyer profile"
  // "caseId": "case ID wil be created by the lawyer"
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
    !body.subject ||
    !body.senderId ||
    !body.receiverId ||
    !body.lawyer ||
    !body.client ||
    !body.message ||
    !body.date ||
    !body.start ||
    !body.end ||
    !body.duration ||
    !body.hourRate ||
    !body.timezone ||
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
  const newDateOfTimeEnd = new Date(body.timeEndAppointment);
  const timeEndToNumber = newDateOfTimeEnd.getTime();
  //
  const newDateOfTimeStart = new Date(body.timeStartAppointment);
  const timeStartToNumber = newDateOfTimeStart.getTime();
  if (timeEndToNumber < Date.now()) {
    return res.status(400).json({
      status: 400,
      message: `Sorry. You can not book ending time before present time,${Date(
        Date.now()
      ).toString()} `,
    });
  }
  if (timeEndToNumber <= timeStartToNumber) {
    return res.status(400).json({
      status: 400,
      message: `Sorry. You can not book ending time before the start time.`,
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
        data: {
          ...body,
          _id: newAppointment._id,
        },
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
const deleteSpecificAppointments = async (req, res) => {
  const body = req.body;
  // suppose we have a body of:
  // {userId: "userProfile._id",
  // "_id: "appointment for delete _id"}
  // lawyer and admin only can delete, client can not

  try {
    await client.connect();

    const findSpecificUser = await db
      .collection("users")
      .findOne({ _id: body.userId });

    if (!findSpecificUser) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all the user's information with id : ${body.userId}`,
      });
    }

    const findAppointment = await db
      .collection("appointments")
      .findOne({ _id: body._id });
    if (!findAppointment) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, we can not find the Appointment with id: ${body._id} information`,
      });
    } else {
      const deleteAppointment = await db
        .collection("appointments")
        .deleteOne({ _id: body._id });

      if (deleteAppointment.deletedCount > 0) {
        const appointmentDeleted = {
          ...findAppointment,
          personWhoDeleted: body.userId,
          timeDeleted: Date(Date.now()).toString(),
        };
        console.log("appointmentDeleted", appointmentDeleted);
        const trackingDeleted = await db
          .collection("deletedAppointments")
          .insertOne(appointmentDeleted);
        return res.status(200).json({
          status: 200,
          data: appointmentDeleted,
          message: ` We successfully deleted the Appointment with id: ${body._id}`,
        });
      }
    }
  } catch (err) {
    console.log("get delete Appointment ", err);
    //
  }
  client.close();
};
// **********************************************************/
/*  get all appointments BY receiverId
  /**********************************************************/

const getAllAppointmentsReceiverId = async (req, res) => {
  const { receiverId } = req.params;

  try {
    await client.connect();
    const findAllAppointments = await db
      .collection("appointments")
      .find({ receiverId })
      .sort({ timeOfCreateingAppointment: -1 })
      .toArray();

    if (findAllAppointments.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all appointments with the reciever Id : ${receiverId}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAllAppointments,
        message: ` We successfully all appointments with the reciever Id : ${receiverId}`,
      });
    }
  } catch (err) {
    console.log("get All Appointments By ReceiverId ", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get All Appointments BY ReceiverId AndSenderId
  /**********************************************************/

const getAllAppointmentsReceiverIdAndSenderId = async (req, res) => {
  const { senderId } = req.params;
  const { receiverId } = req.params;

  try {
    await client.connect();
    const findAllAppointments = await db
      .collection("appointments")
      .find({ receiverId: receiverId, senderId: senderId })
      .sort({ timeOfCreateingAppointment: -1 })
      .toArray();

    if (findAllAppointments.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all appointments with the reciever Id : ${receiverId} and sender ID: ${senderId}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAllAppointments,
        message: ` We successfully all appointments with the reciever Id : ${receiverId} and sender ID: ${senderId}`,
      });
    }
  } catch (err) {
    console.log("get All Appointments By ReceiverId and SenderID", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  Change isConfrimed from false to true after click on 
/**********************************************************/
const changeAppointmentsToConfirmed = async (req, res) => {
  // suppose we have the body : "_id":"fbd2c927-15b4-41db-820a-62d9e819b4fd"
  const { _id } = req.body;
  console.log({ _id });
  try {
    await client.connect();
    const findAppointment = await db
      .collection("appointments")
      .findOne({ _id });
    if (!findAppointment) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we could not find an Appointment with the Id : ${_id}`,
      });
    }

    const updateAppointmentsToConfirmed = await db
      .collection("appointments")
      .updateOne(
        {
          _id,
        },
        { $set: { isConfirmed: true } }
      );

    if (updateAppointmentsToConfirmed.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        data: _id,
        message: ` The Appointment with the Id : ${_id} was successfully updated to confirmed`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry! The Appointment with the Id : ${_id} was NOT updated to confirmed  successfully for some reason.`,
      });
    }
  } catch (err) {
    console.log("Update The Appointment to confirmed", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get appointment by _id
/**********************************************************/
const getAppointmentById = async (req, res) => {
  const { _id } = req.params;
  console.log({ _id });
  try {
    await client.connect();
    const findAppointment = await db
      .collection("appointments")
      .findOne({ _id });
    if (!findAppointment) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we could not find an Appointment with the Id : ${_id}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAppointment,
        message: ` The Appointment with the Id : ${_id} was successfully found`,
      });
    }
  } catch (err) {
    console.log("Update The Appointment to confirmed", err);
    //
  }
  client.close();
};
// **********************************************************/
/*  get all appointments BY senderId
  /**********************************************************/

const getAllAppointmentsBySenderId = async (req, res) => {
  const { senderId } = req.params;

  try {
    await client.connect();
    const findAllAppointments = await db
      .collection("appointments")
      .find({ senderId })
      .sort({ timeOfCreateingAppointment: -1 })
      .toArray();

    if (findAllAppointments.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all appointments with the sender Id : ${senderId}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAllAppointments,
        message: ` We successfully all appointments with the sender Id : ${senderId}`,
      });
    }
  } catch (err) {
    console.log("get All Appointments By senderId ", err);
    //
  }
  client.close();
};
module.exports = {
  addAppointment,
  deleteSpecificAppointments,
  getAllAppointmentsReceiverId,
  getAllAppointmentsReceiverIdAndSenderId,
  changeAppointmentsToConfirmed,
  getAppointmentById,
  getAllAppointmentsBySenderId,
};
