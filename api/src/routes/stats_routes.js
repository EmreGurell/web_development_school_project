const express = require("express");
const router = express.Router();
const {
    getCityStats,
    getHeatmapData,
    getDiseaseStats,
    getAgeGroupStats,
    getGenderStats,
    getTimeSeriesStats,
    getAllDiseases,
} = require("../controllers/stats_controller");

router.get("/city", getCityStats);
router.get("/heatmap", getHeatmapData);
router.get("/diseases", getDiseaseStats);
router.get("/age-groups", getAgeGroupStats);
router.get("/genders", getGenderStats);
router.get("/time-series", getTimeSeriesStats);
router.get("/diseases-list", getAllDiseases);

module.exports = router;
