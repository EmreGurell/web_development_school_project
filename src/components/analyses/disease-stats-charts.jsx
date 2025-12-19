"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
    LineChart,
    Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Pastel renk paleti
const PASTEL_COLORS = [
    "#93c5fd", // pastel mavi
    "#a5b4fc", // pastel mor
    "#c4b5fd", // pastel lavanta
    "#d8b4fe", // pastel pembe
    "#f0abfc", // pastel fuşya
    "#fda4af", // pastel kırmızı
    "#fb7185", // pastel pembe-kırmızı
    "#fbbf24", // pastel sarı
    "#34d399", // pastel yeşil
    "#60a5fa", // pastel mavi
];

export function DiseaseDistributionChart({ data = [] }) {
    const chartData = data
        .slice(0, 10)
        .map((item) => ({
            name: item.disease || "Bilinmeyen",
            value: item.count || 0,
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Hastalık Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
                <div className="w-full max-w-4xl">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                fontSize={12}
                                stroke="#6b7280"
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()} vaka`, "Vaka Sayısı"]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function AgeGroupChart({ data = [] }) {
    const chartData = data.map((item) => ({
        name: item.ageGroup || "Bilinmeyen",
        value: item.count || 0,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Yaş Grubu Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
                <div className="w-full max-w-lg">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()} vaka`, "Vaka Sayısı"]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function GenderChart({ data = [] }) {
    const chartData = data.map((item) => ({
        name: item.gender === "M" ? "Erkek" : item.gender === "F" ? "Kadın" : item.gender || "Bilinmeyen",
        value: item.count || 0,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Cinsiyet Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
                <div className="w-full max-w-lg">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PASTEL_COLORS[index % PASTEL_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()} vaka`, "Vaka Sayısı"]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export function TimeSeriesChart({ data = [] }) {
    const chartData = data.map((item) => ({
        name: `${item.year}/${item.month.toString().padStart(2, "0")}`,
        value: item.count || 0,
        fullDate: `${item.year}-${item.month.toString().padStart(2, "0")}`,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Zaman Serisi Analizi</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
                <div className="w-full max-w-6xl">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval="preserveStartEnd"
                                fontSize={12}
                                stroke="#6b7280"
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                formatter={(value) => [`${value.toLocaleString()} vaka`, "Vaka Sayısı"]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#60a5fa"
                                strokeWidth={3}
                                dot={{ fill: "#93c5fd", r: 5 }}
                                activeDot={{ r: 7, fill: "#3b82f6" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
