const mongoose = require("mongoose");

const DoctorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    trID: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    surname: { type: String, required: true },

    specialization: String, // uzmanlık alanı
    hospital: String,
    phone: String,

    licenseNumber: String, // diploma numarası

}, { timestamps: true });

module.exports = mongoose.model("DoctorProfile", DoctorProfileSchema);