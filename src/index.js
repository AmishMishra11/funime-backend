import express from "express";

import cors from "cors";

const app = express();

const port = process.env.PORT || 9000;

app.get("/", (req, res) => {
  res.send("Hello Express App!");
});

app.get("/users", (req, res) => {
  res.send("Users will be listed here...");
});

app.listen(port, () => {
  console.log("server started");
});
