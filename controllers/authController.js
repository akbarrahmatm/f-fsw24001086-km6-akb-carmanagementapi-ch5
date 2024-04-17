require("dotenv").config();

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          email: user.email,
          name: user.User.name,
          role: user.User.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES,
        }
      );

      res.status(200).json({
        status: "Success",
        message: "Token successfully created",
        data: token,
      });
    } else {
      next(new ApiError(" Wrong Email Or Password", 400));
      return;
    }
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const userCheck = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
    return;
  }
};

module.exports = {
  register,
  login,
  userCheck,
};
