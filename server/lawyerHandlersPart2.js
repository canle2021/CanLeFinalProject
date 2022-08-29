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
const editEducation = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "education": "2011: Law LLB (Honours) – The University of Manchester, UK"
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.education) {
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
    const oldEducation = {
      userId: findUserId._id,
      oldEducation: !findUserId.education
        ? "This is the first Education, not change yet"
        : findUserId.education,
    };

    if (findUserId.education !== undefined) {
      if (findUserId.education.toLowerCase() === body.education.toLowerCase()) {
        return res.status(400).json({
          status: 400,
          message: ` Sorry, the new Education is the same with your existing Education`,
        });
      }
    }

    const updateEducation = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { education: body.education } }
    );
    if (updateEducation.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const educationChanged = await db
        .collection("educationChanged")
        .insertOne(oldEducation);
      // this is for tracking what has been changed.

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Education of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Education of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Education ", err);
    //
  }
  client.close();
};

/**********************************************************/
/*  edit Experience
  /**********************************************************/
const editExperience = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "experience": "2015: UN Office of the High Commissioner for Human Rights (OHCHR), Intern, Geneva, Switzerland"
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.experience) {
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
    const oldExperience = {
      userId: findUserId._id,
      oldEducation: !findUserId.experience
        ? "This is the first Experience, not change yet"
        : findUserId.experience,
    };

    if (findUserId.experience !== undefined) {
      if (
        findUserId.experience.toLowerCase() === body.experience.toLowerCase()
      ) {
        return res.status(400).json({
          status: 400,
          message: ` Sorry, the new Experience is the same with your existing Experience`,
        });
      }
    }

    const updateExperience = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { experience: body.experience } }
    );
    if (updateExperience.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const experienceChanged = await db
        .collection("ExperienceChanged")
        .insertOne(oldExperience);
      // this is for tracking what has been changed.

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Experience of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Experience of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Experience ", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit Additional languages 
  /**********************************************************/
const editLanguages = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "languages ": "English, French"
  // }
  // remember to copy all this to F.E

  if (!body._id || !body.languages) {
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
    const oldLanguages = {
      userId: findUserId._id,
      oldLanguages: !findUserId.languages
        ? "This is the first Languages, not change yet"
        : findUserId.languages,
    };
    // Languages can be similar between many lawyers
    if (findUserId.languages !== undefined) {
      if (findUserId.languages.toLowerCase() === body.languages.toLowerCase()) {
        return res.status(400).json({
          status: 400,
          message: ` Sorry, the new Languages is the same with your existing Languages`,
        });
      }
    }

    const updateLanguages = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { languages: body.languages } }
    );
    if (updateLanguages.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const LanguagesChanged = await db
        .collection("LanguagesChanged")
        .insertOne(oldLanguages);
      // this is for tracking what has been changed.

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The Languages of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the Languages of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update Languages ", err);
    //
  }
  client.close();
};

module.exports = {
  editEducation,
  editExperience,
  editLanguages,
};
