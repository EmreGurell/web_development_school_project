const express = require("express");
const {
    loginUser,
    registerUser,
    changePassword,
    resetPassword, logoutUser, registerDoctor
} = require("../controllers/auth_controller");

const authMiddleware = require("../middlewares/auth_middleware");
const router = express.Router();

//routes
router.post("/register", (req, res) => {
    registerUser(req, res);
});
router.post("/register/doctor", (req, res) => {
    registerDoctor(req, res);
});
router.post("/login", (req, res) => {
    loginUser(req, res);
});
router.post("/change-password", authMiddleware, (req, res) => {
    changePassword(req, res);
});
router.post("/logout", authMiddleware, logoutUser);

router.post("/reset-password", resetPassword)
module.exports = router;
