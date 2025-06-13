const express = require("express");
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const connectDB = require("./db/connect");

const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(require("body-parser").urlencoded({ extended: true }));

// let secretWord = "syzygy";

require("dotenv").config(); // to load the .env file into the process.env object
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize());
app.use(passport.session());
app.use(csurf());  

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

//flash messages
app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));


//Routes
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", secretWordRouter);

const expensesRoutes = require("./routes/expenses");
const auth = require("./middleware/auth");

app.use("/expenses", auth, expensesRoutes);
app.use("/secretWord", auth, secretWordRouter);


app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (err) {
    console.error("DB connection failed", err);
  }
};

start();
