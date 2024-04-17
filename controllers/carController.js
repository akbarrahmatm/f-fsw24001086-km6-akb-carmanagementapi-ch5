const { Car, User } = require("../models");
const ApiError = require("../utils/ApiError");
const imagekit = require("../services/imagekit");
const { Op } = require("sequelize");

const getAllCar = async (req, res, next) => {
  try {
    const cars = await Car.findAll({
      include: [
        {
          model: User,
          as: "createdByUser",
          attributes: ["id", "name", "role"],
        },

        {
          model: User,
          as: "deletedByUser",
          attributes: ["id", "name", "role"],
        },
        {
          model: User,
          as: "updatedByUser",
          attributes: ["id", "name", "role"],
        },
      ],
    });

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
      include: [
        {
          model: User,
          as: "createdByUser",
          attributes: ["id", "name", "role"],
        },

        {
          model: User,
          as: "deletedByUser",
          attributes: ["id", "name", "role"],
        },

        {
          model: User,
          as: "updatedByUser",
          attributes: ["id", "name", "role"],
        },
      ],
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
    // Create by nanti ganti jwt
    const { type, model, manufacture, price } = req.body;
    let newCar;

    if (!type || !model || !manufacture || !price || !file) {
      next(
        new ApiError(
          "type, model, manufacture, price, and image is required",
          400
        )
      );
      return;
    }

    if (file !== null) {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy: req.user.id,
        image: img.url,
      });
    } else {
      newCar = await Car.create({
        type,
        model,
        manufacture,
        price,
        createdBy: req.user.id,
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
      next(new ApiError(`Data with id '${id}' is not found`, 404));
      return;
    }

    const deletedBy = req.user.id;

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

const updateCar = async (req, res, next) => {
  try {
    const file = (await req.file) || null;

    const id = req.params.id;

    // Last update by nanti ganti jwt
    const { type, model, manufacture, price } = req.body;

    console.log(file);

    const car = await Car.findOne({
      where: {
        id,
      },
    });

    if (!car) {
      next(new ApiError(`Data with id '${id}' is not found`, 404));
      return;
    }

    if (file !== null) {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      await Car.update(
        {
          type,
          model,
          manufacture,
          price,
          lastUpdatedBy: req.user.id,
          image: img.url,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await Car.update(
        {
          type,
          model,
          manufacture,
          price,
          lastUpdatedBy: req.user.id,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    const updatedCar = await Car.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: updatedCar,
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
  updateCar,
};
