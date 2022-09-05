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
/*   post : Message
/**********************************************************/
const addMessage = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  // "senderId": "from the logged in user"
  // "receiverId": "from the current viewed page of lawyer profile"
  //   "subject": "this is the test message",
  //   "message": "this is the test message",
  //   "firstName": "this is the test message",
  //   "lastName": "this is the test message",
  // }
  // remember to copy all this to F.E

  if (
    !body.senderId ||
    !body.receiverId ||
    !body.message ||
    !body.firstName ||
    !body.lastName
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

    const inserMessage = await db.collection("messages").insertOne(body);

    if (inserMessage.insertedId !== "") {
      //  this is to make sure the <messages> collection was updated successfully

      return res.status(200).json({
        status: 200,
        data: body,
        message: ` The messages was successfully added`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, messages was NOT successfully added for some reason`,
      });
    }
  } catch (err) {
    console.log("Insert messages endpoint", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get all messages BY receiverId
  /**********************************************************/

const getAllMessagesByReceiverId = async (req, res) => {
  const { receiverId } = req.params;
  console.log("email", { receiverId });
  try {
    await client.connect();
    const findAllMessages = await db
      .collection("messages")
      .find({ receiverId })
      .sort({ time: -1 })
      .toArray();

    if (findAllMessages.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all message with the reciever Id : ${receiverId}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAllMessages,
        message: ` We successfully all message with the reciever Id : ${receiverId}`,
      });
    }
  } catch (err) {
    console.log("get All Messages By ReceiverId ", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get all messages BY senderId
  /**********************************************************/

const getAllMessagesBySenderId = async (req, res) => {
  const { senderId } = req.params;

  try {
    await client.connect();
    const findAllMessages = await db
      .collection("messages")
      .find({ senderId })
      .sort({ time: -1 })
      .toArray();

    if (findAllMessages.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all message with the sender Id : ${senderId}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAllMessages,
        message: ` We successfully all message with the sender Id : ${senderId}`,
      });
    }
  } catch (err) {
    console.log("get All Messages By senderId ", err);
    //
  }
  client.close();
};
module.exports = {
  addMessage,
  getAllMessagesByReceiverId,
  getAllMessagesBySenderId,
};
