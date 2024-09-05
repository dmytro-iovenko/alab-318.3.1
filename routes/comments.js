const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utils/error");

router
  .route("/")
  .get((req, res, next) => {
    const links = [
      {
        href: "comments/:id",
        rel: ":id",
        type: "GET",
      },
      {
        href: "comments/?userId=<VALUE>",
        rel: "<VALUE>",
        type: "GET",
      },
      {
        href: "comments/?postId=<VALUE>",
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    // Passing data through filtering middleware
    req.locals = { ...req.locals, comments, links };
    next()
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments[comments.length - 1]
          ? comments[comments.length - 1].id + 1
          : 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };
      comments.push(comment);
      res.status(201).json(comments);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  // Retrieves the comment with the specified id
  .get((req, res, next) => {
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) res.json({ comment, links });
    else next();
  })
  // Used to update a comment with the specified id with a new body
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  })
  // Used to delete a comment with the specified id
  .delete((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  });

module.exports = router;
