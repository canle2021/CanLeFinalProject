"use strict";
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const moment = require("moment");
const _ = require("lodash");
const { orderBy } = require("lodash");
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

/**********************************************************/
/*  Change isRead from false to true after click on 
/**********************************************************/
const changeMessageToRead = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  // "senderId": "from the logged in user"
  // "receiverId": "from the current viewed page of lawyer profile"
  // }
  // remember to copy all this to F.E

  if (!body.senderId || !body.receiverId) {
    return res.status(400).json({
      status: 400,
      message: "Sorry. Please provide all the required information ",
    });
  }
  try {
    await client.connect();
    const findAllMessages = await db
      .collection("messages")
      .find({ receiverId: body.receiverId, senderId: body.senderId })
      .toArray();
    if (findAllMessages.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we could not find all message with the sender Id : ${senderId}, and receiverId: ${receiverId}`,
      });
    }

    const updateMessagesToRead = await db.collection("messages").updateMany(
      {
        receiverId: body.receiverId,
        senderId: body.senderId,
      },
      { $set: { isRead: true } }
    );

    console.log("updateMessagesToRead", updateMessagesToRead);
    if (updateMessagesToRead.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The messges senderId : ${body.senderId}, and receiverId: ${body.receiverId} was successfully updated to read`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry! The messges sender Id : ${body.senderId}, and receiverId: ${body.receiverId}} was NOT successfully updated to read because of some reason or all these messages were read.`,
      });
    }
  } catch (err) {
    console.log("Update messages to read", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  Change isRead from false to true after click on Confirmation messages from system
/**********************************************************/
const changeSystemMessageToRead = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  // "senderId": "from the logged in user"
  // "receiverId": "from the current viewed page of lawyer profile"
  // "time": timestamp of the message"
  // }
  // remember to copy all this to F.E

  if (!body.senderId || !body.receiverId) {
    return res.status(400).json({
      status: 400,
      message: "Sorry. Please provide all the required information ",
    });
  }
  try {
    await client.connect();
    const findAllMessages = await db
      .collection("messages")
      .find({ receiverId: body.receiverId, senderId: body.senderId })
      .toArray();
    if (findAllMessages.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we could not find all message with the sender Id : ${senderId}, and receiverId: ${receiverId}`,
      });
    }

    const updateMessagesToRead = await db.collection("messages").updateMany(
      {
        receiverId: body.receiverId,
        senderId: body.senderId,
        time: body.time,
      },
      { $set: { isRead: true } }
    );

    console.log("updateMessagesToRead", updateMessagesToRead);
    if (updateMessagesToRead.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The messges senderId : ${body.senderId}, and receiverId: ${body.receiverId} was successfully updated to read`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry! The messges sender Id : ${body.senderId}, and receiverId: ${body.receiverId}} was NOT successfully updated to read because of some reason or all these messages were read.`,
      });
    }
  } catch (err) {
    console.log("Update messages to read", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get Conversation
  /**********************************************************/

const getConversation = async (req, res) => {
  const { senderId } = req.params;
  const { receiverId } = req.params;

  try {
    await client.connect();
    const findAllMessagesSent = await db
      .collection("messages")
      .find({ receiverId: receiverId, senderId: senderId })
      .sort({ time: -1 })
      .toArray();
    const findAllMessagesReceived = await db
      .collection("messages")
      .find({ receiverId: senderId, senderId: receiverId })
      .sort({ time: -1 })
      .toArray();

    if (findAllMessagesSent.length < 1 && findAllMessagesReceived.length < 1) {
      return res.status(400).json({
        status: 404,
        message: ` Sorry, we can not find all conversations between : ${senderId} and receiverId: ${receiverId} `,
      });
    } else {
      const conversation = [].concat(
        findAllMessagesSent,
        findAllMessagesReceived
      );
      const sortedMessages = orderBy(
        conversation,
        (message) => moment(message.time),
        "desc"
      );

      return res.status(200).json({
        status: 200,
        messagesSent: findAllMessagesSent,
        messagesReceived: findAllMessagesReceived,
        conversationArray: sortedMessages,
        message: ` We successfully all conversations between : ${senderId} and receiverId: ${receiverId}`,
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
  changeMessageToRead,
  getConversation,
  changeSystemMessageToRead,
};
