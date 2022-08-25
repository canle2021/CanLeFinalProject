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
/*   post :create user's account
/**********************************************************/

const createAccount = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "userName": "Rooney",
  //   "firstName": "Rooney",
  //     "lastName": "Beatens",
  //     "email": "rbeatens0@bandcamp.com",
  //     "status": "client",
  //     "phone": "274-534-0380",
  //     "streetNumber": "79 Independence Center",
  //     "city": "Lethbridge",
  //     "province": "Alberta",
  //     "postalCode": "T9M 0B1",
  //     "country": "Canada",
  // } remember to copy all this to F.E

  const newUser = {
    _id: uuidv4(),
    ...body,
  };
  if (
    !body.userName ||
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.phone ||
    !body.streetNumber ||
    !body.city ||
    !body.province ||
    !body.postalCode ||
    !body.country
  ) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }
  if (!body.email.includes("@")) {
    return res.status(400).json({
      status: 400,
      data: {},
      message:
        "Sorry. Please provide the correct form of email address(including @)",
    });
  }
  if (body.country.toLowerCase() !== "canada") {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Our current service is within Canada. ",
    });
  }
  // validate same username
  // validate same full name
  // validate same address
  // validate same email
  // validate same phone number
  // validate outside canada

  try {
    await client.connect();
    // ========= continue from here/

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
        message: ` Sorry, this new userName is existing, you can not use this new username`,
      });
    }

    // validate same name in the same address
    const findTheSameNamesArray = await db
      .collection("users")
      .find({
        firstName: { $regex: body.firstName, $options: "i" },
        lastName: { $regex: body.lastName, $options: "i" },
        streetNumber: { $regex: body.streetNumber, $options: "i" },
        city: { $regex: body.city, $options: "i" },
        province: { $regex: body.province, $options: "i" },
        postalCode: { $regex: body.postalCode, $options: "i" },
        country: { $regex: body.country, $options: "i" },
      })
      .toArray();

    //  this function will test there is at least 1 user has the same name in the same adsress
    const findTheSameName = findTheSameNamesArray.find(
      (user) =>
        user.firstName.toLowerCase() === body.firstName.toLowerCase() &&
        user.lastName.toLowerCase() === body.lastName.toLowerCase() &&
        user.streetNumber.toLowerCase() === body.streetNumber.toLowerCase() &&
        user.city.toLowerCase() === body.city.toLowerCase() &&
        user.province.toLowerCase() === body.province.toLowerCase() &&
        user.postalCode.toLowerCase() === body.postalCode.toLowerCase() &&
        user.country.toLowerCase() === body.country.toLowerCase()
    );

    if (findTheSameName) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, this user is already exist, you can not create the new account with this information`,
      });
    }

    // validate same email in users collection
    // this function return an array of users which have email included body.email text
    const findSameEmailsArray = await db
      .collection("users")
      .find({ email: { $regex: body.email, $options: "i" } })
      .toArray();
    //  this function will test there is at least 1 user is having the same email with the body.email.
    const findTheSameEmail = findSameEmailsArray.find(
      (user) => user.email.toLowerCase() === body.email.toLowerCase()
    );
    if (findTheSameEmail) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new email is the same with the existing email, you can not create the new account with this information`,
      });
    }

    const findPhoneNumber = await db
      .collection("users")
      .findOne({ phone: body.phone });

    if (findPhoneNumber) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the phone number :${body.phone} is existing, you can not create the new account with this phone number`,
      });
    }

    const insertNewUser = await db.collection("users").insertOne(newUser);

    if (insertNewUser.insertedId !== "") {
      //  this is to make sure the <users> collection was updated successfully

      return res.status(200).json({
        status: 200,
        data: newUser._id,
        message: ` The user with id: ${newUser._id} was successfully added`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the user with id: ${newUser._id} was NOT successfully added for some reason`,
      });
    }
  } catch (err) {
    console.log("Insert user endpoint", err);
    //
  }
  client.close();
};

/**********************************************************/
/*  add lawyer's picture
/**********************************************************/
const addPicture = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user to FE when login and push back to this end point
  //   "picture": "base 64",
  // }
  // remember to copy all this to F.E

  const newPicture = {
    ...body,
  };
  if (!body._id || !body.picture) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }

  // validate same picture

  try {
    await client.connect();
    const findUserId = await db.collection("users").findOne({ _id: body._id });

    if (!findUserId) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the user with use's id :${body._id} does not exist, you can not add this picture to your account`,
      });
    }

    const findPicture = await db
      .collection("usersPictures")
      .findOne({ picture: body.picture });

    if (findPicture) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the picture with use's id :${body._id} is existing, you can not add this picture to your account`,
      });
    }
    // add new picture to usersPictures collection
    const inserPicture = await db
      .collection("usersPictures")
      .insertOne(newPicture);
    console.log("inserPicture", inserPicture);
    // update status in  user document to lawer beause only the lawyers need portrait picture
    const updateStatus = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { status: "lawyer", pictureId: body._id } }
    );
    console.log("updateStatus", updateStatus);
    if (inserPicture.insertedId !== "" && updateStatus.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      return res.status(200).json({
        status: 200,
        data: newPicture._id,
        message: ` The picture with id: ${newPicture._id} was successfully added`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, picture with id: ${newPicture._id} was NOT successfully added for some reason`,
      });
    }
  } catch (err) {
    console.log("Insert picture endpoint", err);
    //
  }
  client.close();
};

module.exports = {
  createAccount,
  addPicture,
};
