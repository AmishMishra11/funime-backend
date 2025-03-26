import express from "express";
import {
  addComments,
  deleteCommnet,
  dislikeComment,
  editComment,
  getPostComments,
  likeComment,
} from "../../controllers/comment.controller.js";

const router = express.Router();

router.route("/:postId").get(getPostComments);

router.route("/add/:postId").post(addComments);

router.route("/edit/:postId/:commentId").post(editComment);

router.route("/delete/:postId/:commentId").post(deleteCommnet);

router.route("/upvote/:postId/:commentId").post(likeComment);

router.route("/downvote/:postId/:commentId").post(dislikeComment);

export { router };
