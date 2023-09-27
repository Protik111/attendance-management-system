const mongoose = require("mongoose");

let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME);
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD);

const connectDb = async () => {
  try {
    await mongoose.connect(connectionURL, {
      dbName: process.env.DB_NAME,
    });
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed");
  }
};

module.exports = connectDb;
