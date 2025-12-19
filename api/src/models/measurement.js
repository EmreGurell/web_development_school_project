const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    doctorId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},

    enteredBy: {type: String, enum: ["doctor", "patient"], required: true},

    type: {type: String, required: true}, // tansiyon, şeker, nabız vs.
    value: mongoose.Schema.Types.Mixed,
    unit: String, // mg/dL, mmHg vs.

    symptoms: [String],

}, {timestamps: true});

module.exports = mongoose.model("Measurement", MeasurementSchema);