const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail", // veya başka bir email servisi
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email gönderildi:", info.messageId);
        return info;
    } catch (error) {
        console.error("Email gönderme hatası:", error);
        throw error;
    }
};