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

    // const idToNumber = Number.parseInt(body._id);
    // const quantityToNumber = Number.parseInt(body.qty);
    // transform string in req.body to number because the DB has number type

    //check with case insensitive
    const findUserName = await db
      .collection("users")
      .find({ userName: { $regex: body.userName, $options: "i" } })
      .toArray();

    if (findUserName.length > 0) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the user name :${body.userName} is existing, you can not create the new account with this user name`,
      });
    }

    const findFirstName = await db
      .collection("users")
      .find({ firstName: { $regex: body.firstName, $options: "i" } })
      .toArray();
    const findLastName = await db
      .collection("users")
      .find({ lastName: { $regex: body.lastName, $options: "i" } })
      .toArray();
    const findPotalCode = await db
      .collection("users")
      .find({ postalCode: { $regex: body.postalCode, $options: "i" } })
      .toArray();

    if (
      findFirstName.length > 0 &&
      findLastName.length > 0 &&
      findPotalCode.length > 0
    ) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, this user is already exist, you can not create the new account with this information`,
      });
    }

    const findEmail = await db
      .collection("users")
      .find({ email: { $regex: body.email, $options: "i" } })
      .toArray();
    if (findEmail.length > 0) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the email address :${body.email} is existing, you can not create the new account with this email address`,
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
  //   "image": "base 64",
  // }
  // remember to copy all this to F.E

  const newPicture = {
    ...body,
  };
  if (!body._id || !body.image) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Please provide all the required information ",
    });
  }

  // validate same picture

  try {
    const findImage = await db
      .collection("usersPictures")
      .findOne({ image: body.image });

    if (findImage) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the image with use's id :${body._id} is existing, you can not add this image to your account`,
      });
    }

    const inserImage = await db
      .collection("usersPictures")
      .insertOne(newPicture);
    console.log("inserImage", inserImage);

    if (inserImage.insertedId !== "") {
      //  this is to make sure the <users> collection was updated successfully

      return res.status(200).json({
        status: 200,
        data: newPicture._id,
        message: ` The image with id: ${newPicture._id} was successfully added`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, image with id: ${newPicture._id} was NOT successfully added for some reason`,
      });
    }
  } catch (err) {
    console.log("Insert image endpoint", err);
    //
  }
  client.close();
};

module.exports = {
  createAccount,
  addPicture,
};
