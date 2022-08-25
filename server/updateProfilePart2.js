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
/*  edit email
/**********************************************************/
const editEmail = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "email": "new email",
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.email) {
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

    const oldEmail = {
      userId: findUserId._id,
      oldEmail: findUserId.email,
    };

    const findUserEmail = await db
      .collection("users")
      .find({ email: { $regex: body.email, $options: "i" } })
      .toArray();
    // validate same userName
    if (findUserEmail.length > 0) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new email is the same with your current email`,
      });
    }

    const updateEmail = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { email: body.email } }
    );
    if (updateEmail.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const emailChanged = await db
        .collection("emailChanged")
        .insertOne(oldEmail);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The email of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the email of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update email", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit phone number
  /**********************************************************/
/**********************************************************/
/*  edit address : city province postalCode country (verify country)
  /**********************************************************/

module.exports = {
  editEmail,
};
