const router = require("express").Router();

const authRouter = require("./authRouter");
const carRouter = require("./carRouter");

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/cars", carRouter);

module.exports = router;
