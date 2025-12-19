"use client";

import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FiltersPanel({
  diseasesList = [],
  selectedDisease,
  setSelectedDisease,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedCity,
  setSelectedCity,
  onResetFilters,
  years = [],
  months = [],
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtreler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Hastalık</label>
            <Select
              value={selectedDisease || undefined}
              onValueChange={setSelectedDisease}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                {diseasesList.map((disease) => (
                  <SelectItem key={disease} value={disease}>
                    {disease}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Yıl</label>
            <Select value={selectedYear || undefined} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ay</label>
            <Select
              value={selectedMonth || undefined}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onResetFilters}
              className="w-full"
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>

        {selectedCity && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
            <span className="text-sm">
              <strong>Seçili Şehir:</strong> {selectedCity}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCity(null)}>
              Kaldır
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

