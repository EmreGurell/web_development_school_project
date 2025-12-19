const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        logger.log("Connected to the database successfully");
    } catch (error) {
        logger.error("Error connecting to the database", error);
    }
};

module.exports = connectToDB;
