const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config();

const grantRouter = require("./routers/grantRouter.js");
const userRouter = require("./routers/userRouter.js");
const adminRouter = require("./routers/adminRouter.js");
const favoriteRouter = require('./routers/favoriteRouter.js');
//This is replacing our middleware
// Auth0's authentication for all users
const middleware = require("./auth/middleware.js");
const jwtAuthz = require("express-jwt-authz");

//checkAllScopes: false
const checkScopesAdmMod = jwtAuthz(["get:adminLocal", "get:adminProduction", "get:adminStaging"]);
//make this array hidden variable & give those to heroku

// setup for nodemail emialer
//Step 1
// go to: https://myaccount.google.com/lesssecureapps
// choose the email in upper right corner
// switch on less secure app access
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER, // setup env with a gmail address
    pass: process.env.NODEMAILER_PASS // setup env with matching gmail pass
  }
});
// Step 2
let mailOptions = {
  from: process.env.NODEMAILER_FROM, // same gmail as user above
  to: process.env.NODEMAILER_TO, // receiving email
  subject: "Testing and Testing",
  text: "the test is working"
}
// Step 3 - test with command: node server.js
transporter.sendMail(mailOptions, function(err, data) {
  if (err) {
    console.log("Error occurred", err)
  } else {
    console.log("Email was sent")
  }
})

server.use(cors());
server.use(helmet());
server.use(express.json());
// enable the use of request body parsing middleware
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Routes
server.use("/api/grants", grantRouter);
server.use("/user", userRouter);
// Implement Auth0 middleware on our protected admin route This is working with test token globally!!!
server.use("/api/admin", middleware, checkScopesAdmMod, adminRouter);
server.use("/api/favorites", middleware, favoriteRouter );

server.get("/", (req, res) => {
  res.status(200).json({ server: "running" });
});

module.exports = server;
