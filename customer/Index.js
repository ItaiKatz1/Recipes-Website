// --- libraries importing
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");
const DBUtils = require("./routes/utils/DBUtils")
const cors = require("cors")
// --- Routes importing
const auth = require("./routes/auth");
const recipes = require("./routes/recipes");
const profile = require("./routes/profile");

// --- App settings and and config
const app = express();
//const router = express.Router();
const port = process.env.PORT || "4000";
//CORS
const corsConfig = {
  origin: true,
  credentials: true
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:  false }));
// parse application/json
app.use(bodyParser.json());
// print request logs
app.use(morgan(":method :url :status  :response-time ms"));
// settings cookies configuration
app.use(
    session({
        cookieName: "session", // the cookie's key name
        secret: process.env.COOKIE_SECRET, // the encryption's key
        duration: 20 * 60 * 1000, // expired after 20 sec
        activeDuration: 0, // if expiresIn < activeDuration,
        // the session will be extended by activeDuration miliseconds
        cookie: {
          httpOnly: false
        }
    })
);


//cookie middleware
app.use(function (req, res, next) {
    if (req.session && req.session.user_id) {
      DBUtils.execQuery("SELECT user_id FROM users")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
          }
          next();
        })
        .catch((error) => next());
    } else {
      next();
    }
  });


  // Routing
app.use("/recipes", recipes);
app.use("/profile", profile);
app.use("/auth", auth);


app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send({ message: err.message, success: false });
  });

app.use((req,res) => {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});



