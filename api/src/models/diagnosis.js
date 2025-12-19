const mongoose = require("mongoose");

const DiagnosisSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

    diseases: [String],
    severity: {type: String, enum: ["low", "medium", "high"]},
    status: {type: String, enum: ["active", "recovered", "chronic"], default: "active"},

    notes: String,
    treatmentPlan: String,
}, {timestamps: true});

module.exports = mongoose.model("Diagnosis", DiagnosisSchema);