var express = require("express");
var router = express.Router();
const users_db = require("./utils/DBUtils.js");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await users_db.execQuery("SELECT username FROM users");

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await users_db.execQuery(
      `INSERT INTO users VALUES ('${req.body.username}', '${hash_password}',
      '${req.body.first_name}','${req.body.last_name}','${req.body.country}','${req.body.email}', '${req.body.image_url}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});
router.post("/Login", async (req, res, next) => {
  try { 
    // check that username exists
    const users = await users_db.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (await users_db.execQuery(`SELECT * FROM users WHERE username = '${req.body.username}'`))[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    req.session.username = user.username;

    // return cookie
    //res.status(200).send({ message: "login succeeded", success: true });
    const image = await users_db.getUserImage(user.username);
    res.send(image);
  } catch (error) {
    console.log(error)
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;


