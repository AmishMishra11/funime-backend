import express from "express";
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "../../controllers/bookmark.controller.js";
import {
  followUser,
  unfollowUser,
} from "../../controllers/follow.controller.js";
import {
  editUser,
  getAllUsers,
  getOneUsers,
} from "../../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/:id").get(getOneUsers);

router.route("/edit/:id").post(editUser);

router.route("/follow/:followUserId").post(followUser);

router.route("/unfollow/:followUserId").post(unfollowUser);

router.route("/bookmark/:userId").get(getBookmarks);

router.route("/add-bookmark/:postId").post(addBookmark);

router.route("/remove-bookmark/:postId").post(removeBookmark);

export { router };
