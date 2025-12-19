"use client";

import { Activity, MapPin, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards({
  totalCases,
  totalCities,
  topCityName,
  topCityValue,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Vaka</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCases.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Tüm şehirler toplamı</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Şehir Sayısı</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCities}</div>
          <p className="text-xs text-muted-foreground">Veri bulunan şehir</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ortalama Vaka</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalCities > 0
              ? Math.round(totalCases / totalCities).toLocaleString()
              : 0}
          </div>
          <p className="text-xs text-muted-foreground">Şehir başına ortalama</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En Yüksek Şehir</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topCityName || "-"}</div>
          <p className="text-xs text-muted-foreground">
            {topCityValue ? `${topCityValue.toLocaleString()} vaka` : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

