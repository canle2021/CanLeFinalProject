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
  if (!body.email.includes("@")) {
    return res.status(400).json({
      status: 400,
      data: {},
      message:
        "Sorry. Please provide the correct form of email address(including @)",
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
const editPhone = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point
  //   "phone":"274-534-0380"
  // }
  // remember to copy all this format to F.E

  if (!body._id || !body.phone) {
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

    const oldPhone = {
      userId: findUserId._id,
      oldPhone: findUserId.phone,
    };

    const findUserPhone = await db
      .collection("users")
      .findOne({ phone: body.phone });
    // validate same phone number
    if (findUserPhone) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new phone number is the same with your current phone number`,
      });
    }

    const updatePhone = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      { $set: { phone: body.phone } }
    );
    if (updatePhone.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const phoneChanged = await db
        .collection("phoneChanged")
        .insertOne(oldPhone);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The phone number of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the phone number of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update phone number", err);
    //
  }
  client.close();
};
/**********************************************************/
/*  edit address : city province postalCode country (verify country)
  /**********************************************************/
const editAddress = async (req, res) => {
  const body = req.body;

  // supposed the posting method wil have a req.body with this format:
  //{
  //   "_id": "df69a7d3-4c2e-45de-8cb1-ecc91872819f", take from user document to FE when login and push back to this end point

  //     streetNumber:"79 Independence Center"
  // city:"Lethbridge"
  // province:"Alberta"
  // postalCode:"T9M 0B1"
  // country:"Canada"
  // }
  // remember to copy all this to F.E and F.E also shows the whole form, not only just single element in address

  if (
    !body._id ||
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
  if (body.country.toLowerCase() !== "canada") {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Sorry. Our current service is within Canada. ",
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

    const oldAddres = {
      userId: findUserId._id,
      oldStreetNumber: findUserId.streetNumber,
      oldCity: findUserId.city,
      oldProvince: findUserId.province,
      oldPostalCode: findUserId.postalCode,
      oldCountry: findUserId.country,
    };

    // validate same address
    if (
      findUserId.streetNumber.toLowerCase() ===
        body.streetNumber.toLowerCase() &&
      findUserId.city.toLowerCase() === body.city.toLowerCase() &&
      findUserId.province.toLowerCase() === body.province.toLowerCase() &&
      findUserId.postalCode.toLowerCase() === body.postalCode.toLowerCase() &&
      findUserId.country.toLowerCase() === body.country.toLowerCase()
    ) {
      return res.status(400).json({
        status: 400,
        message: ` Sorry, the new new is the same with your current name`,
      });
    }

    const updateAddress = await db.collection("users").updateOne(
      {
        _id: body._id,
      },
      {
        $set: {
          streetNumber: body.streetNumber,
          city: body.city,
          province: body.province,
          postalCode: body.postalCode,
          country: body.country,
        },
      }
    );
    if (updateAddress.modifiedCount > 0) {
      //  this is to make sure the <users> collection was updated successfully

      const addressChanged = await db
        .collection("addressChanged")
        .insertOne(oldAddres);

      return res.status(200).json({
        status: 200,
        data: body._id,
        message: ` The address of user's id: ${body._id} was successfully updated`,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: ` Sorry, the address of user's id: ${body._id} was NOT successfully updated for some reason`,
      });
    }
  } catch (err) {
    console.log("Update address", err);
    //
  }
  client.close();
};
module.exports = {
  editEmail,
  editPhone,
  editAddress,
};
