const PatientProfile = require("../models/patient_profile");
const PatientInfo = require("../models/patient_info");
const User = require("../models/user");
const Measurement = require("../models/measurement");
const Diagnosis = require("../models/diagnosis");
const RiskAssessment = require("../models/risk_assessment");
const VaccinationRecord = require("../models/vaccination_record");
const {sendEmail} = require("../utils/mailService");
const {generateRandomPassword} = require("../utils/helpers");
const {getPatientWelcomeEmailTemplate, getPatientWelcomeEmailText} = require("../utils/emailTemplates");
const logger = require("../utils/logger");

const updatePatient = async (req, res) => {
    try {
        const {patientId} = req.params;
        const {
            name,
            surname,
            phone,
            city,
            address,
            age,
            gender,
            chronicDiseases,
            pregnancy,
            allergies,
            notes
        } = req.body;
        const doctorId = req.user.userId;

        const patient = await User.findOne({
            _id: patientId,
            role: "patient",
            isActive: true,
        });

        if (!patient) {
            return res.status(404).json({success: false, message: "Hasta bulunamadı"});
        }

        if (age && (age < 0 || age > 200)) {
            return res.status(400).json({
                success: false,
                message: "Geçerli bir yaş giriniz (0-200)"
            });
        }

        const profileUpdate = {};
        if (name !== undefined) profileUpdate.name = name;
        if (surname !== undefined) profileUpdate.surname = surname;
        if (phone !== undefined) profileUpdate.phone = phone;
        if (address !== undefined) profileUpdate.address = address;
        if (age !== undefined) profileUpdate.age = age;
        if (gender !== undefined) profileUpdate.gender = gender;
        if (city !== undefined) profileUpdate.city = city;

        const updatedProfile = await PatientProfile.findOneAndUpdate
            ({userId: patientId}, profileUpdate, {new: true, upsert: true});

        const infoUpdate = {};
        if (chronicDiseases !== undefined) infoUpdate.chronicDiseases = chronicDiseases;
        if (pregnancy !== undefined) infoUpdate.pregnancy = pregnancy;
        if (allergies !== undefined) infoUpdate.allergies = allergies;
        if (notes !== undefined) infoUpdate.notes = notes;

        await PatientInfo.findOneAndUpdate({userId: patientId}, infoUpdate, {new: true, upsert: true});

        return res.status(200).json({
            success: true,
            message: "Hasta bilgileri güncellendi",
            data: updatedProfile
        });

    } catch (error) {
        console.error("Update patient error:", error);
        return res.status(500).json({
            success: false,
            message: "Güncelleme sırasında bir hata oluştu"
        });
    }
};

