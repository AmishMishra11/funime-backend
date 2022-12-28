import mongoose from "mongoose";

const { Schema } = mongoose;

// creating a commnet schema (sub schema) for post schema
const commentSchema = new Schema({
  commentImg: String,
  commentUserId: String,
  content: String,
  createdAt: Date,
  updatedAt: Date,
  userImage: String,
  username: String,
  votes: {
    upvotedBy: [
      {
        userId: Schema.Types.ObjectId,
      },
    ],
  },
});

// creating post schema
const postSchema = new Schema({
  comments: [commentSchema],
  content: String,
  createdAt: Date,
  likes: {
    likeCount: Number,
    likedBy: [
      {
        userId: Schema.Types.ObjectId,
        username: String,
      },
    ],
  },
  postImg: String,
  updatedAt: String,
  userId: Schema.Types.ObjectId,
  userImage: String,
  username: String,
});

// creating a module
const PostModule = mongoose.model("Post", postSchema);

export { postSchema, PostModule };
