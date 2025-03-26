import jwt from "jsonwebtoken";
import { UserModule } from "../modules/user.module.js";

const signupUser = async (req, res) => {
  try {
    const { username, password, fullName, email } = req.body;

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
        updatedAt: Date.now(),
        username: username,
      });

      const createdUser = await UserDocument.save();

      const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      });

      res.status(201).json({ createdUser: createdUser, encodedToken: token });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

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
        const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
          expiresIn: "24h",
        });
        res.status(200).json({ foundUser: foundUser, encodedToken: token });
      } else {
        res.status(401).json({ message: "password incorrect" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Interner Server Error", error: e });
  }
};

export { signupUser, loginUser };
