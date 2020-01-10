const router = require("express").Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// env variables must be setup

router.get("/test", (req, res) => {
  // more secure method w OAuth2:
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" //Redirect URL
  );
  console.log("oauthClient: ", oauth2Client)

  // OAuth2 access token refresh
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = oauth2Client.getAccessToken();

  // transporter describes how to send mail using SMTP and nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",

    // unsecure method:
    // go to: https://myaccount.google.com/lesssecureapps
    // choose the email in upper right corner
    // switch on less secure app access
    // auth: {
    //   user: process.env.NODEMAILER_USER,
    //   pass: process.env.NODEMAILER_PASS
    // }

    // more secure Oauth2:
    auth: {
      type: "OAuth2",
      user: process.env.OAUTH2_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken
    }
  });

  // verify transporter is working
  transporter.verify((err, success) => {
    if (err) {
      console.log(err)
    } else {
      console.log("Server is ready to take our messages")
    }
  })

  // mail/'envolope' options, unicode allowed
  let mailOptions = {
    from: `"Founder Grants" <${process.env.NODEMAILER_FROM}>`,
    to: process.env.EMAIL_TO, // will change to curr user email
    subject: "Founder Grants Testing",
    text: "testing",
    generateTextFromHTML: true,
    html: "<p style='color: #ff6699' >testing html pink paragraph</p>"
  }

  // Step 3 - to test go to localhost:5000/email/test
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.log("Error occurred", err)
      }
    console.log('Message sent: %s', res.messageId)
    res.sendStatus(200)
  })
})

module.exports = router
