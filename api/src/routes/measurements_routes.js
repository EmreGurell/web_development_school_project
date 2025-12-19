const router = require("express").Router();
const { createMeasurement, getUserMeasurement, getLastMeasurements, deleteMeasurement} = require("../controllers/measurement_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.post("/add", authMiddleware, createMeasurement);
router.get("/my", authMiddleware, getUserMeasurement);
router.get("/last/30", authMiddleware, getLastMeasurements);
router.delete("/delete/:measurementId", authMiddleware, deleteMeasurement);
module.exports = router;
