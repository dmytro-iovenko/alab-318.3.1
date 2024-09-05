const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utils/error");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res, next) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
      {
        href: "posts/?userId=<VALUE>",
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    req.locals = { ...req.locals, posts, links };
    next()
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

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
        href: `/${req.params.id}/comments`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments?userId=<VALUE>`,
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router
  .route("/:id/comments")
  // Retrieves all comments made on the post with the specified id
  .get((req, res, next) => {
    // Check if post with the specified id exists
    const post = posts.find((p) => p.id == req.params.id);
    // and return if it doesn't (to trigger 404 middleware)
    if (!post) return next();

    // Get all comments made on the post with the specified id
    let postComments = comments.filter((c) => c.postId == req.params.id);

    const links = [
      {
        href: `/${req.params.id}/comments`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}/comments?userId=<VALUE>`,
        rel: "<VALUE>",
        type: "GET",
      },
    ];

    // Passing data through filtering middleware
    req.locals = { ...req.locals, comments: postComments, links };
    next()
  });

module.exports = router;
