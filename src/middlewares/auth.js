const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AuthenticationError } = require("apollo-server-express");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req?.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        throw new AuthenticationError("Not authenticated");
      }
      req.token = token;
      req.user = user;
    }
    next();
  } catch (err) {
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};

module.exports = authMiddleware;
