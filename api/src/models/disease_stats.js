const mongoose = require("mongoose");

const DiseaseStatsSchema = new mongoose.Schema({
    regionName: {type: String, required: true},
    disease: {type: String, required: true},

    count: {type: Number, default: 0},
    year: {type: Number, default: () => new Date().getFullYear()},
    month: {type: Number, default: () => new Date().getMonth() + 1},

    ageGroup: String,
    gender: String,
}, { timestamps: true });

DiseaseStatsSchema.index({ regionName: 1, disease: 1, year: 1, month: 1 });

module.exports = mongoose.model("DiseaseStats", DiseaseStatsSchema);