const express = require("express");
const router = express.Router();

const {
    generateRisk,
    getRisk,
    generateAiAdvice, getAiRiskAdvice,
} = require("../controllers/risk_controller");

const authMiddleware = require("../middlewares/auth_middleware");

// risk hesapla + kaydet
router.post("/generate/:userId", authMiddleware, generateRisk);

// risk getir
router.get("/me", authMiddleware, getRisk);

// 🔥 AI yorum & tavsiye üret
router.get("/ai/me", authMiddleware, getAiRiskAdvice);

module.exports = router;
