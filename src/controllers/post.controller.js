import { connect } from "mongoose";
import { PostModule } from "../modules/post.module";
import { UserModule } from "../modules/user.module";
import { cloudinary } from "../utils/cloudinary";

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModule.find({});

    if ((await posts).length) {
      res.status(200).json({ posts: posts });
    } else {
      res.status(404).json({ message: "No Post found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch Posts", error: e });
  }
};

const createPost = async (req, res) => {
  try {
    const { postData } = req.body;
    const { content, postImg, userId } = postData;

    const userDetails = await UserModule.findById(userId);

    if (userDetails) {
      const newPost = {
        comments: [],
        content: content,
        createdAt: Date.now(),
        likes: {
          likeCount: 0,
          likedBy: [],
        },

        updatedAt: Date.now(),

        userId: userDetails._id,
        userImage: userDetails.profileImg.url,
        username: userDetails.username,
      };

      if (postImg.length) {
        const postImage = await cloudinary.uploader.upload(postImg, {
          folder: "funime/posts",
        });

        newPost.postImg = {
          public_id: postImage.public_id,
          url: postImage.url,
        };
      } else {
        newPost.postImg = {
          public_id: "",
          url: "",
        };
      }

      const PostDocument = new PostModule(newPost);

      const createdPost = await PostDocument.save();

      res.status(201).json({ createdPost: createdPost });
    } else {
      res.status(400).json({ message: "User Not Authorized" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to create Posts", error: e });
  }
};

const getOnePost = async (req, res) => {
  try {
    const { id } = req.params;

    const postDetails = await PostModule.findById(id);

    if (postDetails) {
      res.status(200).json({ post: postDetails });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch Post", error: e });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const userPosts = await PostModule.find({ username });

    if ((await userPosts).length) {
      res.status(200).json({ posts: userPosts });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch Post", error: e });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await PostModule.findByIdAndDelete(id);

    if (deletedPost) {
      const postImageId = deletedPost.postImg.public_id;

      if (postImageId) {
        await cloudinary.uploader.destroy(postImageId);
      }

      const posts = await PostModule.find({});

      if (await posts) {
        res.status(200).json({ posts: posts });
      } else {
        res.status(400).json({ message: "Cannot fetch post" });
      }
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch Post", error: e });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postData } = req.body;
    const { content, postImg, postUserId } = postData;

    const foundPost = await PostModule.findById(postId);

    //check if post is present or not
    if (foundPost) {
      const foundUser = await UserModule.findById(postUserId);

      //   check if post we are trying to edit belongs to the user or not
      if (foundUser) {
        const newPostDetails = {
          content,
        };
        // if post image is empty or not
        if (postImg) {
          //if not empty check if its existing image or new image
          if (!postImg.includes("cloudinary")) {
            const postImageId = foundPost.postImg.public_id;
            //if new image we delete the previous image if it exists
            if (postImageId) {
              await cloudinary.uploader.destroy(postImageId);
            }
            const newPostImage = await cloudinary.uploader.upload(postImg, {
              folder: "funime/posts",
            });

            newPostDetails.postImg = {
              public_id: newPostImage.public_id,
              url: newPostImage.url,
            };
          }
        } else {
          const postImageId = foundPost.postImg.public_id;

          if (postImageId) {
            await cloudinary.uploader.destroy(postImageId);
          }

          newPostDetails.postImg = {
            public_id: "",
            url: "",
          };
        }

        const updatedPost = await PostModule.findByIdAndUpdate(
          postId,
          newPostDetails,
          {
            new: true,
          }
        );

        // return all posts come here againg
        if (updatedPost) {
          const posts = await PostModule.find({});

          if ((await posts).length) {
            res.status(201).json({ posts: posts });
          } else {
            res.status(404).json({ message: "No Post found" });
          }
        } else {
          res.status(404).json({ message: "User not found for now" });
        }
      } else {
        res.status(400).json({
          message:
            "Post you are trying to edit does not belong to logged in user",
        });
      }
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to edit Post", error: e });
  }
};

export {
  getAllPosts,
  createPost,
  getOnePost,
  getUserPosts,
  deletePost,
  editPost,
};
