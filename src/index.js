import express, { urlencoded } from "express";
import cors from "cors";
import { connectToMongoose } from "./db/db.connect";

import { routeNotFound } from "./middleware/routeNotFound";

import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routers";
dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cors());

connectToMongoose();

const port = process.env.PORT || 9000;

app.get("/", (req, res) => {
  res.send("Funime Backend App!");
});

app.use("/api/v1", router);

// if no routes match
app.use(routeNotFound);

// if something unexpected occures
app.use(errorHandler);

app.listen(port, () => {
  console.log("server started");
});
