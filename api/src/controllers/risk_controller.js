const RiskAssessment = require("../models/risk_assessment");
const Measurement = require("../models/measurement");
const Diagnosis = require("../models/diagnosis");
const PatientProfile = require("../models/patient_profile");

const { getLatestByType } = require("../utils/risk_helpers");
const { evaluateRules } = require("../services/risk_engine");
const { OpenAI } = require("openai");
const logger = require("../utils/logger");

const generateRisk = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await PatientProfile.findOne({ userId });

    const allMeasurements = await Measurement.find({ userId })
      .sort({ createdAt: -1 })
      .limit(200);

    const diagnoses = await Diagnosis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const measurements = {
      bloodSugar: getLatestByType(allMeasurements, "blood_sugar", 10),
      bloodPressure: getLatestByType(allMeasurements, "blood_pressure", 10),
      oxygen: getLatestByType(allMeasurements, "oxygen", 10),
    };

    const result = evaluateRules({
      profile,
      measurements,
      diagnoses,
    });

    const risk = await RiskAssessment.create({
      userId,
      overallScore: result.finalScore,
      overallLevel: result.level,
      risks: result.risks,
    });

    res.status(200).json({
      success: true,
      risk,
    });
  } catch (err) {
    logger.error("generateRisk:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getRisk = async (req, res) => {
  try {
    const userId = req.user._id;

    const risk = await RiskAssessment.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!risk) {
      return res.json({
        success: true,
        data: {
          score: 0,
          level: "low",
          risks: [],
        },
      });
    }

    res.json({
      success: true,
      data: {
        score: risk.overallScore ?? risk.score ?? 0,
        level: risk.overallLevel ?? risk.level ?? "low",
        risks: risk.risks ?? [],
      },
    });
  } catch (err) {
    logger.error("getMyRisk error:", err);
    res.status(500).json({ success: false, message: "Risk alınamadı" });
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getAiRiskAdvice = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Ölçümler
    const measurements = await Measurement.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    // 🔹 Risk
    const risk = await RiskAssessment.findOne({ userId }).sort({
      createdAt: -1,
    });

    // 🔹 Teşhis
    const diagnosis = await Diagnosis.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (!measurements.length || !risk) {
      return res.json({
        success: true,
        data: {
          advice: "Yeterli veri bulunamadı.",
        },
      });
    }

    // Ölçümleri tip bazında grupla
    const measurementsByType = {};
    measurements.forEach((m) => {
      if (!measurementsByType[m.type]) {
        measurementsByType[m.type] = [];
      }
      measurementsByType[m.type].push({
        value: m.value,
        unit: m.unit,
        date: m.createdAt,
      });
    });

    // Teşhis bilgilerini formatla
    const diagnosisInfo = diagnosis
      ? {
          diseases: diagnosis.diseases?.join(", ") || "Bilinmiyor",
          severity: diagnosis.severity || "medium",
          status: diagnosis.status || "active",
        }
      : null;

    const riskScore = risk.overallScore ?? risk.score ?? 0;
    const riskLevel = risk.overallLevel ?? risk.level ?? "low";

    const prompt = `
Sen bir klinik karar destek sistemisin. Aşağıdaki hasta verilerine göre risk analizi yap.

KURALLAR:
- SADECE JSON formatında cevap ver
- Türkçe kullan
- Kısa ve öz ol
- Tıbbi ama hasta anlayacak şekilde açıkla
- Markdown veya açıklama ekleme, sadece JSON

JSON ŞEMASI (kesinlikle bu formatta):
{
  "title": "string (max 50 karakter)",
  "summary": "string (max 200 karakter, genel durum özeti)",
  "level": "Düşük" | "Orta" | "Yüksek" | "Kritik",
  "warnings": ["string", "string"] (en fazla 5 adet),
  "recommendations": ["string", "string"] (en fazla 6 adet)
}

HASTA VERİLERİ:
Risk Skoru: ${riskScore}%
Risk Seviyesi: ${riskLevel}

Teşhis Bilgileri:
${
  diagnosisInfo
    ? `- Hastalıklar: ${diagnosisInfo.diseases}\n- Şiddet: ${diagnosisInfo.severity}\n- Durum: ${diagnosisInfo.status}`
    : "- Teşhis bilgisi yok"
}

Son Ölçümler (Son ${measurements.length} kayıt):
${Object.entries(measurementsByType)
  .map(
    ([type, values]) =>
      `- ${type}: ${values
        .slice(0, 5)
        .map((v) => `${v.value}${v.unit ? " " + v.unit : ""}`)
        .join(", ")}${values.length > 5 ? "..." : ""}`
  )
  .join("\n")}

Lütfen bu verilere göre JSON formatında risk analizi döndür.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Sen bir klinik karar destek sistemisin.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiText = completion.choices[0].message.content.trim();

    // JSON parse güvenliği - markdown code block'ları temizle
    let cleanedText = aiText;
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\s*/g, "").replace(/```\s*$/g, "");
    }

    let aiResult;
    try {
      aiResult = JSON.parse(cleanedText);
    } catch (parseError) {
      logger.error("AI JSON parse hatası:", parseError, "Raw text:", aiText);
      // Fallback response
      aiResult = {
        title: "Risk Analizi",
        summary: "AI analiz tamamlanamadı, lütfen tekrar deneyin.",
        level:
          riskLevel === "low"
            ? "Düşük"
            : riskLevel === "medium"
            ? "Orta"
            : riskLevel === "high"
            ? "Yüksek"
            : "Kritik",
        warnings: [],
        recommendations: ["Düzenli sağlık kontrollerinizi yaptırın"],
      };
    }

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (err) {
    logger.error("AI risk error:", err);
    res.status(500).json({
      success: false,
      message: "AI analiz hatası",
    });
  }
};

module.exports = { generateRisk, getRisk, getAiRiskAdvice };