const createPatient = async (req, res) => {
            try {
                const {
                    email,
                    trID,
                    name,
                    surname,
                    phone,
                    city,
                    address,
                    age,
                    gender,
                    chronicDiseases,
                    pregnancy,
                    allergies,
                    notes
                } = req.body;

                if (!email || !trID || !name || !surname) {
                    return res.status(400).json({
                        success: false,
                        message: "Email, TC Kimlik No, isim ve soyisim zorunludur."
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

                const randomPassword = generateRandomPassword(12);

                const user = new User({
                    email,
                    trID,
                    role: "patient",
                    password: randomPassword,
                    isActive: true
                });
                await user.save();

                const patientProfile = new PatientProfile({
                    userId: user._id,
                    trID,
                    name,
                    surname,
                    phone,
                    city: city || "İstanbul",
                    address,
                    age,
                    gender
                });
                await patientProfile.save();

                const patientInfo = new PatientInfo({
                    userId: user._id,
                    chronicDiseases,
                    pregnancy,
                    allergies,
                    notes
                });


                await patientInfo.save();

                const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
                
                // Profesyonel HTML email template
                const emailHTML = getPatientWelcomeEmailTemplate({
                    name,
                    surname,
                    email,
                    password: randomPassword,
                    frontendUrl
                });
                
                // Plain text versiyonu (fallback)
                const emailText = getPatientWelcomeEmailText({
                    name,
                    surname,
                    email,
                    password: randomPassword,
                    frontendUrl
                });

                await sendEmail({
                    to: email,
                    subject: "Medicare - Hoş Geldiniz! Hesabınız Oluşturuldu",
                    text: emailText,
                    html: emailHTML
                });

                // 11. Başarılı response
                res.status(201).json({
                    success: true,
                    message: "Hasta kaydı başarıyla oluşturuldu. Giriş bilgileri hastanın email adresine gönderildi.",
                    data: {
                        userId: user._id,
                        email: user.email,
                        name: patientProfile.name,
                        surname: patientProfile.surname,
                        trID: patientProfile.trID,
                        temporaryPassword: randomPassword // opsiyonel: doktor görsün diye
                    }
                });

            } catch (error) {
                logger.error("Create patient error:", error);
                res.status(500).json({
                    success: false,
                    message: "Hasta oluşturulurken bir hata oluştu",
                    error: error.message
                });
            }
        };

        const getAllPatients = async (req, res) => {
            try {
                const { search = "", page = 1, limit = 20 } = req.query;
                const skip = (parseInt(page) - 1) * parseInt(limit);

                const searchRegex = new RegExp(search, "i");

                // Arama kriterleri
                const searchCriteria = {
                    role: "patient",
                    isActive: true,
                    $or: [
                        { email: searchRegex },
                        { trID: searchRegex }
                    ]
                };

                // Toplam hasta sayısı
                const totalPatients = await User.countDocuments(searchCriteria);

                // Sayfalama ile hastaları getir
                const patients = await User.find(searchCriteria)
                    .select('-password -passwordResetToken -passwordResetExpires')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));

                // Her hasta için profil bilgilerini ekle
                const patientsWithProfiles = await Promise.all(
                    patients.map(async (patient) => {
                        const profile = await PatientProfile.findOne({userId: patient._id})
                            .select('name surname phone city age gender')
                            .lean();

                        return {
                            _id: patient._id,
                            email: patient.email,
                            trID: patient.trID,
                            createdAt: patient.createdAt,
                            name: profile?.name || '',
                            surname: profile?.surname || '',
                            phone: profile?.phone || '',
                            city: profile?.city || '',
                            age: profile?.age || null,
                            gender: profile?.gender || ''
                        };
                    })
                );

                res.status(200).json({
                    success: true,
                    count: patientsWithProfiles.length,
                    total: totalPatients,
                    page: parseInt(page),
                    totalPages: Math.ceil(totalPatients / parseInt(limit)),
                    data: patientsWithProfiles
                });

            } catch (error) {
                logger.error("Get all patients error:", error);
                res.status(500).json({
                    success: false,
                    message: "Hastalar getirilirken bir hata oluştu",
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };

        exports.searchPatients = async (req, res) => {
            try {
                const { query } = req.query;

                if (!query || query.trim().length < 2) {
                    return res.status(400).json({
                        success: false,
                        message: "Arama sorgusu en az 2 karakter olmalıdır"
                    });
                }

                const searchRegex = new RegExp(query, "i");

                const patients = await User.find({
                    role: "patient",
                    isActive: true,
                    $or: [
                        { email: searchRegex },
                        { trID: searchRegex }
                    ]
                })
                    .select('-password -passwordResetToken -passwordResetExpires')
                    .limit(50)
                    .lean();

                const uniquePatients = Array.from(
                    new Map(patients.map(p => [p._id.toString(), p])).values()
                );

                const patientsWithProfiles = await Promise.all(
                    uniquePatients.map(async (patient) => {
                        const profile = await PatientProfile.findOne({userId: patient._id})
                            .select('name surname phone city age gender')
                            .lean();

                        return {
                            _id: patient._id,
                            email: patient.email,
                            trID: patient.trID,
                            createdAt: patient.createdAt,
                            name: profile?.name || '',
                            surname: profile?.surname || '',
                            phone: profile?.phone || '',
                            city: profile?.city || '',
                            age: profile?.age || null,
                            gender: profile?.gender || ''
                        };
                    })
                );

                res.status(200).json({
                    success: true,
                    count: patientsWithProfiles.length,
                    data: patientsWithProfiles
                });

            } catch (error) {
                logger.error("Hasta arama hatası:", error);
                res.status(500).json({
                    success: false,
                    message: "Hasta arama sırasında bir hata oluştu",
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };

// Tek bir hastanın DETAYLI bilgilerini getir (ayrı endpoint)
        const getPatientById = async (req, res) => {
            try {
                const {patientId} = req.params;

                // Hasta kullanıcısını bul
                const patient = await User.findOne({
                    _id: patientId,
                    role: "patient",
                    isActive: true
                }).select('-password -passwordResetToken -passwordResetExpires');

                if (!patient) {
                    return res.status(404).json({
                        success: false,
                        message: "Hasta bulunamadı"
                    });
                }

                // Profil bilgileri
                const profile = await PatientProfile.findOne({userId: patient._id});

                // Sağlık bilgileri
                const info = await PatientInfo.findOne({userId: patient._id});

                // Tanılar
                const diagnoses = await Diagnosis.find({userId: patient._id})
                    .populate('doctorId', 'email')
                    .sort({createdAt: -1});

                // Ölçümler
                const measurements = await Measurement.find({userId: patient._id})
                    .populate('doctorId', 'email')
                    .sort({createdAt: -1})
                    .limit(50);

                // Risk değerlendirmesi
                const riskAssessment = await RiskAssessment.findOne({userId: patient._id})
                    .sort({createdAt: -1});

                // Aşı kayıtları
                const vaccinations = await VaccinationRecord.find({userId: patient._id})
                    .sort({date: -1});

                res.status(200).json({
                    success: true,
                    data: {
                        patient,
                        profile,
                        info,
                        diagnoses,
                        measurements,
                        riskAssessment,
                        vaccinations
                    }
                });

            } catch (error) {
                logger.error("Hasta detay hatası:", error);
                res.status(500).json({
                    success: false,
                    message: "Hasta bilgileri getirilirken bir hata oluştu",
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
        };

// Kullanıcının kendi profil bilgilerini getir
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        // Kullanıcıyı bul
        const user = await User.findOne({
            _id: userId,
            role: "patient",
            isActive: true
        }).select('-password -passwordResetToken -passwordResetExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı"
            });
        }

        // Profil bilgileri
        const profile = await PatientProfile.findOne({userId: user._id});

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    trID: user.trID,
                },
                profile: profile ? {
                    name: profile.name,
                    surname: profile.surname,
                    phone: profile.phone,
                    city: profile.city,
                    age: profile.age,
                    gender: profile.gender,
                } : null
            }
        });

    } catch (error) {
        logger.error("Profil getirme hatası:", error);
        res.status(500).json({
            success: false,
            message: "Profil bilgileri getirilirken bir hata oluştu",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

        module.exports = {getPatientById, createPatient, getAllPatients, updatePatient, getMyProfile};
