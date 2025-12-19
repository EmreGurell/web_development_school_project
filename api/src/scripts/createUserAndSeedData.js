const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/user");
const PatientProfile = require("../models/patient_profile");
const Measurement = require("../models/measurement");
const Diagnosis = require("../models/diagnosis");
const RiskAssessment = require("../models/risk_assessment");

// Test hesabı bilgileri
const TEST_EMAIL = "test@hasta.com";
const TEST_PASSWORD = "12345678";
const TEST_TRID = "12345678902";

async function createUserAndSeedData() {
  try {
    // MongoDB bağlantısı - db.js'deki ile aynı variable adını kullan
    const mongoUri =
      process.env.MONGO_DB_URI ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/healthcare";
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB bağlantısı başarılı");

    // Kullanıcı var mı kontrol et
    let patient = await User.findOne({ email: TEST_EMAIL, role: "patient" });

    if (!patient) {
      console.log("📝 Test hesabı oluşturuluyor...");

      // Kullanıcı oluştur - password'u plain text olarak ver, model'deki pre("save") hook hash'leyecek
      patient = new User({
        email: TEST_EMAIL,
        trID: TEST_TRID,
        role: "patient",
        password: TEST_PASSWORD, // Plain text - model'deki hook hash'leyecek
        isActive: true,
      });
      await patient.save();
      console.log("✅ Test hesabı oluşturuldu");

      // Profil oluştur
      const profile = new PatientProfile({
        userId: patient._id,
        trID: TEST_TRID,
        name: "Test",
        surname: "Hasta",
        phone: "5551234567",
        city: "İstanbul",
        age: 35,
        gender: "male",
      });
      await profile.save();
      console.log("✅ Hasta profili oluşturuldu");
    } else {
      console.log(`📝 Mevcut hesap bulundu: ${patient.email}`);

      // Profil var mı kontrol et
      let profile = await PatientProfile.findOne({ userId: patient._id });
      if (!profile) {
        profile = new PatientProfile({
          userId: patient._id,
          trID: TEST_TRID,
          name: "Test",
          surname: "Hasta",
          phone: "5551234567",
          city: "İstanbul",
          age: 35,
          gender: "male",
        });
        await profile.save();
        console.log("✅ Hasta profili oluşturuldu");
      }
    }

    const userId = patient._id;
    console.log(`📝 Hasta ID: ${userId}`);

    // Mevcut verileri temizle
    console.log("🧹 Eski veriler temizleniyor...");
    await Measurement.deleteMany({ userId });
    await Diagnosis.deleteMany({ userId });
    await RiskAssessment.deleteMany({ userId });
    console.log("✅ Eski veriler temizlendi");

    // Doktor bul (yoksa null bırak)
    const doctor = await User.findOne({ role: "doctor", isActive: true }).limit(
      1
    );
    const doctorId = doctor?._id || userId; // Fallback olarak patient ID kullan

    // 📊 ÖLÇÜMLER - Son 30 gün için çeşitli ölçümler
    const measurements = [];
    const now = new Date();

    console.log("📊 Ölçümler oluşturuluyor...");

    // Kan şekeri ölçümleri (her gün, son 20 gün)
    for (let i = 20; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const hour = 8 + Math.floor(Math.random() * 8);
      date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

      measurements.push({
        userId,
        enteredBy: i % 3 === 0 ? "doctor" : "patient",
        type: "Kan Şekeri",
        value: 85 + Math.floor(Math.random() * 50),
        unit: "mg/dL",
        symptoms: i % 5 === 0 ? ["Hafif baş dönmesi"] : [],
        createdAt: date,
      });
    }

    // Tansiyon ölçümleri (günde 1-2 kez, son 25 gün)
    for (let i = 25; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(
        10 + Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      const systolic = 110 + Math.floor(Math.random() * 30);
      const diastolic = 70 + Math.floor(Math.random() * 20);

      measurements.push({
        userId,
        enteredBy: i % 4 === 0 ? "doctor" : "patient",
        type: "Tansiyon",
        value: `${systolic}/${diastolic}`,
        unit: "mmHg",
        symptoms: [],
        createdAt: date,
      });
    }

    // Nabız ölçümleri (günde 2-3 kez, son 15 gün)
    for (let i = 15; i >= 0; i--) {
      for (let j = 0; j < 2; j++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(9 + j * 6, Math.floor(Math.random() * 60), 0, 0);

        measurements.push({
          userId,
          enteredBy: "patient",
          type: "Nabız",
          value: 60 + Math.floor(Math.random() * 40),
          unit: "bpm",
          symptoms: [],
          createdAt: date,
        });
      }
    }

    // Ateş ölçümleri (günde 1 kez, son 10 gün)
    for (let i = 10; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(18, Math.floor(Math.random() * 60), 0, 0);

      measurements.push({
        userId,
        enteredBy: i % 2 === 0 ? "doctor" : "patient",
        type: "Ateş",
        value: (36.5 + Math.random() * 1.5).toFixed(1),
        unit: "°C",
        symptoms: i === 5 ? ["Halsizlik", "Baş ağrısı"] : [],
        createdAt: date,
      });
    }

    await Measurement.insertMany(measurements);
    console.log(`✅ ${measurements.length} ölçüm eklendi`);

    // 🏥 TANI - Son 3 aydan 2 tanı
    console.log("🏥 Tanılar oluşturuluyor...");
    const diagnoses = [
      {
        userId,
        doctorId: doctorId,
        diseases: ["Hipertansiyon", "Tip 2 Diyabet"],
        severity: "medium",
        status: "chronic",
        notes: "Hasta düzenli takip altında. İlaç kullanımına devam ediyor.",
        treatmentPlan:
          "Günlük ilaç kullanımı, düzenli egzersiz, diyet kontrolü",
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        doctorId: doctorId,
        diseases: ["Yüksek Kolesterol"],
        severity: "low",
        status: "active",
        notes: "Kontrol amaçlı muayene. Kolesterol değerleri takip ediliyor.",
        treatmentPlan: "Diyet değişikliği önerildi. 3 ay sonra kontrol.",
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    ];

    await Diagnosis.insertMany(diagnoses);
    console.log(`✅ ${diagnoses.length} tanı eklendi`);

    // ⚠️ RİSK DEĞERLENDİRMESİ - Son 2 ay için 2 risk raporu
    console.log("⚠️ Risk değerlendirmeleri oluşturuluyor...");
    const riskAssessments = [
      {
        userId,
        overallScore: 65,
        overallLevel: "medium",
        risks: [
          {
            disease: "Diabetes",
            level: "medium",
            score: 55,
            reason: "Kan şekeri değerleri yüksek seviyelerde",
            suggestions: ["Diyet kontrolü", "Düzenli egzersiz", "İlaç takibi"],
            source: "rule-based",
          },
          {
            disease: "Hypertension",
            level: "high",
            score: 75,
            reason: "Tansiyon değerleri yüksek",
            suggestions: [
              "Tuz kısıtlaması",
              "Düzenli tansiyon ölçümü",
              "Kardiyoloji takibi",
            ],
            source: "rule-based",
          },
        ],
        factors: ["Yaş", "Önceki tanılar", "Ölçüm değerleri"],
        createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        userId,
        overallScore: 58,
        overallLevel: "medium",
        risks: [
          {
            disease: "Diabetes",
            level: "medium",
            score: 50,
            reason: "Kan şekeri kontrol altında ama takip gerekiyor",
            suggestions: ["Diyet devamı", "Egzersiz programı"],
            source: "rule-based",
          },
        ],
        factors: ["Önceki tanılar", "Ölçüm trendleri"],
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      },
    ];

    await RiskAssessment.insertMany(riskAssessments);
    console.log(`✅ ${riskAssessments.length} risk değerlendirmesi eklendi`);

    console.log("\n✅ Tüm dummy data başarıyla oluşturuldu!");
    console.log(`\n📋 Test Hesabı Bilgileri:`);
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Şifre: ${TEST_PASSWORD}`);
    console.log(`   TC Kimlik: ${TEST_TRID}`);
    console.log(`\n📊 Oluşturulan Veriler:`);
    console.log(`   - ${measurements.length} ölçüm`);
    console.log(`   - ${diagnoses.length} tanı`);
    console.log(`   - ${riskAssessments.length} risk değerlendirmesi`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

// Script'i çalıştır
createUserAndSeedData();
