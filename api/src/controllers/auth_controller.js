require("dotenv").config();

const User = require("../models/user");
const DoctorProfile = require("../models/doctor_profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// REGISTER
const registerUser = async (req, res) => {
    try {
        const { email, password, role, trID } = req.body;

        // required fields
        if ( !trID ||!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email,tc no ve parola zorunludur.",
            });
        }

        // password length check
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Parola en az 8 karakter olmalıdır.",
            });
        }

        // user exists?
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu email ile kayıtlı bir kullanıcı zaten var.",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = new User({
            trID: trID,
            email: email,
            password: hashedPassword,
            role: role || "user"
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Kullanıcı başarıyla oluşturuldu.",
        });

    } catch (error) {
        logger.error("REGISTER ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Bir hata oluştu, tekrar deneyin.",
        });
    }
};


// LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email ve parola gereklidir.",
            });
        }

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Kullanıcı bulunamadı.",
            });
        }

        // compare password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Parola yanlış.",
            });
        }

        // generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Giriş başarılı.",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        logger.error("LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Bir hata oluştu.",
        });
    }
};


// CHANGE PASSWORD
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Eski ve yeni parola zorunludur.",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı.",
            });
        }

        // check old password
        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Eski parola yanlış.",
            });
        }

        // new password min length
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Yeni parola en az 8 karakter olmalıdır.",
            });
        }

        // save new password

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Parola başarıyla güncellendi.",
        });

    } catch (error) {
        logger.error("CHANGE PASSWORD ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Bir hata oluştu.",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

        user.password = password;
        user.isActive = true;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        res.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            success: true,
            message: "Çıkış yapıldı.",
        });
    } catch (err) {
        logger.error("LOGOUT ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Çıkış yapılamadı.",
        });
    }
};
const registerDoctor = async (req, res) => {
    try {
        const {email, trID,name,surname,password,phone,specialization,hospital,licenseNumber} = req.body;

        if(!email || !trID || !name || !surname || !password){
            return res.status(400).json({
                success: false,
                message: "Email, TC Kimlik No, şifre, isim ve soyisim zorunludur."
            });
        }

        if (!/^\d{11}$/.test(trID)) {
            return res.status(400).json({
                success: false,
                message: "Geçerli bir TC Kimlik No giriniz. (11 haneli)"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Geçerli bir email adresi giriniz."
            });
        }
        const existingUser = await User.findOne({
            $or: [{email}, {trID}]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu email veya TC Kimlik No ile kayıtlı bir kullanıcı zaten var."
            });
        }
        const user = new User({email, trID, role:"doctor",password,isActive:true});
        await user.save();

        const doctorProfile = new DoctorProfile({
            userId: user._id,
            trID,
            name,
            surname,
            phone,
            specialization,
            hospital,
            licenseNumber
        });

        await doctorProfile.save();

        res.status(201).json({
            success: true,
            message: "Doktor kaydı başarıyla oluşturuldu. Giriş bilgileri email adresinize gönderildi.",
            data: {
                userId: user._id,
                email: user.email,
                name: doctorProfile.name,
                surname: doctorProfile.surname
            }
        });

    }catch (error) {
        logger.error("Doktor kayıt hatası:", error);
        res.status(500).json({
            success: false,
            message: "Kayıt sırasında bir hata oluştu",
            error: error.message
        });
    }
}


module.exports = {
    resetPassword,
    registerUser,
    loginUser,
    changePassword,
    logoutUser,
    registerDoctor
};
