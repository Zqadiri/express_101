var express = require('express');
var router = express.Router();
// const distanceInWords = require("date-fns/formatDistanceToNow");

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];


/* GET home page. */
// The res.render() function is used to render a view and sends the rendered HTML string to the client. 
router.get("/", function (req, res, next) {
  res.render("index", { title: "Mini Messageboard", messages: messages });
});

router.get("/new", function (req, res, next) {
  res.render("form");
});

router.post("/new", (req, res) => {
  // console.log("===================================");
  // console.log("mes:" + req.body.messageText);
  messages.push({
    text: req.body.messageText,
    user: req.body.messageUser,
    added: new Date()
  });
  res.redirect('/');
});

module.exports = router;
