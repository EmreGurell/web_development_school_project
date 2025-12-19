const DiseaseStats = require("../models/disease_stats");
const logger = require("../utils/logger");


const getCityStats = async (req, res) => {
    try {
        const { disease, year, month, ageGroup, gender } = req.query;

        const filter = {};

        if (disease) filter.disease = disease;
        if (year) filter.year = parseInt(year);
        if (month) filter.month = parseInt(month);
        if (ageGroup) filter.ageGroup = ageGroup;
        if (gender) filter.gender = gender;

        const stats = await DiseaseStats.find(filter)
            .sort({ count: -1 })
            .limit(200);

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (err) {
        logger.error("getCityStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const getHeatmapData = async (req, res) => {
    try {
        const { disease, year, month } = req.query;

        const match = {};

        if (disease) match.disease = disease;
        if (year) match.year = parseInt(year);
        if (month) match.month = parseInt(month);

        const heatmap = await DiseaseStats.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$regionName",
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    regionName: "$_id",
                    value: "$total",
                    _id: 0,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: heatmap,
        });
    } catch (err) {
        logger.error("getHeatmapData error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getDiseaseStats = async (req, res) => {
    try {
        const { regionName, year, month } = req.query;

        const match = {};

        if (regionName) match.regionName = regionName;
        if (year) match.year = parseInt(year);
        if (month) match.month = parseInt(month);

        const diseaseStats = await DiseaseStats.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$disease",
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    disease: "$_id",
                    count: "$total",
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: diseaseStats,
        });
    } catch (err) {
        logger.error("getDiseaseStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getAgeGroupStats = async (req, res) => {
    try {
        const { regionName, disease, year, month } = req.query;

        const match = {};
        if (regionName) match.regionName = regionName;
        if (disease) match.disease = disease;
        if (year) match.year = parseInt(year);
        if (month) match.month = parseInt(month);
        match.ageGroup = { $exists: true, $ne: null };

        const ageStats = await DiseaseStats.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$ageGroup",
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    ageGroup: "$_id",
                    count: "$total",
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: ageStats,
        });
    } catch (err) {
        logger.error("getAgeGroupStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getGenderStats = async (req, res) => {
    try {
        const { regionName, disease, year, month } = req.query;

        const match = {};
        if (regionName) match.regionName = regionName;
        if (disease) match.disease = disease;
        if (year) match.year = parseInt(year);
        if (month) match.month = parseInt(month);
        match.gender = { $exists: true, $ne: null };

        const genderStats = await DiseaseStats.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$gender",
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    gender: "$_id",
                    count: "$total",
                    _id: 0,
                },
            },
            { $sort: { count: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: genderStats,
        });
    } catch (err) {
        logger.error("getGenderStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getTimeSeriesStats = async (req, res) => {
    try {
        const { regionName, disease } = req.query;

        const match = {};
        if (regionName) match.regionName = regionName;
        if (disease) match.disease = disease;

        const timeSeries = await DiseaseStats.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    year: "$_id.year",
                    month: "$_id.month",
                    count: "$total",
                    _id: 0,
                },
            },
            { $sort: { year: 1, month: 1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: timeSeries,
        });
    } catch (err) {
        logger.error("getTimeSeriesStats error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getAllDiseases = async (req, res) => {
    try {
        const diseases = await DiseaseStats.distinct("disease");

        return res.status(200).json({
            success: true,
            data: diseases,
        });
    } catch (err) {
        logger.error("getAllDiseases error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    getCityStats,
    getHeatmapData,
    getDiseaseStats,
    getAgeGroupStats,
    getGenderStats,
    getTimeSeriesStats,
    getAllDiseases,
};
