"use client";

import React, { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TurkeyMap from "@/components/analyses/turkey-map";
import {
  TopCitiesBarChart,
  CityDistributionPieChart,
  CityStatsLineChart,
} from "@/components/analyses/city-stats-charts";
import {
  DiseaseDistributionChart,
  AgeGroupChart,
  GenderChart,
  TimeSeriesChart,
} from "@/components/analyses/disease-stats-charts";
import { AnalysesSkeleton } from "@/components/analyses/analyses-skeleton";
import { AnalysesError } from "@/components/analyses/analyses-error";
import { StatsCards } from "@/components/analyses/stats-cards";
import { FiltersPanel } from "@/components/analyses/filters-panel";
import { CityListTable } from "@/components/analyses/city-list-table";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function AnalysesPage() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [cityStats, setCityStats] = useState([]);
  const [diseaseStats, setDiseaseStats] = useState([]);
  const [ageGroupStats, setAgeGroupStats] = useState([]);
  const [genderStats, setGenderStats] = useState([]);
  const [timeSeriesStats, setTimeSeriesStats] = useState([]);
  const [diseasesList, setDiseasesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Filtreler
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [totalCases, setTotalCases] = useState(0);
  const [totalCities, setTotalCities] = useState(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: "1", label: "Ocak" },
    { value: "2", label: "Şubat" },
    { value: "3", label: "Mart" },
    { value: "4", label: "Nisan" },
    { value: "5", label: "Mayıs" },
    { value: "6", label: "Haziran" },
    { value: "7", label: "Temmuz" },
    { value: "8", label: "Ağustos" },
    { value: "9", label: "Eylül" },
    { value: "10", label: "Ekim" },
    { value: "11", label: "Kasım" },
    { value: "12", label: "Aralık" },
  ];

  useEffect(() => {
    fetchAllData();
  }, [selectedDisease, selectedYear, selectedMonth, selectedCity]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query parametreleri
      const params = new URLSearchParams();
      if (selectedDisease) params.append("disease", selectedDisease);
      if (selectedYear) params.append("year", selectedYear);
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedCity) params.append("regionName", selectedCity);

      const queryString = params.toString() ? `?${params.toString()}` : "";

      // Tüm hastalıkları al
      const diseasesRes = await fetch(`${API_URL}stats/diseases-list`, {
        credentials: "include",
      });
      const diseasesJson = await diseasesRes.json();
      if (diseasesJson.success && diseasesJson.data) {
        setDiseasesList(diseasesJson.data);
      }

      // Heatmap verilerini al
      const heatmapRes = await fetch(`${API_URL}stats/heatmap${queryString}`, {
        credentials: "include",
      });
      const heatmapJson = await heatmapRes.json();

      if (heatmapJson.success && heatmapJson.data) {
        setHeatmapData(heatmapJson.data);
        const total = heatmapJson.data.reduce(
          (sum, item) => sum + (item.value || 0),
          0
        );
        setTotalCases(total);
        setTotalCities(heatmapJson.data.length);
      }

      // Şehir istatistiklerini al
      const cityRes = await fetch(`${API_URL}stats/city${queryString}`, {
        credentials: "include",
      });
      const cityJson = await cityRes.json();

      if (cityJson.success && cityJson.data) {
        setCityStats(cityJson.data);
      }

      // Hastalık istatistiklerini al
      const diseaseRes = await fetch(`${API_URL}stats/diseases${queryString}`, {
        credentials: "include",
      });
      const diseaseJson = await diseaseRes.json();

      if (diseaseJson.success && diseaseJson.data) {
        setDiseaseStats(diseaseJson.data);
      }

      // Yaş grubu istatistiklerini al
      const ageRes = await fetch(`${API_URL}stats/age-groups${queryString}`, {
        credentials: "include",
      });
      const ageJson = await ageRes.json();

      if (ageJson.success && ageJson.data) {
        setAgeGroupStats(ageJson.data);
      }

      // Cinsiyet istatistiklerini al
      const genderRes = await fetch(`${API_URL}stats/genders${queryString}`, {
        credentials: "include",
      });
      const genderJson = await genderRes.json();

      if (genderJson.success && genderJson.data) {
        setGenderStats(genderJson.data);
      }

      // Zaman serisi istatistiklerini al
      const timeSeriesRes = await fetch(
        `${API_URL}stats/time-series${queryString}`,
        {
          credentials: "include",
        }
      );
      const timeSeriesJson = await timeSeriesRes.json();

      if (timeSeriesJson.success && timeSeriesJson.data) {
        setTimeSeriesStats(timeSeriesJson.data);
      }
    } catch (err) {
      console.error("Analyses fetch error:", err);
      setError(
        "Veriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName === selectedCity ? null : cityName);
  };

  const handleResetFilters = () => {
    setSelectedDisease(null);
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedCity(null);
  };

  // Top city bilgisi
  const topCity =
    heatmapData.length > 0
      ? heatmapData.sort((a, b) => (b.value || 0) - (a.value || 0))[0]
      : null;

  if (loading && !heatmapData.length) {
    return <AnalysesSkeleton />;
  }

  if (error) {
    return <AnalysesError error={error} />;
  }

  return (
    <section className="pt-28 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              Ülke İstatistikleri
            </h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Globe2 /> Türkiye geneli şehir bazlı sağlık istatistikleri ve
              analiz paneli
            </p>
          </div>
        </div>

        {/* Filtreler */}
        <FiltersPanel
          diseasesList={diseasesList}
          selectedDisease={selectedDisease}
          setSelectedDisease={setSelectedDisease}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onResetFilters={handleResetFilters}
          years={years}
          months={months}
        />

        {/* İstatistik Kartları */}
        <StatsCards
          totalCases={totalCases}
          totalCities={totalCities}
          topCityName={topCity?.regionName}
          topCityValue={topCity?.value}
        />

        {/* Türkiye Haritası */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Türkiye Haritası - Şehir Bazlı İstatistikler</CardTitle>
            {selectedCity && (
              <p className="text-sm text-muted-foreground mt-2">
                Seçili Şehir: <strong>{selectedCity}</strong>
              </p>
            )}
          </CardHeader>
          <CardContent>
            <TurkeyMap
              cityData={heatmapData}
              selectedCity={selectedCity}
              onCityClick={handleCityClick}
            />
          </CardContent>
        </Card>

        {/* Hastalık ve Demografik İstatistikler */}
        {diseaseStats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DiseaseDistributionChart data={diseaseStats} />
            <div className="grid grid-cols-1 gap-6">
              {ageGroupStats.length > 0 && (
                <AgeGroupChart data={ageGroupStats} />
              )}
              {genderStats.length > 0 && <GenderChart data={genderStats} />}
            </div>
          </div>
        )}

        {/* Zaman Serisi */}
        {timeSeriesStats.length > 0 && (
          <div className="mb-8">
            <TimeSeriesChart data={timeSeriesStats} />
          </div>
        )}

        {/* Şehir Chartları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCitiesBarChart data={heatmapData} />
          <CityDistributionPieChart data={heatmapData} />
        </div>

        <div className="mb-8">
          <CityStatsLineChart data={heatmapData} />
        </div>

        {/* Şehir Listesi Tablosu */}
        <CityListTable
          data={heatmapData}
          totalCases={totalCases}
          selectedCity={selectedCity}
          onCityClick={handleCityClick}
        />
      </div>
    </section>
  );
}

export default AnalysesPage;
