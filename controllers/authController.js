const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, name, age, address, role } =
      req.body;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !age ||
      !address ||
      !role
    ) {
      return next(
        new ApiError(
          "Email, password, confirmPassword, name, age, address, role is required",
          400
        )
      );
    }

    // Check unique email
    const isEmailExist = await Auth.findOne({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      return next(new ApiError("Email is already taken", 409));
    }

    // Check password length
    if (password.length <= 8) {
      return next(new ApiError("Password should be 8 character or more", 422));
    }

    // Check password & passwordConfirm
    if (password !== confirmPassword) {
      return next(
        new ApiError("password & confirmPassword does not match", 401)
      );
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

    await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    res.status(201).json({
      status: "Success",
      message: "User successfully registered",
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError("email & password is required", 400));
    }

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
        message: "Succesfully logged in",
        data: token,
      });
    } else {
      return next(new ApiError("Wrong Email Or Password", 401));
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
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
    return next(new ApiError(err.message, 500));
  }
};

module.exports = {
  register,
  login,
  userCheck,
};
