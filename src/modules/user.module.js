import mongoose from "mongoose";

import { postSchema } from "./post.module.js";

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
  profileBackgroundImg: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/amish11/image/upload/v1655103095/social%20media/Gojo_Chibi_amoppk.jpg",
      required: true,
    },
  },
  profileImg: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/amish11/image/upload/v1654875318/social%20media/guest_ob9mu4.png",
      required: true,
    },
  },
  updatedAt: Date,
  username: String,
});

// creating a module
const UserModule = mongoose.model("User", userSchema);

export { userSchema, UserModule };
