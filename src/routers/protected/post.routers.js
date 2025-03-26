import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  getUserPosts,
  editPost,
  likePost,
  dislikePost,
} from "../../controllers/post.controller.js";

const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getOnePost).delete(deletePost);

router.route("/user/:username").get(getUserPosts);

router.route("/edit/:postId").post(editPost);

router.route("/like/:postId").post(likePost);

router.route("/dislike/:postId").post(dislikePost);

export { router };
