"use strict";

const { Router } = require("express");
const router = Router();
const Donation = require("../models/donation");

const checkLogin = require("../controllers/check-login");
//const checkCreator = require("../controllers/check-creator");

//-------cloudinary configurations--------

// const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET
// });

// const storage = cloudinaryStorage({
//   cloudinary,
//   folder: "/gig-connect",
//   allowedFormats: ["jpg", "png"]
// });
// const upload = multer({ storage });

//----------------------------------------

router.get("/donation", checkLogin, (req, res, next) => {
  res.render("event/event");
  console.log(req.body);
});

router.post("/donation", (req, res, next) => {
  // Creating an event
  //console.log("The event object:", req.body);
  // const eventName = req.body.event;
  const eventName =
    req.body.event.charAt(0).toUpperCase() +
    req.body.event.slice(1).toLowerCase();
  const description =
    req.body.description.charAt(0).toUpperCase() +
    req.body.description.slice(1).toLowerCase();
  const artists =
    req.body.artists.charAt(0).toUpperCase() +
    req.body.artists.slice(1).toLowerCase();
  const genre =
    req.body.genre.charAt(0).toUpperCase() +
    req.body.genre.slice(1).toLowerCase();
  const city =
    req.body.city.charAt(0).toUpperCase() +
    req.body.city.slice(1).toLowerCase();
  const ticketURL = req.body.ticket;
  const imageURL = req.file && req.file.url;
  const date = req.body.date;
  const creator = req.session.user._id;

  Donation.create({
    eventName,
    description,
    artists,
    genre,
    city,
    ticketURL,
    imageURL,
    date,
    creator
  })
    .then(event => {
      //console.log(event);
      //res.render('event/eventPage', {event});
      res.redirect("/eventPage/" + event._id);
    })
    .catch(error => {
      console.log(error);
    });
});

// Note: Whatever goes after ":"" in the route is being accessed
// with the same name in req.params.THENAME

router.get("/donation/:id", checkLogin, (req, res, next) => {
  Donation.findById(req.params.id)
    .populate("creator")
    .populate("comments.commentAuthor")
    .then(event => {
      console.log("POPULATED EVENT", event);

      res.render("event/eventPage", { event });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/donation/:id/edit", checkLogin, (req, res, next) => {
  // console.log(req.params.id);
  Donation.findById(req.params.id)
    .then(event => {
      // console.log(event)
      res.render("event/eventPage-edit", { event });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/donation/:id/edit", (req, res, next) => {
  const eventName = req.body.event;
  const description = req.body.description;
  const artists = req.body.artists;
  const genre = req.body.genre;
  const city = req.body.city;
  const ticketURL = req.body.ticket;
  const date = req.body.date;
  const eventId = req.params.id;

  const data = {
    eventName,
    description,
    artists,
    genre,
    city,
    ticketURL,
    date
  };
  //console.log("DATA TO BE EDIT", data)

  Donation.findByIdAndUpdate(eventId, data)
    .populate("creator")
    .then(event => {
      console.log(event);
      res.redirect("/eventPage/" + eventId);
    })
    .catch(error => {
      console.log("Could not update event information", error);
    });
});

router.get("/donation/:id/delete", (req, res, next) => {
  const eventId = req.params.id;
  // Grab the ID and use it as an argument for deleting
  Donation.findByIdAndDelete(eventId)
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/add-comment/:id", checkLogin, (req, res, next) => {
  const commentBody = req.body.commentbody;
  const commentTitle = req.body.commenttitle;
  const commentAuthor = req.session.user._id;
  const eventId = req.params.id;

  // console.log("COMMENT DATA", data);
  Donation.findByIdAndUpdate(eventId, {
    $push: {
      comments: {
        commentBody,
        commentTitle,
        commentAuthor
      }
    }
  })
    .then(() => {
      res.redirect("/donation/" + eventId);
    })
    .catch(error => {
      console.log(error);
    });
});

// router.get('/add-comment/:id', checkLogin, (req, res, next) => {
//   const eventId= req.params.id;
//     Event.findById(eventId).populate('comments.commentAuthor')
//   .then((event) => {
//     console.log("POPULATE SHOW COMMENT ROUTE",event.comments[0].commentAuthor.username);
//     res.red("/eventPage/" + eventId,);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// });

router.get("/donation-browse", (req, res, next) => {
  let searchResult;
  if (req.query.search) {
    searchResult =
      req.query.search.charAt(0).toUpperCase() +
      req.query.search.slice(1).toLowerCase();
  }
  //console.log("search result",searchResult);
  const typeResult = req.query.type;

  Donation.find({})
    .then(allEvents => {
      // console.log("ALL EVENTS",allEvents);
      return allEvents.filter(event => event[typeResult] === searchResult);
    })
    .then(eventList => {
      // console.log("FILTERED EVENTS",eventList);
      const data = {
        eventList
      };
      res.render("browse", data);
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
