import jwt from "jsonwebtoken";

const authVerify = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "not authorized" });

  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    return next();
  } catch (e) {
    console.log("error occured: ", e);
    res.status(401).json({
      message: "not authorized",
    });
  }
};

export { authVerify };
