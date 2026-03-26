require('dotenv').config();
const mongoose = require('mongoose');

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.DB_PASSWORD);
    console.log("db connected successfully");
  } catch (e) {
    console.log("MongoDB connection error:", e);
    process.exit(1);
  }
};

module.exports = dbconnect