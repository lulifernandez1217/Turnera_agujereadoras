const express = require("express");
const app = express();
const port = 7777; // Or any desired port

app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
