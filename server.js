const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs"); // for hashing passwords
const costFactor = 10; // used for the alt
let authenticated = false; // used to see if user is logged in
let username = "";

// let's make a connection to our mysql server
const mysql = require("mysql2");

const conn = mysql.createConnection({
  // the server will connect to a mySQL database using the credential below
  host: "localhost",
  user: "root",
  password: "", //insert localhost password
  database: "CS2803_Final",
});

conn.connect(function (err) {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Connection established.");
  }
});

// app will be our express instance
const app = express();
username = "townshend";
password = "12345";

app.use(express.static("public")); // will use the index.html file

app.get("/registration", function (req, res) {
  res.sendFile(__dirname + "/public/" + "registration.html");
});

app.use(express.urlencoded({ extended: false }));

app.post("/register", function (req, res) {
  // we check to see if username is available
  usernameQuery = "Select username from registeredUsers where username  = ?";
  conn.query(usernameQuery, [req.body.username], function (err, rows) {
    if (err) {
      res.json({ success: false, message: "server error" });
    }
    // we check to see if the username is already taken
    if (rows.length > 0) {
      res.json({ success: false, message: "username taken" });
    }
    // if it isn't, we insert the user into database
    else {
      // we create a password hash before storing the password
      passwordHash = bcrypt.hashSync(req.body.password, costFactor);
      insertUser = "insert into registeredUsers values(?, ?, ?)";
      conn.query(
        insertUser,
        [req.body.username, passwordHash, 0],
        function (err, rows) {
          if (err) {
            res.json({ success: false, message: "server error" });
          } else {
            res.json({ success: true, message: "user registered" });
          }
        }
      );
    }
  });
});

// post to route "attempt login"
app.post("/attempt_login", function (req, res) {
  // we check for the username and password to match.
  conn.query(
    "select password from registeredUsers where username = ?",
    [req.body.username],
    function (err, rows) {
      if (err) {
        res.json({ success: false, message: "server error" });
      } else {
        if (rows.length == 0) {
          authenticated = false;
          console.log("user doesn't exist");
          res.json({ success: false, message: "user doesn't exists" });
        } else {
          storedPassword = rows[0].password; // rows is an array of objects e.g.: [ { password: '12345' } ]
          // bcrypt.compareSync let's us compare the plaintext password to the hashed password we stored in our database
          username = req.body.username;
          if (bcrypt.compareSync(req.body.password, storedPassword)) {
            authenticated = true;
            res.json({ success: true, message: "logged in" });
          } else {
            res.json({ success: false, message: "password is incorrect" });
          }
        }
      }
    }
  );
});

app.post("/score", function (req, res) {
  conn.query(
    "update registeredUsers SET score = ? WHERE username = ?",
    [req.body.score, username],
    function (err, rows) {
      if (err) {
        res.json({
          success: false,
          message: "user doesn't exist or score not inputted properly",
        });
      } else {
        res.json({ success: true, message: "score inputted" });
      }
    }
  );
});

app.get("/gameOver", function (req, res) {
  console.log(req);
  conn.query(
    "SELECT score from registeredUsers WHERE username = ?",
    [username],
    function (err, rows) {
      if (err) {
        res.json({
          success: false,
          message: "user doesn't exist or there is no score",
        });
      } else {
        res.json({ success: true, message: "loaded score", rows });
      }
    }
  );
});

app.listen(3100, function () {
  console.log("Listening on port 3100...");
});
