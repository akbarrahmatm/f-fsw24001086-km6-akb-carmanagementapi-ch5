const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

router.use("/api-docs", swaggerUI.serve);
router.use("/api-docs", swaggerUI.setup(swaggerDocument));

const authRouter = require("./authRouter");
const carRouter = require("./carRouter");

router.use("/api/v1/auth", authRouter);
router.use("/api/v1/cars", carRouter);

module.exports = router;
