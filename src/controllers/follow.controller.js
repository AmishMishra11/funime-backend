import { UserModule } from "../modules/user.module";

const followUser = async (req, res) => {
  try {
    const { followUserId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const followUserDetails = await UserModule.findById(followUserId);

    if (userDetails) {
      if (followUserDetails) {
        const followedUser = userDetails.following.filter(
          (item) => item.userId == followUserId
        );

        if (!followedUser.length) {
          const newFollowing = {
            userId: followUserId,
            profileImg: followUserDetails.profileImg,
            username: followUserDetails.username,
            fullName: followUserDetails.fullName,
          };

          userDetails.following.push(newFollowing);

          const updatedUser = await userDetails.save();

          const newFollower = {
            userId: userId,
            profileImg: userDetails.profileImg,
            username: userDetails.username,
            fullName: userDetails.fullName,
          };

          followUserDetails.followers.push(newFollower);

          const updatedFollowUser = await followUserDetails.save();

          if (updatedUser && updatedFollowUser) {
            res
              .status(201)
              .json({ user: updatedUser, followUser: updatedFollowUser });
          } else {
            res.status(400).json({ message: "Cannot follow this User" });
          }
        } else {
          res
            .status(400)
            .json({ message: "You have already followed this User" });
        }
      } else {
        res.status(404).json({ message: "Followed User not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal serer error", error: e });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { followUserId } = req.params;
    const { userId } = req.body;

    const userDetails = await UserModule.findById(userId);
    const followUserDetails = await UserModule.findById(followUserId);

    if (userDetails) {
      if (followUserDetails) {
        const followedUser = userDetails.following.filter(
          (item) => item.userId == followUserId
        );

        if (followedUser.length) {
          const newFollower = userDetails.following.filter(
            (item) => item.userId != followUserId
          );

          userDetails.following = newFollower;

          const updatedUser = await userDetails.save();

          const newFollowing = userDetails.followers.filter(
            (item) => item.userId != userId
          );

          followUserDetails.followers = newFollowing;

          const updatedFollowUser = await followUserDetails.save();

          if (updatedUser && updatedFollowUser) {
            res
              .status(201)
              .json({ user: updatedUser, followUser: updatedFollowUser });
          } else {
            res.status(400).json({ message: "Cannot unfollow this User" });
          }
        } else {
          res.status(400).json({ message: "You have dont follow this User" });
        }
      } else {
        res.status(404).json({ message: "Followed User not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal serer error", error: e });
  }
};

export { followUser, unfollowUser };
