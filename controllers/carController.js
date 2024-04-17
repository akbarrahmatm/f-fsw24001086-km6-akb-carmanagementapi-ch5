const { Car } = require("../models");

const getAllCar = async (req, res, next) => {
  try {
    const cars = await Car.findAll();
    if (cars) {
      res.status(200).json({
        status: "Success",
        requestAt: req.requestTime,
        data: { ...cars },
      });
    }
  } catch (err) {}
};

module.exports = {
  getAllCar,
};
