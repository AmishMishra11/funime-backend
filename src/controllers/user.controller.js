import { PostModule } from "../modules/post.module";
import { UserModule } from "../modules/user.module";
import { cloudinary } from "../utils/cloudinary";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModule.find({});

    if ((await users).length) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const getOneUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const userDetails = await UserModule.findById(id);

    if (userDetails) {
      res.status(200).json({ user: userDetails });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userData } = req.body;

    const userDetails = await UserModule.findById(id);

    const { about, fullName, portfolio, profileBackgroundImg, profileImg } =
      userData;

    const newUserDetails = {
      about,
      fullName,
      portfolio,
      updatedAt: Date.now(),
    };

    if (profileImg) {
      const oldProfileImage = userDetails.profileImg.public_id;

      if (oldProfileImage) {
        await cloudinary.uploader.destroy(oldProfileImage);
      }

      const newProfileImage = await cloudinary.uploader.upload(profileImg, {
        folder: "funime/users",
      });

      newUserDetails.profileImg = {
        public_id: newProfileImage.public_id,
        url: newProfileImage.url,
      };
    }

    if (profileBackgroundImg) {
      const bgImageId = userDetails.profileBackgroundImg.public_id;

      if (bgImageId) {
        await cloudinary.uploader.destroy(bgImageId);
      }

      const newBgImage = await cloudinary.uploader.upload(
        profileBackgroundImg,
        {
          folder: "funime/users",
        }
      );

      newUserDetails.profileBackgroundImg = {
        public_id: newBgImage.public_id,
        url: newBgImage.url,
      };
    }

    const updatedUser = await UserModule.findByIdAndUpdate(id, newUserDetails, {
      new: true,
    });

    if (profileImg) {
      await PostModule.updateMany(
        { userId: id },
        { $set: { userImage: newUserDetails.profileImg.url } }
      );
    }
    const allPosts = await PostModule.find({});

    updatedUser
      ? res.status(201).json({ user: updatedUser, posts: allPosts })
      : res.status(400).json({ message: "Cannot edit Userdetails" });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

export { getAllUsers, getOneUsers, editUser };
