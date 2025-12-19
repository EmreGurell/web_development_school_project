const Diagnosis = require("../models/diagnosis");
const PatientProfile = require("../models/patient_profile");
const DiseaseStats = require("../models/disease_stats");
const User = require("../models/user");
const createDiagnosis = async (req, res) => {
  try {
    const {
      doctorId,
      userId,
      diseases,
      severity,
      status,
      notes,
      treatmentPlan,
    } = req.body;

    // Validasyon
    if (!userId || !diseases || diseases.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Hasta ID ve en az bir hastalık zorunludur",
      });
    }

    // Hasta var mı kontrol et
    const patient = await User.findOne({
      _id: userId,
      role: "patient",
      isActive: true,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Hasta bulunamadı",
      });
    }

    // Tanı oluştur
    const diagnosis = new Diagnosis({
      userId,
      doctorId,
      diseases,
      severity: severity || "medium",
      status: status || "active",
      notes: notes || undefined,
      treatmentPlan: treatmentPlan || undefined,
    });

    await diagnosis.save();

    // Populate
    await diagnosis.populate("doctorId", "email");
    await diagnosis.populate("userId", "email");

    // Hastalık istatistiklerini güncelle
    try {
      const patientProfile = await PatientProfile.findOne({ userId });
      const city = patientProfile?.city || "Bilinmiyor";
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      for (const disease of diseases) {
        await DiseaseStats.findOneAndUpdate(
          {
            regionName: city,
            disease: disease,
            year,
            month,
          },
          {
            $inc: { count: 1 }, // count'u 1 artır
          },
          {
            upsert: true, // Yoksa oluştur
            new: true,
          }
        );
      }
    } catch (statsError) {
      logger.error("İstatistik güncelleme hatası:", statsError);
      // İstatistik hatası tanı kaydını etkilemesin
    }

    res.status(201).json({
      success: true,
      message: "Tanı başarıyla kaydedildi",
      data: diagnosis,
    });
  } catch (error) {
    logger.error("Tanı oluşturma hatası:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Geçersiz veri formatı",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Tanı kaydedilirken bir hata oluştu",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
const getLastDiagnosis = async (req, res) => {
  try {
    const userId = req.user._id;

    const diagnosis = await Diagnosis.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("doctorId", "email");

    if (!diagnosis) {
      return res.json({
        success: true,
        data: null,
      });
    }

    // Doktor bilgisini al
    const doctorName =
      diagnosis.doctorId?.email?.split("@")[0] || "Bilinmeyen Doktor";

    // İlk hastalığı name olarak kullan
    const name =
      diagnosis.diseases && diagnosis.diseases.length > 0
        ? diagnosis.diseases[0]
        : "Teşhis bilgisi yok";

    res.json({
      success: true,
      data: {
        ...diagnosis.toObject(),
        name,
        doctorName,
        type: diagnosis.severity || "Genel",
      },
    });
  } catch (err) {
    logger.error("getLastDiagnosis", err);
    res
      .status(500)
      .json({ success: false, message: "Teşhis bilgisi alınamadı" });
  }
};
const getDiagnosis = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role === "patient" && req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const list = await Diagnosis.find({ userId })
      .populate("doctorId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(200);
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createDiagnosis, getDiagnosis, getLastDiagnosis };
