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
        data: newPicture._id,
        message: ` The picture with id: ${body._id} was successfully updated`,
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

module.exports = {
  editPicture,
};
