const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//Mongoose connection to database.
const connectDB = async () => {
  try {
    const Mongodb_connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${Mongodb_connection.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Error : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
