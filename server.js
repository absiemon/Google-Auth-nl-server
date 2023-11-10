import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/DbConnection.js";

import authRouter from "./router/authRouter.js";
import { passportConfig } from "./passport.js";

passportConfig(passport);

const app = express();
// MongoDB session store setup
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL, // MongoDB connection URL
  collection: "sessions", // Collection to store sessions in
  ttl: 14 * 24 * 60 * 60, // Session TTL (2 weeks)
});

// Session middleware configuration
app.use(
  session({
    secret: "abhay",
    resave: false,
    saveUninitialized: true,
    store: mongoStore, // Using the MongoDB store
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // same TTL as defined in the store
    },
  })
);

app.use(express.json({ limit: "50mb" })); // Parsing JSON request bodies with a limit
app.use(cookieParser()); // Parsing cookies from request headers
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded request bodies with extended mode
app.use(
  bodyParser.json({
    parameterLimit: 100000,
    limit: "50mb",
  })
); // Parsing JSON request bodies with limit and parameter limit
app.use(morgan()); // Enabling request logging with morgan

const allowedOrigins = ["https://google-auth-client.onrender.com"];
const corsOptions = {
  credentials: true, // Allowing credentials, including cookies, in CORS requests
  origin: allowedOrigins, // Defining the allowed origins
  methods: 'GET, POST, PUT, DELETE', // Specifying HTTP methods
  allowedHeaders: 'Content-Type, Authorization, Cookie', // Defining allowed headers
};

app.use(passport.initialize()); // Initializing Passport for authentication
app.use(passport.session()); // Initializing Passport session handling

app.use(cors(corsOptions));

// Connecting to the database
await connectDB();

// Mounting the authentication routes under the '/auth' path
app.use('/auth', authRouter);

const port = process.env.PORT || 8000;

const server = app.listen(port);
