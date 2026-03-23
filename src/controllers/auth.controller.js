const userModel = require("../db/models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auditModel = require("../db/models/audit.model");
const saltRounds = 10;
async function regAuditing(req, action) {
  try {
    const audit = new auditModel({
      user: req.user._id || null,
      action: action,
      route: req.originalUrl,
      method: req.method,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });
    await audit.save();
  } catch (err) {
    console.log(err);
  }
}

async function getRegister(req, res) {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
  }
}

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      bio,
      languages,
      stack,
      city,
      education,
      profilePic,
      projects,
    } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      await regAuditing(req, "Register Failed-User already exists");
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      bio,
      languages: languages?.split(","),
      stack,
      city,
      education,
      profilePic,
      projects: projects?.split(","),
    });
    await user.save();
    await regAuditing(req, "Register Successfull");
    res.redirect("/auth/login?register_success");
  } catch (err) {
    console.log(err);
    res.redirect("/auth/register?Something_went_wrong");
  }
}

async function getLogin(req, res) {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      await regAuditing(req, "Login Failed-User not found");
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await regAuditing(req, "Login Failed-Invalid password");
      return res.status(400).json({ message: "Invalid password" });
    }
    if (user.isDeleted) {
      await regAuditing(req, "Login Failed-User is deleted");
      return res.status(400).json({ message: "User is deleted" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    await regAuditing(req, "Login Successfull");
    res.redirect(`/secure/${user.role}?Welcome_back_${user.name}`);
  } catch (err) {
    console.log(err);
    res.redirect("/auth/login?Something_went_wrong");
  }
}

async function logout(req, res) {
  try {
    res.clearCookie("token");
    await regAuditing(req, "Logout Successfull");
    res.redirect("/auth/login?logout_success");
  } catch (err) {
    console.log(err);
    res.redirect("/auth/login?Something_went_wrong");
  }
}

module.exports = {
  getRegister,
  register,
  getLogin,
  login,
  logout,
};
