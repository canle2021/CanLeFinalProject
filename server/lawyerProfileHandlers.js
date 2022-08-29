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
/*  edit Quote
/**********************************************************/
const editQuote = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "quote": "new Quote",
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.quote) {
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

    const oldQuote = {
      userId: findUserId._id,
      oldQuote: !findUserId.quote
        ? "This is the first quote, not change yet"
        : findUserId.quote,
    };
    // validate unique quote,
    // this function return an array of users which have quote included body.quote text
    const findSameQuotesArray = await db
      .collection("users")
      .find({ quote: { $regex: body.quote, $options: "i" } })
      .toArray();

    //  this function will test there is at least 1 user is having the same quote with the body.quote.
    const findTheSameQuote = findSameQuotesArray.find(
      (user) => user.quote.toLowerCase() === body.quote.toLowerCase()
    );

    if (findTheSameQuote) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new Quote is the same with existing Quote`,
      });
    }

    const updateQuote = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { quote: body.quote } }
    );
    if (updateQuote.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const quoteChanged = await db
        .collection("quoteChanged")
        .insertOne(oldQuote);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Quote of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Quote of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Quote", err);
    //
  }
  client.close();
};

/**********************************************************/
/*  edit Practice areas
/**********************************************************/
const editPracticeAreas = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "practiceAreas": "new PracticeAreas",
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.practiceAreas) {
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
    const oldPracticeAreas = {
      userId: findUserId._id,
      oldPracticeAreas: !findUserId.practiceAreas
        ? "This is the first PracticeAreas, not change yet"
        : findUserId.practiceAreas,
    };
    // practice areas can be similar between many lawyers
    if (findUserId.practiceAreas !== undefined) {
      if (
        findUserId.practiceAreas.toLowerCase() ===
        body.practiceAreas.toLowerCase()
      ) {
        return res.status(400).json({
          status: 400,
          message: ` Sorry, the new Practice Areas is the same with your existing PracticeAreas`,
        });
      }
    }

    const updatePracticeAreas = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { practiceAreas: body.practiceAreas } }
    );
    if (updatePracticeAreas.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const practiceAreasChanged = await db
        .collection("practiceAreasChanged")
        .insertOne(oldPracticeAreas);
      // this is for tracking what has been changed.

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Practice Areas of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Practice Areas of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Practice Areas", err);
    //
  }
  client.close();
};

/**********************************************************/
/*  edit Credentials
/**********************************************************/
const editCredentials = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "credentials": "Member of the Law Society of British Columbia
  // Member of the Law Society of England and Wales
  // Member of the Canadian Bar Association
  // BPP Law School Certificate in Commercial Awareness"
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.credentials) {
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
    const oldCredentials = {
      userId: findUserId._id,
      oldCredentials: !findUserId.credentials
        ? "This is the first Credentials, not change yet"
        : findUserId.credentials,
    };

    if (findUserId.credentials !== undefined) {
      if (
        findUserId.credentials.toLowerCase() === body.credentials.toLowerCase()
      ) {
        return res.status(400).json({
          status: 400,
          message: ` Sorry, the new Credentials is the same with your existing PracticeAreas`,
        });
      }
    }

    const updateCredentials = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { credentials: body.credentials } }
    );
    if (updateCredentials.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const credentialsChanged = await db
        .collection("credentialsChanged")
        .insertOne(oldCredentials);
      // this is for tracking what has been changed.

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Credentials of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Credentials of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Credentials", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit education
/**********************************************************/
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
  editQuote,
  editPracticeAreas,
  editCredentials,
};
