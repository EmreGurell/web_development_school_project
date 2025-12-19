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
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
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

export function TopCitiesBarChart({ data = [] }) {
  const chartData = data
    .slice(0, 10)
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .map((item) => ({
      name: item.regionName || "Bilinmeyen",
      value: item.value || 0,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          En Yüksek Vaka Sayısına Sahip 10 Şehir
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center pb-2">
        <div className="w-full max-w-4xl">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
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
                formatter={(value) => [
                  `${value.toLocaleString()} vaka`,
                  "Vaka Sayısı",
                ]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CityDistributionPieChart({ data = [] }) {
  const totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const top5 = data
    .slice()
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 5)
    .map((item) => ({
      name: item.regionName || "Bilinmeyen",
      value: item.value || 0,
      percentage: (((item.value || 0) / totalValue) * 100).toFixed(1),
    }));

  const otherValue =
    totalValue - top5.reduce((sum, item) => sum + item.value, 0);
  if (otherValue > 0) {
    top5.push({
      name: "Diğer",
      value: otherValue,
      percentage: ((otherValue / totalValue) * 100).toFixed(1),
    });
  }

  const renderCustomLabel = ({ name, percentage }) => {
    return `${name}: %${percentage}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Şehir Dağılımı (Top 5)</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center pb-2">
        <div className="w-full max-w-lg">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={top5}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {top5.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value.toLocaleString()} vaka (${
                    props.payload.percentage
                  }%)`,
                  "Değer",
                ]}
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

export function CityStatsLineChart({ data = [] }) {
  const chartData = data
    .slice(0, 15)
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .map((item, index) => ({
      name: item.regionName || "Bilinmeyen",
      value: item.value || 0,
      rank: index + 1,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Şehir İstatistikleri Trendi (Top 15)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center pb-2">
        <div className="w-full max-w-6xl">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
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
                formatter={(value) => [
                  `${value.toLocaleString()} vaka`,
                  "Vaka Sayısı",
                ]}
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
