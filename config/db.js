const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("💾 DB Conected");
  } catch (error) {
    console.log("connectDB error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
