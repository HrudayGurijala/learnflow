const express = require("express");

const { ensureAuth } = require("../middleware/auth");
const { ensureSignUp } = require("../middleware/user");

const router = express.Router();

router.get("/profile", ensureAuth, ensureSignUp, (req, res) => {
  res.render("profileSettings.ejs");
});

router.patch("/profile", ensureAuth, ensureSignUp, async (req, res) => {
  try {
    const profileData = req.body;
    const user = req.user;

    for (const key in profileData) {
      user[key] = profileData[key];
    }

    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Something went wrong",
    });
  }
});

module.exports = router;

