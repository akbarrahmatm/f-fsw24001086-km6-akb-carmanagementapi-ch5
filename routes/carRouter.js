const router = require("express").Router();
const upload = require("../services/multer");

const carController = require("../controllers/carController");
const authenticate = require("../middlewares/authenticate");
const checkSuperAdmin = require("../middlewares/superAdminCheck");

router
  .route("/")
  .get(authenticate, carController.getAllCar)
  .post(authenticate, upload.single("image"), carController.createCar);

router
  .route("/:id")
  .get(authenticate, carController.getCarById)
  .delete(authenticate, checkSuperAdmin, carController.deleteCar)
  .patch(
    authenticate,
    checkSuperAdmin,
    upload.single("image"),
    carController.updateCar
  );

module.exports = router;
