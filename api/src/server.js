const express = require("express");
require("dotenv").config();
const connectToDB = require("./db/db");
const cors = require("cors");
const logger = require("./utils/logger");


//routes
const auth_routes = require("./routes/auth_routes");
const measurement_routes = require("./routes/measurements_routes");
const diagnosis_routes = require("./routes/diagnosis_routes");
const risk_routes = require("./routes/risk_routes");
const stats_routes = require("./routes/stats_routes");
const patient_routes = require("./routes/patient_routes");



const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());

// CORS configuration - production ready
const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:3000", "http://localhost:5173"];

// Add production URL if exists
if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    allowedOrigins.push(process.env.NEXT_PUBLIC_FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use("/auth", auth_routes);
app.use("/patient", patient_routes);
app.use("/measurements", measurement_routes);
app.use("/diagnosis", diagnosis_routes);
app.use("/risk", risk_routes);
app.use("/stats", stats_routes);

// Health check endpoint (for Vercel/serverless)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export app for Vercel serverless functions
module.exports = app;

app.listen(PORT, () => {
    logger.log(`Server is running on port ${PORT}`);

    //mongodb conn
    connectToDB();
});