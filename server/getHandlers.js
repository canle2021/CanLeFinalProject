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
/*  edit Education
  /**********************************************************/

const getAllUsers = async (req, res) => {
  try {
    await client.connect();
    const findUsers = await db.collection("users").find().toArray();

    if (findUsers.length < 1) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, we can not find all the users information`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findUsers,
        message: ` We successfully find all the users`,
      });
    }
  } catch (err) {
    console.log("get all users ", err);
    //
  }
  client.close();
};

/**********************************************************/
/*  edit Experience
  /**********************************************************/
/**********************************************************/
/*  edit Additional language 
  /**********************************************************/
/**********************************************************/
/*  edit Description
  /**********************************************************/
module.exports = {
  getAllUsers,
};
