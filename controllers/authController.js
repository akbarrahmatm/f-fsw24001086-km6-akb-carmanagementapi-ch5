const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, name, age, address, role } =
      req.body;

    console.log(req.body);

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !age ||
      !address ||
      !role
    ) {
      next(
        new ApiError(
          "Email, password, confirmPassword, name, age, address, role is required",
          400
        )
      );
      return;
    }

    // Check unique email
    const isEmailExist = await Auth.findOne({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      next(new ApiError("Email is already taken", 400));
      return;
    }

    // Check password length
    const passwordLength = password <= 8;
    if (passwordLength) {
      next(new ApiError("Password should be 8 character or more", 400));
      return;
    }

    // Check password & passwordConfirm
    if (password !== confirmPassword) {
      next(new ApiError("password & confirmPassword does not match", 400));
      return;
    }

    // Encrypt
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      name,
      age,
      address,
      role,
    });

    const newAuth = await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    res.status(201).json({
      status: "Success",
      data: {
        ...newUser.dataValues,
        email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

module.exports = {
  register,
};
