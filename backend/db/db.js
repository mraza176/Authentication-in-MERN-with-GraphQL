import "dotenv/config";
import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to Database!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default db;
