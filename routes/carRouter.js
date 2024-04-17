const router = require("express").Router();
const upload = require("../services/multer");

const carController = require("../controllers/carController");

router
  .route("/")
  .get(carController.getAllCar)
  .post(upload.single("image"), carController.createCar);

router
  .route("/:id")
  .get(carController.getCarById)
  .delete(carController.deleteCar)
  .patch(upload.single("image"), carController.updateCar);

module.exports = router;
