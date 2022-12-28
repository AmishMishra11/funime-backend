import express, { urlencoded } from "express";
import cors from "cors";
import { connectToMongoose } from "./db/db.connect";

import { router as authRouter } from "./routers/public/auth.routers";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

connectToMongoose();

const port = process.env.PORT || 9000;

app.get("/", (req, res) => {
  res.send("Funime Backend App!");
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log("server started");
});
