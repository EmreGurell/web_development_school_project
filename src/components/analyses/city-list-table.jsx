"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CityListTable({
  data = [],
  totalCases,
  selectedCity,
  onCityClick,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tüm Şehirler - Detaylı İstatistikler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Sıra</th>
                <th className="text-left p-3 font-semibold">Şehir</th>
                <th className="text-right p-3 font-semibold">Vaka Sayısı</th>
                <th className="text-right p-3 font-semibold">Yüzde</th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort((a, b) => (b.value || 0) - (a.value || 0))
                .map((item, index) => {
                  const percentage =
                    totalCases > 0
                      ? ((item.value || 0) / totalCases) * 100
                      : 0;
                  return (
                    <tr
                      key={index}
                      className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                        selectedCity === item.regionName
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => onCityClick(item.regionName)}
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">
                        {item.regionName || "Bilinmeyen"}
                      </td>
                      <td className="p-3 text-right">
                        {(item.value || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right">
                        {percentage.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

