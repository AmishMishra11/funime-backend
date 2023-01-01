import express from "express";
import {
  editUser,
  getAllUsers,
  getOneUsers,
} from "../../controllers/user.controller";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getOneUsers);

router.route("/edit/:id").post(editUser);

export { router };
