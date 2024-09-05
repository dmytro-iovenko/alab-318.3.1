const express = require("express");
const router = express.Router();

const posts = require("../data/comments");
const error = require("../utils/error");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "comments/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    res.json({ comments, links });
  });

module.exports = router;
