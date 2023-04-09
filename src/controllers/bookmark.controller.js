import { PostModule } from "../modules/post.module";
import { UserModule } from "../modules/user.module";

const getBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDetails = await UserModule.findById(userId);
    if (userDetails) {
      res.status(200).json({ bookmarks: userDetails.bookmarks });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error", error: e });
  }
};

const addBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const postDetails = await PostModule.findById(postId);

    if (userDetails) {
      if (postDetails) {
        const foundBookmark = userDetails.bookmarks.filter(
          (item) => item.id == postId
        );

        if (!foundBookmark.length) {
          userDetails.bookmarks.push(postDetails);

          const updatedUser = await userDetails.save();

          if (updatedUser) {
            res.status(201).json({ bookmarks: updatedUser.bookmarks });
          } else {
            res.status(400).json({ message: "Cannot bookmark this post" });
          }
        } else {
          res
            .status(400)
            .json({ message: "You have already bookmark this post" });
        }
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal serer error", error: e });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);

    if (userDetails) {
      const foundBookmark = userDetails.bookmarks.filter(
        (item) => item.id == postId
      );

      if (foundBookmark.length) {
        const newBookmarks = userDetails.bookmarks.filter(
          (item) => item.id !== postId
        );

        userDetails.bookmarks = newBookmarks;

        const updatedUser = await userDetails.save();

        if (updatedUser) {
          res.status(201).json({ bookmarks: updatedUser.bookmarks });
        } else {
          res.status(400).json({ message: "Cannot remove this bookmark" });
        }
      } else {
        res.status(400).json({ message: "Cannot remove this bookmark." });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

export { getBookmarks, addBookmark, removeBookmark };
