const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Start express server
app.listen(3000, () => {
  console.log("Server is running on port:", port);
});
