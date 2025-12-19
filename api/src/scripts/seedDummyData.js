const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const User = require("../models/user");
const PatientProfile = require("../models/patient_profile");
const Measurement = require("../models/measurement");
const Diagnosis = require("../models/diagnosis");
const RiskAssessment = require("../models/risk_assessment");

// Kullanıcı email'i komut satırından alınır veya tüm patient'lara yüklenir
const USER_EMAIL = process.argv[2]; // node seedDummyData.js email@example.com

async function seedDummyData() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB bağlantısı başarılı");

    let patient;
    
    if (USER_EMAIL) {
      // Belirtilen email'e göre hasta bul
      patient = await User.findOne({ email: USER_EMAIL, role: "patient" });
      if (!patient) {
        console.log(`❌ ${USER_EMAIL} email'ine sahip hasta bulunamadı.`);
        process.exit(1);
      }
    } else {
      // Tüm patient'lara yükle (veya ilk patient'a)
      const patients = await User.find({ role: "patient", isActive: true }).limit(1);
      if (patients.length === 0) {
        console.log("❌ Aktif hasta kullanıcısı bulunamadı.");
        console.log("💡 Kullanım: node api/src/scripts/seedDummyData.js email@example.com");
        process.exit(1);
      }
      patient = patients[0];
    }

    const userId = patient._id;
    console.log(`📝 Hasta bulundu: ${patient.email} (ID: ${userId})`);

    // Mevcut verileri temizle (opsiyonel)
    await Measurement.deleteMany({ userId });
    await Diagnosis.deleteMany({ userId });
    await RiskAssessment.deleteMany({ userId });

    console.log("🧹 Eski veriler temizlendi");

    // 📊 ÖLÇÜMLER - Son 30 gün için çeşitli ölçümler
    const measurements = [];
    const now = new Date();

    // Kan şekeri ölçümleri (her gün, son 20 gün)
    for (let i = 20; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const hour = 8 + Math.floor(Math.random() * 8); // 8-16 saatleri arası
      date.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

      measurements.push({
        userId,
        enteredBy: i % 3 === 0 ? "doctor" : "patient", // Her 3 ölçümden biri doktor tarafından
        type: "Kan Şekeri",
        value: 85 + Math.floor(Math.random() * 50), // 85-135 arası normal aralıkta
        unit: "mg/dL",
        symptoms: i % 5 === 0 ? ["Hafif baş dönmesi"] : [],
        createdAt: date,
      });
    }

    // Tansiyon ölçümleri (günde 1-2 kez, son 25 gün)
    for (let i = 25; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(10 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60), 0, 0);

      const systolic = 110 + Math.floor(Math.random() * 30); // 110-140
      const diastolic = 70 + Math.floor(Math.random() * 20); // 70-90

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
          value: 60 + Math.floor(Math.random() * 40), // 60-100 arası normal
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
        value: (36.5 + Math.random() * 1.5).toFixed(1), // 36.5-38 arası
        unit: "°C",
        symptoms: i === 5 ? ["Halsizlik", "Baş ağrısı"] : [],
        createdAt: date,
      });
    }

    await Measurement.insertMany(measurements);
    console.log(`✅ ${measurements.length} ölçüm eklendi`);

    // Doktor bul (yoksa null bırak)
    const doctor = await User.findOne({ role: "doctor", isActive: true }).limit(1);
    const doctorId = doctor?._id || null;

    // 🏥 TANI - Son 3 aydan 2 tanı
    const diagnoses = [
      {
        userId,
        doctorId: doctorId || userId, // Doktor yoksa hasta ID'sini kullan (fallback)
        diseases: ["Hipertansiyon", "Tip 2 Diyabet"],
        severity: "medium",
        status: "chronic",
        notes: "Hasta düzenli takip altında. İlaç kullanımına devam ediyor.",
        treatmentPlan: "Günlük ilaç kullanımı, düzenli egzersiz, diyet kontrolü",
        createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 60 gün önce
      },
      {
        userId,
        doctorId: patient._id,
        diseases: ["Yüksek Kolesterol"],
        severity: "low",
        status: "active",
        notes: "Kontrol amaçlı muayene. Kolesterol değerleri takip ediliyor.",
        treatmentPlan: "Diyet değişikliği önerildi. 3 ay sonra kontrol.",
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 gün önce
      },
    ];

    await Diagnosis.insertMany(diagnoses);
    console.log(`✅ ${diagnoses.length} tanı eklendi`);

    // ⚠️ RİSK DEĞERLENDİRMESİ - Son 2 ay için 2 risk raporu
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
            suggestions: ["Tuz kısıtlaması", "Düzenli tansiyon ölçümü", "Kardiyoloji takibi"],
            source: "rule-based",
          },
        ],
        factors: ["Yaş", "Önceki tanılar", "Ölçüm değerleri"],
        createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 gün önce
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
        createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 gün önce
      },
    ];

    await RiskAssessment.insertMany(riskAssessments);
    console.log(`✅ ${riskAssessments.length} risk değerlendirmesi eklendi`);

    console.log("\n✅ Dummy data başarıyla oluşturuldu!");
    console.log(`\n📋 Hasta Bilgileri:`);
    console.log(`   Email: ${patient.email}`);
    console.log(`\n📊 Oluşturulan Veriler:`);
    console.log(`   - ${measurements.length} ölçüm`);
    console.log(`   - ${diagnoses.length} tanı`);
    console.log(`   - ${riskAssessments.length} risk değerlendirmesi`);
    console.log(`\n💡 İpucu: Belirli bir kullanıcı için veri yüklemek için:`);
    console.log(`   node api/src/scripts/seedDummyData.js email@example.com`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

// Script'i çalıştır
seedDummyData();

