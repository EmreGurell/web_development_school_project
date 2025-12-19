const express = require("express");
const router = express.Router();
const { getDiagnosis,getLastDiagnosis, createDiagnosis} = require("../controllers/diagnosis_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.post("/new", authMiddleware, createDiagnosis);
router.get("/my", authMiddleware, getDiagnosis);
router.get("/last", authMiddleware, getLastDiagnosis);

module.exports = router;
