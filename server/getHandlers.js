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
/*  get All users
  /**********************************************************/

const getAllUsers = async (req, res) => {
  try {
    await client.connect();
    const findUsers = await db.collection("users").find().toArray();

    if (findUsers.length < 0) {
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
/*  get specific User
  /**********************************************************/

const getSpecificUser = async (req, res) => {
  const { _id } = req.params;
  try {
    await client.connect();
    const findSpecificUser = await db.collection("users").findOne({ _id });
    const findPictures = await db.collection("usersPictures").findOne({ _id });

    if (!findSpecificUser) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, we can not find all the user's information with id : ${_id}`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        userData: findSpecificUser,
        userPicture: findPictures,
        message: ` We successfully find users information with id: ${_id}`,
      });
    }
  } catch (err) {
    console.log("get Specific User ", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get All Lawyers
  /**********************************************************/

const getLawyers = async (req, res) => {
  try {
    await client.connect();
    const findLawyers = await db
      .collection("users")
      .find({ status: "lawyer" })
      .toArray();
    const findLawyersPictures = await db
      .collection("usersPictures")
      .find()
      .toArray();

    if (findLawyers.length < 0 || findLawyersPictures.length < 0) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, we can not find all the Lawyers information`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        lawyersInfomation: findLawyers,
        lawyerspicture: findLawyersPictures,
        message: ` We successfully find all the Lawyers`,
      });
    }
  } catch (err) {
    console.log("get all Lawyers ", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  get All Appointments
  /**********************************************************/

const getAppointments = async (req, res) => {
  try {
    await client.connect();
    const findAppointments = await db
      .collection("appointments")
      .find()
      .toArray();

    if (findAppointments.length < 0) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, we can not find all the Appointments information`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: findAppointments,
        message: ` We successfully find all the Appointments`,
      });
    }
  } catch (err) {
    console.log("get all Lawyers ", err);
    //
  }
  client.close();
};
module.exports = {
  getAllUsers,
  getLawyers,
  getSpecificUser,
  getAppointments,
};
