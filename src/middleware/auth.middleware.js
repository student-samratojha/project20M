const jwt = require("jsonwebtoken");
const userModel = require("../db/models/user.model");
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function isAdmin(req, res, next) {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function isUser(req, res, next) {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "user") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { verifyToken, isAdmin, isUser };
