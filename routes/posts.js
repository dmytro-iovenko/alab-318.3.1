const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utils/error");
const comments = require("../data/comments");

router
  .route("/")
  .get((req, res) => {
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
    let result = posts;
    // Retrieves all posts by a user with the specified postId.
    console.log(req.query);
    if (req.query.userId) {
      console.log(req.query);
      result = result.filter((p) => p.userId == req.query.userId);
    }
    res.json({ result, links });
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
  .get((req, res) => {
    // Get all comments made on the post with the specified id
    const posts = comments.filter((c) => c.postId == req.params.id);
    res.json(posts);
  });

module.exports = router;
