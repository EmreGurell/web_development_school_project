const mongoose = require("mongoose");

const VaccinationRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vaccineName: String,
    dose: Number,
    date: Date
}, { timestamps: true });

module.exports = mongoose.model("VaccinationRecord", VaccinationRecordSchema);
