import { UserModule } from "../modules/user.module";

const signupUser = async (req, res) => {
  try {
    const { data } = req.body;

    const { username, password, fullName, email } = data;

    const tempUserName = username;
    const tempUserEmail = email;

    const foundUserEmail = await UserModule.findOne({
      email: tempUserEmail,
    }).exec();

    const foundUserName = await UserModule.findOne({
      username: tempUserName,
    }).exec();

    if (foundUserEmail) {
      res.status(422).json({ message: "Email already exists" });
    } else if (foundUserName) {
      res.status(422).json({ message: "Username already exists" });
    } else {
      const UserDocument = new UserModule({
        about: "",
        bookmarks: [],
        createdAt: Date.now(),
        email: email,
        followers: [],
        following: [],
        fullName: fullName,
        password: password,
        portfolio: "",

        profileBackgroundImg:
          "https://res.cloudinary.com/amish11/image/upload/v1655103095/social%20media/Gojo_Chibi_amoppk.jpg",
        profileImg:
          "https://res.cloudinary.com/amish11/image/upload/v1654875318/social%20media/guest_ob9mu4.png",

        updatedAt: Date.now(),
        username: username,
      });

      const createdUser = await UserDocument.save();
      res.status(201).json({ createdUser: createdUser, encodedToken: "abcd" });
    }
  } catch (e) {
    res.status(500).json({ message: "Failed to create new user", error: e });
  }
};

const loginUser = async (req, res) => {
  try {
    // const { data } = req.body;

    const { username, password } = req.body;

    console.log("data", data);

    const tempUserName = username;
    const tempUserPassword = password;

    const foundUser = await UserModule.findOne({
      username: tempUserName,
    }).exec();

    const checkCorrectUser = await UserModule.findOne({
      username: tempUserName,
      password: tempUserPassword,
    }).exec();

    if (foundUser) {
      if (checkCorrectUser) {
        res.status(200).json(foundUser);
      } else {
        res.status(401).json({ message: "password incorrect" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Login failed. Try again later.", error: e });
  }
};

export { signupUser, loginUser };
