const mongoose = require("mongoose");

const PatientProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    trID: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    surname: { type: String, required: true },

    phone: String,

    city: { type: String, required: true },
    address: String,

    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },

}, { timestamps: true });

module.exports = mongoose.model("PatientProfile", PatientProfileSchema);