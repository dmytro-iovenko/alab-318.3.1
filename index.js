const express = require("express");
const app = express();
const port = 3000;

// Start express server
app.listen(3000, () => {
  console.log("Server is running on port:", port);
});
