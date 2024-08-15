import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.readFileSync(path.resolve(__dirname, "../swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

import ApiError from "./utils/ApiError.js";

const app = express();

//middileware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// global middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session());

import globalErrorHandler from "./controllers/error.controllers.js";

import authRouter from "./routes/auth.routes.js";
import queryRouter from "./routes/query.routes.js";
import adminRouter from "./routes/admin.routes.js";
import artistRouter from "./routes/artist.routes.js";
import patronRouter from "./routes/patron.routes.js";
import opportunityRouter from "./routes/opportunity.routes.js";

app.get('/api/v1/health', (req, res) => {
  res.status(200).send('OK');
});
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/opportunities", opportunityRouter);
app.use("/api/v1/artists", artistRouter);
app.use("/api/v1/patrons", patronRouter);
app.use("/api/v1/quries", queryRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "eKalakaar API docs",
  })
);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server! Please visit /api-docs for comprehensive documentation on all available API routes.`, 404));
});

app.use(globalErrorHandler);

export { app };
