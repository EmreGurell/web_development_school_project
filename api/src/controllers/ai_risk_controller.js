const OpenAI = require("openai");
const logger = require("../utils/logger");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeRisk = async (req, res) => {
    try {
        const {
            measurements,
            riskScore
        } = req.body;

        if (!measurements || riskScore == null) {
            return res.status(400).json({
                success: false,
                message: "Eksik veri",
            });
        }


        const prompt = `
You are a medical assistant AI.

Patient measurements:
${measurements.map(m => `- ${m.name}: ${m.value}`).join("\n")}

Calculated risk score: ${riskScore}%

Return STRICT JSON format:
{
  "riskLevel": "Low | Medium | High",
  "summary": "short explanation",
  "recommendations": ["item1", "item2", "item3"]
}
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional healthcare AI." },
                { role: "user", content: prompt },
            ],
            temperature: 0.4,
        });

        const content = completion.choices[0].message.content;

        // ⚠️ JSON PARSE GÜVENLİĞİ
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch {
            return res.status(500).json({
                success: false,
                message: "AI format error",
                raw: content,
            });
        }

        return res.status(200).json({
            success: true,
            ai: parsed,
        });

    } catch (err) {
        logger.error("AI Risk Error:", err);
        return res.status(500).json({
            success: false,
            message: "AI servis hatası",
        });
    }
};
