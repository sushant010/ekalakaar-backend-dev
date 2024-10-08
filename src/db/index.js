import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export let dbInstance = undefined;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`);
    dbInstance = connectionInstance;
    console.log(`\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
