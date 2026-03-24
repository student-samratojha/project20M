const router = require("express").Router();
const secureController = require("../controllers/secure.controller");
const {
  verifyToken,
  isAdmin,
  isUser,
} = require("../middleware/auth.middleware");
router.get("/admin", verifyToken, isAdmin, secureController.getAdmin);
router.post("/delete", verifyToken, isAdmin, secureController.deleteUser);
router.post("/restore", verifyToken, isAdmin, secureController.restoreUser);
router.get("/user", verifyToken, isUser, secureController.getUser);
router.get("/edit", verifyToken, isUser, secureController.getEdit);
router.post("/edit", verifyToken, isUser, secureController.editPage);router.get("/update", verifyToken, isAdmin, secureController.getAdminEdit);
router.post("/update", verifyToken, isUser, secureController.editAdminPage);
module.exports = router;
