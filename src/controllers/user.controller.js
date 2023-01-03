import { UserModule } from "../modules/user.module";
import { cloudinary } from "../utils/cloudinary";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModule.find({});

    if ((await users).length) {
      res.status(200).json({ users: users });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch users", error: e });
  }
};

const getOneUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const userDetails = await UserModule.findById(id);

    if (userDetails) {
      res.status(200).json({ user: userDetails });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user", error: e });
  }
};

const editUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { userData } = req.body;

    const userDetails = await UserModule.findById(id);

    const { about, fullName, portfolio, profileBackgroundImg, profileImg } =
      userData;

    const newUserDetails = { about, fullName, portfolio };

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

    // come here again
    // ? res.status(201).json({ user: updatedUser,posts:allPosts })
    updatedUser
      ? res.status(201).json({ user: updatedUser })
      : res.status(404).json({ message: "User not found for now" });
  } catch (e) {
    console.log("e", e);
    res.status(500).json({ message: "Failed to edit user details", error: e });
  }
};

export { getAllUsers, getOneUsers, editUser };
