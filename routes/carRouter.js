const router = require("express").Router();
const upload = require("../services/multer");

const carController = require("../controllers/carController");
const authenticate = require("../middlewares/authenticate");
const checkSuperAdmin = require("../middlewares/superAdminCheck");

router.get("/", authenticate, carController.getAllCar);

router.post(
  "/create",
  authenticate,
  upload.single("image"),
  carController.createCar
);

router.patch(
  "/edit/:id",
  authenticate,
  checkSuperAdmin,
  upload.single("image"),
  carController.updateCar
);

// Contoh Implementasi
router.get("/:id", authenticate, carController.getCarById);

router.delete(
  "/delete/:id",
  authenticate,
  checkSuperAdmin,
  carController.deleteCar
);

module.exports = router;
