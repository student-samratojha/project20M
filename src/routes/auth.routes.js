const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
router.get("/register", authController.getRegister);
router.post("/register", authController.register);
router.get("/login", authController.getLogin);
router.post("/login", authController.login);
router.get("/logout", verifyToken, authController.logout);
module.exports = router;
