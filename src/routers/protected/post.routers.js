import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  getUserPosts,
  editPost,
} from "../../controllers/post.controller";

const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);

router.route("/:id").get(getOnePost).delete(deletePost);

router.route("/user/:username").get(getUserPosts);

router.route("/edit/:postId").post(editPost);

export { router };
