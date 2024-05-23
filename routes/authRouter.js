const router = require("express").Router();

const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authenticate");
const checkSuperAdmin = require("../middlewares/superAdminCheck");

router.post(
  "/register",
  // authenticate,
  // checkSuperAdmin,
  authController.register
);

router.post("/login", authController.login);

router.get("/me", authenticate, authController.userCheck);

module.exports = router;
