import express, { urlencoded } from "express";
import cors from "cors";
import { connectToMongoose } from "./db/db.connect.js";

import { router as authRouter } from "./routers/public/auth.routers.js";
import { router as userRouter } from "./routers/protected/user.routers.js";
import { router as postRouter } from "./routers/protected/post.routers.js";
import { router as commentRouter } from "./routers/protected/comment.routers.js";
import { authVerify } from "./middleware/authVerify.js";
import { routeNotFound } from "./middleware/routeNotFound.js";

import * as dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
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

// public routes
app.use("/auth", authRouter);

//protected routes
// app.use("/users", authVerify, userRouter);
app.use("/users", userRouter);
app.use("/posts", authVerify, postRouter);
app.use("/comments", authVerify, commentRouter);

// if no routes match
app.use(routeNotFound);

// if something unexpected occures
app.use(errorHandler);

app.listen(port, () => {
  console.log("server started");
});
