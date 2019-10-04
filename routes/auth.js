"use strict";

const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

//-------cloudinary configurations--------

const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "/gig-connect",
  allowedFormats: ["jpg", "png"]
});
const upload = multer({ storage });

//----------------------------------------

router.get("/test", (req, res, next) => {
  res.json({ msg: "auth works" });
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const imageUrl = req.body.imageUrl;
  const donationPost = req.body._donationPost;
  const passwordHash = req.body.password;
  //const imageURL = req.file.url;

  bcrypt
    .hash(passwordHash, 10)
    .then(hash => {
      return User.create({
        email,
        username,
        imageUrl,
        donationPost,
        password: hash
        //imageURL
      })
        .then(user => {
          req.session.user = {
            _id: user._id
          };
          // res.redirect("/profile");
        })
        .catch(error => {
          console.log("Could not redirect", error);
        });
    })
    .catch(error => {
      console.log("Could not sign up user", error);
    });
});

// router.get("/login", (req, res, next) => {
//   res.render("auth/login");
// });

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const passwordHash = req.body.password;

  let tempUser;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        throw new Error("username could not be found");
      } else {
        tempUser = user;
        return bcrypt.compare(passwordHash, user.passwordHash);
      }
    })
    .then(match => {
      if (!match) {
        throw new Error("Ups! Wrong Password!");
      } else {
        req.session.user = {
          _id: tempUser._id
        };
        res.redirect("profile");
      }
    })
    .catch(error => {
      console.log("Problem Logging user in", error);
      next(error);
    });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(error => {
    // can't access session here
    // res.redirect("/login");
  });
});

module.exports = router;
