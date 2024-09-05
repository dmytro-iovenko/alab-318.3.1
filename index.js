const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

const error = require("./utils/error");

const app = express();
const port = 3000;

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`-----
    ${time}: Received a ${req.method} request to ${req.url}.`);
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);

// Filtering Middleware
app.use((req, res, next) => {
  // Get req.locals (recommended way of passing data through middleware)
  let locals = req.locals;
  // Loop through data object to handle all possible keys except 'links'
  for (const key in locals) {
    // Skip links
    if (key === "links") continue;
    // Filter data by a user with the specified userId
    if (req.query.userId) {
      locals[key] = locals[key].filter((d) => d.userId == req.query.userId);
    }
    // Filter data by a post with the specified postId
    if (req.query.postId) {
      locals[key] = locals[key].filter((d) => d.postId == req.query.postId);
    }
  }
  // Send filtered data
  if (locals) res.json(locals);
  else next();
});

// 404 Middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not Found"));
});

// Error-handling middleware.
// Any call to next() that includes an Error() will skip regular middleware
// and only be processed by error-handling middleware.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start express server
app.listen(3000, () => {
  console.log("Server is running on port:", port);
});
