import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "/src/.env") });

const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const startServer = () => {
  app.listen(process.env.PORT || 4000, () => {
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    startServer();
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      console.log("Mongo db connect error: ", err);
    });
}
