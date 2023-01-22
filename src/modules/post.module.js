import mongoose from "mongoose";

const { Schema } = mongoose;

// creating a comment schema (sub schema) for post schema
const commentSchema = new Schema({
  commentImg: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  commentUserId: Schema.Types.ObjectId,
  content: String,
  createdAt: Date,
  updatedAt: Date,
  userImage: String,
  username: String,
  votes: [
    {
      userId: Schema.Types.ObjectId,
    },
  ],
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
  postImg: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  updatedAt: Date,
  userId: Schema.Types.ObjectId,
  userImage: String,
  username: String,
});

// creating a module
const PostModule = mongoose.model("Post", postSchema);

export { postSchema, PostModule };
