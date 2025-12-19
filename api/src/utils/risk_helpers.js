function getLatestByType(measurements, type, limit = 10) {
    return measurements
        .filter(m => m.type === type)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
}

function average(values) {
    if (!values.length) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
}

function levelToScore(level) {
    if (level === "high") return 80;
    if (level === "medium") return 50;
    return 20;
}

module.exports = {
    getLatestByType,
    average,
    levelToScore,
};
