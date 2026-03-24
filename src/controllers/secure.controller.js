const auditModel = require("../db/models/audit.model");
const userModel = require("../db/models/user.model");
const { regAuditing } = require("./auth.controller");
async function getAdmin(req, res) {
  try {
    const users = await userModel.find({ role: "user" });

    const audits = await auditModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user");

    const totalUsers = users.length;

    const totalProjects = users.reduce((acc, user) => {
      return acc + user.projects.length;
    }, 0);

    const totalActivity = audits.length;

    await regAuditing(req, "Admin Page Accessed");

    res.render("admin", {
      admin: req.user,
      users,
      audits,
      totalUsers,
      totalProjects,
      totalActivity,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/auth/login?Something_went_wrong_in_admin_page");
  }
}

async function deleteUser(req, res) {
  try {
    const user = await userModel.findById(req.body.id);
    if (!user) {
      await regAuditing(req, "Delete User Failed-User not found");
      return res.status(404).json({ message: "User not found" });
    }
    user.isDeleted = true;
    await user.save();
    await regAuditing(req, "Delete User Successfull");
    res.redirect("/secure/admin?user_deleted");
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?Something_went_wrong_in_delete_user");
  }
}

async function restoreUser(req, res) {
  try {
    const user = await userModel.findById(req.body.id);
    if (!user) {
      await regAuditing(req, "Restore User Failed-User not found");
      return res.status(404).json({ message: "User not found" });
    }
    user.isDeleted = false;
    await user.save();
    await regAuditing(req, "Restore User Successfull");
    res.redirect("/secure/admin?user_restored");
  } catch (err) {
    console.log(err);
    res.redirect("/secure/admin?Something_went_wrong_in_restore_user");
  }
}

async function getUser(req, res) {
  try {
    await regAuditing(req, "User Page Accessed");

    const audits = await auditModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user");

    res.render("user", {
      user: req.user,
      audits,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/auth/login?Something_went_wrong_in_user_page");
  }
}

async function getEdit(req, res) {
  try {
    res.render("editPage", { user: req.user });
  } catch (err) {
    console.log(err);
    res.redirect(`/secure/user?Something_Went_Wrong`);
  }
}

async function editPage(req, res) {
  try {
    const {
      name,
      bio,
      stack,
      city,
      education,
      profilePic,
      projects,
    } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      await regAuditing(req, "Edit Failed-User Not Found");
      return res.redirect(`/secure/user?Error`);
    }
const names = [].concat(req.body.languageNames);
const levels = [].concat(req.body.languageLevels);

const languages = names.map((name, i) => ({
  name,
  level: Number(levels[i])
}));
    user.name = name || user.name;
    user.city = city || user.city;
    user.projects = projects.split(",") || user.projects;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.languages = languages || user.language;
    user.stack = stack || user.stack;
    user.education = education || user.education;
    await user.save();
    await regAuditing(req, "Edit Successfull");
    res.redirect(`/secure/user?Edit_Successfull`);
  } catch (err) {
    console.log(err);
    res.redirect(`/secure/user?Something_Went_Wrong`);
  }
}



async function getAdminEdit(req, res) {
  try {
    res.render("editAdminPage", { user: req.user });
  } catch (err) {
    console.log(err);
    res.redirect(`/secure/admin?Something_Went_Wrong`);
  }
}

async function editAdminPage(req, res) {
  try {
    const {
      name,
      bio,
      stack,
      city,
      education,
      profilePic,
      projects,
    } = req.body;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      await regAuditing(req, "Edit Failed-User Not Found");
      return res.redirect(`/secure/admin?Error`);
    }
const names = [].concat(req.body.languageNames);
const levels = [].concat(req.body.languageLevels);

const languages = names.map((name, i) => ({
  name,
  level: Number(levels[i])
}));
    user.name = name || user.name;
    user.city = city || user.city;
    user.projects = projects.split(",") || user.projects;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.languages = languages || user.language;
    user.stack = stack || user.stack;
    user.education = education || user.education;
    await user.save();
    await regAuditing(req, "Edit Successfull");
    res.redirect(`/secure/admin?Edit_Successfull`);
  } catch (err) {
    console.log(err);
    res.redirect(`/secure/admin?Something_Went_Wrong`);
  }
}





module.exports = {
  getAdmin,
  deleteUser,
  restoreUser,
  getUser,
  getEdit,
  getAdminEdit,editAdminPage,
  editPage,
};
