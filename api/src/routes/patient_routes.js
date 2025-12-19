const express = require("express");
const router = express.Router();
const { getPatientById, createPatient, getAllPatients, updatePatient, getMyProfile } = require("../controllers/patient_controller");
const authMiddleware = require("../middlewares/auth_middleware");

router.get("/get", authMiddleware, getAllPatients);
router.post("/create", authMiddleware, createPatient);
router.get("/profile/:patientId", authMiddleware, getPatientById);
router.get("/me", authMiddleware, getMyProfile);
router.put("/update/:patientId", authMiddleware, updatePatient);
module.exports = router;