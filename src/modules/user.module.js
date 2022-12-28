import mongoose from "mongoose";

import { postSchema } from "./post.module";

const { Schema } = mongoose;

// creating user schema
const userSchema = new Schema({
  about: String,
  bookmarks: [postSchema],
  createdAt: Date,
  email: String,
  followers: [
    {
      userId: Schema.Types.ObjectId,
      profileImg: String,
      username: String,
      fullName: String,
    },
  ],
  following: [
    {
      userId: Schema.Types.ObjectId,
      profileImg: String,
      username: String,
      fullName: String,
    },
  ],
  fullName: String,
  password: String,
  portfolio: String,
  profileBackgroundImg: String,
  profileImg: String,
  updatedAt: Date,
  username: String,
});

// creating a module
const UserModule = mongoose.model("User", userSchema);

export { userSchema, UserModule };
