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
/*  edit lawyer'picture
/**********************************************************/
const editPicture = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "picture": "base 64",
  // }
  // _id is the user Id in each document in users collection
  // remember to copy all this to F.E

  if (!body._id || !body.picture) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }

  try {
    await client.connect();
    const findUserId = await db
      .collection("usersPictures")
      .findOne({ _id: body._id });

    if (!findUserId) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the user with use's id :${body._id} does not exist, you can not add this picture to your account`,
      });
    }

    const oldPicture = {
      userId: findUserId._id,
      oldPicture: findUserId.picture,
    };

    const findPicture = await db
      .collection("usersPictures")
      .findOne({ picture: body.picture });
    // validate same picture

    if (findPicture) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the picture with use's id :${body._id} is existing, you can not update this new picture in your account`,
      });
    }

    const updatePicture = await db.collection("usersPictures").updateOne(
      {
        _id: body._id,
      },
      { $set: { picture: body.picture } }
    );
    if (updatePicture.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const impageChanged = await db
        .collection("pictureChanged")
        .insertOne(oldPicture);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The picture with user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, picture with id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update picture endpoint", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit userName
/**********************************************************/

const editUserName = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "userName": "userName",
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.userName) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }

  try {
    await client.connect();
    const findUserId = await db.collection("users").findOne({ _id: body._id });

    if (!findUserId) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the user with use's id :${body._id} does not exist`,
      });
    }

    const oldUserName = {
      userId: findUserId._id,
      oldUserName: findUserId.userName,
    };

    // validate same UserName in users collection
    // this function return an array of users which have UserName included body.userName text
    const findUserNamesArray = await db
      .collection("users")
      .find({ userName: { $regex: body.userName, $options: "i" } })
      .toArray();
    //  this function will test there is at least 1 user is having the same userName with the body.userName.
    const findTheSameUserName = findUserNamesArray.find(
      (user) => user.userName.toLowerCase() === body.userName.toLowerCase()
    );

    if (findTheSameUserName) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new userName is the same with existing userName`,
      });
    }

    const updateUserName = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { userName: body.userName } }
    );
    if (updateUserName.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const userNameChanged = await db
        .collection("userNameChanged")
        .insertOne(oldUserName);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The userName of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the userName of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update usename", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit name: firstName lastName
/**********************************************************/
const editName = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "firstName": "firstName",
  //   "lastName": "lastName",
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.firstName || !body.lastName) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }

  try {
    await client.connect();
    const findUserId = await db.collection("users").findOne({ _id: body._id });

    if (!findUserId) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the user with use's id :${body._id} does not exist`,
      });
    }

    const oldName = {
      userId: findUserId._id,
      oldFirstName: findUserId.firstName,
      oldLastName: findUserId.lastName,
    };
    // validate current firstName lastName
    // this function return an array of users which have firstName, lastName included body.firstName,lastName text

    const findSameNamesArray = await db
      .collection("users")
      .find({
        firstName: { $regex: body.firstName, $options: "i" },
        lastName: { $regex: body.lastName, $options: "i" },
      })
      .toArray();

    //  this function will test there is at least 1 user is having the same name with the name in body object

    const findTheSameName = findSameNamesArray.find(
      (user) =>
        user.firstName.toLowerCase() === body.firstName.toLowerCase() &&
        user.lastName.toLowerCase() === body.lastName.toLowerCase()
    );

    if (findTheSameName) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new name is the same with existing name`,
      });
    }

    const updateName = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { firstName: body.firstName, lastName: body.lastName } }
    );
    if (updateName.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const nameChanged = await db.collection("nameChanged").insertOne(oldName);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The name of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the name of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update name", err);
    //
  }
  client.close();
};

module.exports = {
  editPicture,
  editUserName,
  editName,
};
