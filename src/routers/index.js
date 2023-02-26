import express from "express";

import { router as authRouter } from "./public/auth.routers";
import { router as userRouter } from "./protected/user.routers";
import { router as postRouter } from "./protected/post.routers";
import { router as commentRouter } from "./protected/comment.routers";
import { authVerify } from "../middleware/authVerify";

const router = express.Router();

// public routes
router.use("/auth", authRouter);

//protected routes
router.use("/users", authVerify, userRouter);
router.use("/posts", authVerify, postRouter);
router.use("/comments", authVerify, commentRouter);

export default router;
