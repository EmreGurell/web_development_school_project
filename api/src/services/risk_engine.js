const { average, levelToScore } = require("../utils/risk_helpers");

function evaluateRules({ profile, measurements, diagnoses }) {
    const risks = [];

    /* ---------------- BLOOD SUGAR ---------------- */
    if (measurements.bloodSugar.length) {
        const latest = measurements.bloodSugar[0];
        const avg = average(measurements.bloodSugar.map(m => m.value));

        if (latest.value >= 180 || avg >= 160) {
            risks.push({
                disease: "Diabetes",
                level: "high",
                score: 85,
                reason: `Blood sugar high (latest ${latest.value}, avg ${avg.toFixed(1)})`,
                suggestions: [
                    "Consult endocrinologist",
                    "Dietary control",
                    "HbA1c test"
                ],
                source: "rule-based"
            });
        } else if (latest.value >= 140) {
            risks.push({
                disease: "Diabetes (screening)",
                level: "medium",
                score: 55,
                reason: `Elevated blood sugar (${latest.value})`,
                suggestions: [
                    "Lifestyle changes",
                    "Repeat measurement"
                ],
                source: "rule-based"
            });
        }
    }

    /* ---------------- BLOOD PRESSURE ---------------- */
    if (measurements.bloodPressure.length) {
        const latest = measurements.bloodPressure[0];
        const { systolic, diastolic } = latest.value || {};

        if (systolic >= 140 || diastolic >= 90) {
            risks.push({
                disease: "Hypertension",
                level: "high",
                score: 80,
                reason: `BP ${systolic}/${diastolic}`,
                suggestions: [
                    "Salt restriction",
                    "Regular BP monitoring",
                    "Cardiology follow-up"
                ],
                source: "rule-based"
            });
        }
    }

    /* ---------------- OXYGEN ---------------- */
    if (measurements.oxygen.length) {
        const latest = measurements.oxygen[0];
        if (latest.value < 92) {
            risks.push({
                disease: "Respiratory Risk",
                level: "high",
                score: 90,
                reason: `SpO2 ${latest.value}%`,
                suggestions: [
                    "Immediate medical evaluation",
                    "Oxygen level monitoring"
                ],
                source: "rule-based"
            });
        }
    }

    /* ---------------- DIAGNOSES EFFECT ---------------- */
    diagnoses.forEach(d => {
        (d.diseases || []).forEach(dx => {
            risks.push({
                disease: dx,
                level: "medium",
                score: levelToScore("medium"),
                reason: "Existing diagnosis",
                suggestions: [
                    "Follow prescribed treatment",
                    "Regular doctor follow-up"
                ],
                source: "doctor"
            });
        });
    });

    /* ---------------- FALLBACK ---------------- */
    if (!risks.length) {
        risks.push({
            disease: "General Health",
            level: "low",
            score: 20,
            reason: "No alarming findings",
            suggestions: [
                "Maintain healthy lifestyle",
                "Routine checkups"
            ],
            source: "rule-based"
        });
    }

    /* ---------------- FINAL SCORE ---------------- */
    const finalScore = Math.max(...risks.map(r => r.score));

    return {
        finalScore,
        level:
            finalScore >= 75 ? "high" :
                finalScore >= 45 ? "medium" :
                    "low",
        risks
    };
}

module.exports = { evaluateRules };
