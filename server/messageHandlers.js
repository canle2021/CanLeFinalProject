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
  // senderId: from the logged in user
  // receiverId: from the current viewed page of lawyer profile
  //   "message": "this is the test message",
  // }
  // remember to copy all this to F.E

  const newMessage = {
    ...body,
  };
  if (!body.senderId || !body.receiverId || !body.message) {
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
    // add new message to usersPictures collection
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
module.exports = {
  addMessage,
};
