const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn } = require("./middleware");
const flash = require("connect-flash");

// For Mongoose
mongoose
  .connect("mongodb://localhost:27017/twitter-clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// Middlewares For ViewEngine,Public Folder,FormDataParsing
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extented: true }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");

// APIs
const postsApiRoute = require('./routes/api/posts');

// Express_Session
app.use(
  session({
    //Usuage
    secret: "weneedabettersecret",
    resave: false,
    saveUninitialized: true,
  })
);


// Required when we are using sessions and passport
app.use(passport.initialize());
app.use(passport.session());
// Authentication and session Related Middlewares
app.use(flash());



app.use(authRoutes);


passport.use(new LocalStrategy(User.authenticate()));
// Behind the scenes these inbuilt functions manages creating and destroying the session of user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Using APIs

app.use(postsApiRoute);

app.get("/", isLoggedIn, (req, res) => {
  res.render("layouts/main-layouts");
});

app.listen(3000, () => {
  console.log("Server running at port 3000");
});
