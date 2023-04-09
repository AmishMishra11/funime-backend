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
    res.status(500).json({ message: "Internal Server Error", error: e });
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

      const posts = await PostModule.find({});

      if ((await posts).length) {
        res.status(201).json({ posts: posts });
      } else {
        res.status(404).json({ message: "No Post found" });
      }
    } else {
      res.status(400).json({ message: "Cannot Create Post" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const getOnePost = async (req, res) => {
  try {
    const { id } = req.params;

    const postDetails = await PostModule.findById(id);

    if (postDetails) {
      res.status(200).json({ post: postDetails });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const userPosts = await PostModule.find({ username });

    if ((await userPosts).length) {
      res.status(200).json({ posts: userPosts });
    } else {
      res.status(200).json({ posts: [] });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
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
        res.status(400).json({ message: "Cannot delete post" });
      }
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { postData } = req.body;
    const { content, postImg, postUserId } = postData;

    const foundPost = await PostModule.findById(postId);

    if (foundPost) {
      const foundUser = await UserModule.findById(postUserId);

      if (foundUser) {
        const newPostDetails = {
          content,
          updatedAt: Date.now(),
        };
        if (postImg) {
          if (!postImg.includes("cloudinary")) {
            const postImageId = foundPost.postImg.public_id;
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
        if (updatedPost) {
          const posts = await PostModule.find({});

          if ((await posts).length) {
            res.status(201).json({ posts: posts });
          } else {
            res.status(400).json({ message: "Cannot update post" });
          }
        } else {
          res.status(400).json({ message: "Cannot update post" });
        }
      } else {
        res.status(400).json({
          message: "Cannot edit post",
        });
      }
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundLikeUser = postDetails.likes.likedBy.filter(
          (item) => item.userId == userId
        );

        if (!foundLikeUser.length) {
          const newLiksUser = {
            userId: userDetails._id,
            username: userDetails.username,
          };
          const likeArray = postDetails.likes.likedBy;

          likeArray.push(newLiksUser);

          const newLikes = {
            likeCount: postDetails.likes.likeCount + 1,
            likedBy: likeArray,
          };

          const updatedPost = await PostModule.findByIdAndUpdate(
            postId,
            { likes: newLikes },
            {
              new: true,
            }
          );

          const allPost = await PostModule.find({});

          if (updatedPost) {
            res.status(201).json({ posts: allPost });
          } else {
            res.status(400).json({ message: "Cannot like post" });
          }
        } else {
          res.status(400).json({ message: "You have already liked this post" });
        }
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundLikeUser = postDetails.likes.likedBy.filter(
          (item) => item.userId == userId
        );

        if (foundLikeUser.length) {
          const likeArray = postDetails.likes.likedBy.filter(
            (item) => item.userId != userId
          );

          const newLikes = {
            likeCount: postDetails.likes.likeCount - 1,
            likedBy: likeArray,
          };

          const updatedPost = await PostModule.findByIdAndUpdate(
            postId,
            { likes: newLikes },
            {
              new: true,
            }
          );

          const allPost = await PostModule.find({});

          if (updatedPost) {
            res.status(201).json({ allPost: allPost, myPost: updatedPost });
          } else {
            res.status(400).json({ message: "Cannot dislike post" });
          }
        } else {
          res
            .status(400)
            .json({ message: "You cannot dislikd a post you didnt like" });
        }
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

export {
  getAllPosts,
  createPost,
  getOnePost,
  getUserPosts,
  deletePost,
  editPost,
  likePost,
  dislikePost,
};
