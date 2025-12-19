const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    trID: { type: String, required: true, unique: true },
    role: { type: String, enum: ["doctor", "patient"], required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },

    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("User", userSchema);