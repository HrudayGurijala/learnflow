const express = require("express");
require('dotenv').config();
const connectDB = require("./config/db");
const session = require("express-session"); 
const MongoStore = require("connect-mongo")(session); 
const mongoose = require("mongoose");
const passport = require("passport");


require("./models/User");
require("./models/Post");
require("./models/Comment");
require("./models/Like");
require("./models/View");

const app = express();

connectDB();
require("./config/passport");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());  


if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); 
}

app.use(
  session({
    secret: "mysecretkey", 
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true 
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize()); 
app.use(passport.session());  

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/post"));
app.use("/", require("./routes/comment"));
app.use("/", require("./routes/upload"));

app.get("/*", (req, res) => {
  res.render("error-404");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});