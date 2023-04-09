import { connectToMongoose } from "../db/db.connect";
import { PostModule } from "../modules/post.module";
import { UserModule } from "../modules/user.module";

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModule.findById(postId);

    if (post) {
      res.status(200).json({ comments: post.comments });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const addComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { commentData } = req.body;

    const { content, commentImg, commentUserId } = commentData;

    const userDetails = await UserModule.findById(commentUserId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const newComment = {
          commentUserId: commentUserId,
          content: content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userImage: userDetails.profileImg.url,
          username: userDetails.username,
          votes: [],
        };

        if (commentImg.length) {
          const commentImage = await cloudinary.uploader.upload(commentImg, {
            folder: "funime/posts",
          });

          newComment.commentImg = {
            public_id: commentImage.public_id,
            url: commentImage.url,
          };
        } else {
          newComment.commentImg = {
            public_id: "",
            url: "",
          };
        }

        postDetails.comments.push(newComment);

        const updatedPost = await postDetails.save();

        res.status(201).json({ comments: updatedPost.comments });
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

const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { commentData } = req.body;
    const { content, commentImg, commentUserId } = commentData;

    const userDetails = await UserModule.findById(commentUserId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundComment = postDetails.comments.filter(
          (item) => item.id == commentId
        );

        if (foundComment.length) {
          const newCommentData = {
            content: content,
            updatedAt: Date.now(),
          };

          if (commentImg) {
            if (!commentImg.includes("cloudinary")) {
              const commentImageId = foundComment[0].commentImg.public_id;
              if (commentImageId) {
                await cloudinary.uploader.destroy(commentImageId);
              }
              const newCommentImage = await cloudinary.uploader.upload(
                commentImg,
                {
                  folder: "funime/posts",
                }
              );

              newCommentData.commentImg = {
                public_id: newCommentImage.public_id,
                url: newCommentImage.url,
              };
            }
          } else {
            const commentImageId = foundComment[0].commentImg.public_id;

            if (commentImageId) {
              await cloudinary.uploader.destroy(commentImageId);
            }

            newCommentData.commentImg = {
              public_id: "",
              url: "",
            };
          }

          const updatedPost = await PostModule.findOneAndUpdate(
            { _id: postId, "comments._id": commentId },
            {
              $set: {
                "comments.$.content": newCommentData.content,
                "comments.$.updatedAt": newCommentData.updatedAt,
                "comments.$.commentImg": newCommentData.commentImg,
              },
            },
            {
              new: true,
            }
          );

          if (updatedPost) {
            res.status(201).json({ comments: updatedPost.comments });
          } else {
            res.status(400).json({ message: "Cannot edit comment" });
          }
        } else {
          res.status(404).json({ message: "Comment not found" });
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

const deleteCommnet = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const postDetails = await PostModule.findById(postId);

    if (postDetails) {
      const foundComment = postDetails.comments.filter(
        (item) => item._id == commentId
      );

      if (foundComment.length) {
        const newComment = postDetails.comments.filter(
          (item) => item.id !== commentId
        );

        postDetails.comments = newComment;

        const updatedPost = await postDetails.save();

        if (updatedPost) {
          res.status(201).json({ comments: updatedPost.comments });
        } else {
          res.status(400).json({ message: "Cannot delete comment" });
        }
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundComment = postDetails.comments.filter(
          (item) => item.id === commentId
        );

        if (foundComment.length) {
          const upvotedCommentUser = foundComment[0].votes.filter(
            (item) => item.userId.toString() === userId
          );

          if (upvotedCommentUser.length === 0) {
            foundComment[0].votes.push({ userId });
            const updatedPost = await postDetails.save();
            if (updatedPost) {
              res.status(201).json({ comments: updatedPost.comments });
            } else {
              res.status(400).json({ message: "Cannot like Comment" });
            }
          } else {
            res
              .status(400)
              .json({ message: "You have already liked this comment" });
          }
        } else {
          res.status(404).json({ message: "Comment not found" });
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

const dislikeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundComment = postDetails.comments.filter(
          (item) => item.id === commentId
        );

        if (foundComment.length) {
          const upvotedCommentUser = foundComment[0].votes.filter(
            (item) => item.userId == userId
          );

          if (upvotedCommentUser.length !== 0) {
            const newComments = foundComment[0].votes.filter(
              (item) => item.userId != userId
            );

            foundComment[0].votes = newComments;

            const newPostComments = postDetails.comments.map((item) =>
              item.id === commentId ? foundComment[0] : item
            );

            postDetails.comments = newPostComments;

            const updatedPost = await postDetails.save();

            if (updatedPost) {
              res.status(201).json({ comments: updatedPost.comments });
            } else {
              res.status(400).json({ message: "Cannot dislike Comment" });
            }
          } else {
            res.status(400).json({
              message: "You cannot dislike a comment you didnt like",
            });
          }
        } else {
          res.status(404).json({ message: "Comment not found" });
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
  getPostComments,
  addComments,
  editComment,
  deleteCommnet,
  likeComment,
  dislikeComment,
};
