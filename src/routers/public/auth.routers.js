import express from "express";
import { loginUser, signupUser } from "../../controllers/users";

const router = express.Router();

router.route("/signup").post(signupUser);

router.route("/login").post(loginUser);

export { router };
