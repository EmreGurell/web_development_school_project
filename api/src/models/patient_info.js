const mongoose = require("mongoose");

const PatientInfoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    chronicDiseases: [String],
    pregnancy: { type: Boolean, default: false },
    allergies: [String],
    notes: String,

}, { timestamps: true });

module.exports = mongoose.model("PatientInfo", PatientInfoSchema);