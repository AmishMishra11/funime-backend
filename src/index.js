import express, { urlencoded } from "express";
import cors from "cors";
import { connectToMongoose } from "./db/db.connect";

import { router as authRouter } from "./routers/public/auth.routers";
import { router as userRouter } from "./routers/protected/user.routers";
import { router as postRouter } from "./routers/protected/post.routers";
import { router as commentRouter } from "./routers/protected/comment.routers";
import { authVerify } from "./middleware/authVerify";

import * as dotenv from "dotenv";
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
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
// app.use("/users", authVerify, userRouter);
// app.use("/posts", authVerify, postRouter);
// app.use("/comments", authVerify, commentRouter);
app.listen(port, () => {
  console.log("server started");
});
