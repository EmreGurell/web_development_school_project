const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
    logger.log("Auth middleware executed.");

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied.", success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Normalize token structure
        req.user = {
            _id: decoded.sub || decoded.id,  // <-- ÖNEMLİ
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(500).json({ message: "Access Denied.", success: false });
    }
};

module.exports = authMiddleware;
