require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { urlencoded } = require("body-parser");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };
  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: `${process.env.API_KEY}`,
  };
  const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/members`;

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server up and running 🏁");
});
