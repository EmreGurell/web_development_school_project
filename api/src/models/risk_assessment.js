const mongoose = require("mongoose");

const RiskSchema = new mongoose.Schema({
    disease: String,
    level: {type: String, enum: ["low", "medium", "high", "critical"]},
    score: Number,
    reason: String,
    suggestions: [String],
    source: {type: String, enum: ["ai", "rule-based", "doctor"]},
});

const RiskAssessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    overallScore: Number, // genel risk skoru
    overallLevel: {type: String, enum: ["low", "medium", "high", "critical"]},

    risks: [RiskSchema],

    aiModel: String,
    factors: [String],

}, { timestamps: true });

module.exports = mongoose.model("RiskAssessment", RiskAssessmentSchema);