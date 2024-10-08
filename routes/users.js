const express = require("express");
const router = express.Router();

const users = require("../data/users");
const error = require("../utils/error");
const posts = require("../data/posts");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "users/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ users, links });
  })
  .post((req, res, next) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(409, "Username Already Taken"));
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);

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
      {
        href: `/${req.params.id}/posts`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments?postId=<VALUE>`,
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    if (user) res.json({ user, links });
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

router
  .route("/:id/posts")
  // Retrieves all posts by a user with the specified id.
  .get((req, res, next) => {
    // Check if user with the specified id exists
    const user = users.find((u) => u.id == req.params.id);
    // and return if it doesn't (to trigger 404 middleware)
    if (!user) return next();

    // Get all user's posts
    const userPosts = posts.filter((p) => p.userId == req.params.id);

    const links = [
      {
        href: `/${req.params.id}/posts`,
        rel: "",
        type: "GET",
      },
    ];

    // Passing data through filtering middleware
    req.locals = { ...req.locals, posts: userPosts, links };
    next();
  });

router
  .route("/:id/comments")
  // Retrieves comments made by the user with the specified id.
  .get((req, res, next) => {
    // Check if user with the specified id exists
    const user = users.find((u) => u.id == req.params.id);
    // and return if it doesn't (to trigger 404 middleware)
    if (!user) return next();

    // Get all user's comments
    let userComments = comments.filter((c) => c.userId == req.params.id);

    const links = [
      {
        href: `/${req.params.id}/comments`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments?postId=<VALUE>`,
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    // Passing data through filtering middleware
    req.locals = { ...req.locals, comments: userComments, links };
    next();
  });

module.exports = router;
