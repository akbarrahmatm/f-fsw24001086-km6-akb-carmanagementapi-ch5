const { Car } = require("../models");
const ApiError = require("../utils/ApiError");
const imagekit = require("../services/imagekit");

const getAllCar = async (req, res, next) => {
  try {
    const cars = await Car.findAll();

    return res.status(200).json({
      status: "Success",
      requestAt: req.requestTime,
      data: { ...cars },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const getCarById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      next(new ApiError(`Data with id '${id}' is not found`, 404));
      return;
    }

    res.status(200).json({
      status: "Success",
      requestAt: req.requestTime,
      data: car,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const createCar = async (req, res, next) => {
  try {
    const file = (await req.file) || null;
    const { type, model, manufacture, price, createdBy } = req.body;
    let newCar;

    if (file !== null) {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      console.log("gaada");

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy,
        image: img.url,
      });
    } else {
      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy,
      });
    }

    res.status(201).json({
      status: "Success",
      data: { ...newCar.dataValues },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find Car
    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      next(new ApiError(`Data with id '${id}' is not found`, 400));
      return;
    }

    // Diganti kalo udah ada jwt
    const deletedBy = 1;

    await Car.update(
      {
        deletedBy,
      },
      {
        where: {
          id,
        },
      }
    );

    await Car.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Car with id '${car.id}' is successfully deleted`,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

module.exports = {
  getAllCar,
  getCarById,
  createCar,
  deleteCar,
};
