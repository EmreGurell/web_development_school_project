"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

// Türkiye'nin 81 ili - tam liste
const turkeyCities = [
  { name: "Adana", altNames: [], coordinates: [35.3213, 36.9914] },
  { name: "Adıyaman", altNames: ["Adiyaman"], coordinates: [38.2742, 37.7636] },
  {
    name: "Afyonkarahisar",
    altNames: ["Afyon"],
    coordinates: [30.5433, 38.7636],
  },
  { name: "Ağrı", altNames: ["Agri"], coordinates: [43.0514, 39.7194] },
  { name: "Amasya", altNames: [], coordinates: [35.8331, 40.6536] },
  { name: "Ankara", altNames: [], coordinates: [32.8597, 39.9334] },
  { name: "Antalya", altNames: [], coordinates: [30.7133, 36.8969] },
  { name: "Artvin", altNames: [], coordinates: [41.8181, 41.1825] },
  { name: "Aydın", altNames: ["Aydin"], coordinates: [27.8453, 37.8514] },
  {
    name: "Balıkesir",
    altNames: ["Balikesir"],
    coordinates: [27.8825, 39.6483],
  },
  { name: "Bilecik", altNames: [], coordinates: [30.1417, 40.1425] },
  { name: "Bingöl", altNames: ["Bingol"], coordinates: [40.4975, 38.8847] },
  { name: "Bitlis", altNames: [], coordinates: [42.1078, 38.4011] },
  { name: "Bolu", altNames: [], coordinates: [31.6078, 40.7356] },
  { name: "Burdur", altNames: [], coordinates: [30.2906, 37.7203] },
  { name: "Bursa", altNames: [], coordinates: [29.0588, 40.1826] },
  {
    name: "Çanakkale",
    altNames: ["Canakkale"],
    coordinates: [26.4069, 40.1556],
  },
  { name: "Çankırı", altNames: ["Cankiri"], coordinates: [33.6156, 40.6014] },
  { name: "Çorum", altNames: ["Corum"], coordinates: [34.9531, 40.5489] },
  { name: "Denizli", altNames: [], coordinates: [29.085, 37.7765] },
  {
    name: "Diyarbakır",
    altNames: ["Diyarbakir"],
    coordinates: [40.231, 37.9144],
  },
  { name: "Edirne", altNames: [], coordinates: [26.5556, 41.6772] },
  { name: "Elazığ", altNames: ["Elazig"], coordinates: [39.2193, 38.6756] },
  { name: "Erzincan", altNames: [], coordinates: [39.4967, 39.75] },
  { name: "Erzurum", altNames: [], coordinates: [41.2702, 39.9042] },
  {
    name: "Eskişehir",
    altNames: ["Eskisehir"],
    coordinates: [30.515, 39.7767],
  },
  { name: "Gaziantep", altNames: [], coordinates: [37.3826, 37.0662] },
  { name: "Giresun", altNames: [], coordinates: [38.3928, 40.9128] },
  {
    name: "Gümüşhane",
    altNames: ["Gumushane"],
    coordinates: [39.4833, 40.4589],
  },
  { name: "Hakkari", altNames: [], coordinates: [43.7381, 37.5744] },
  { name: "Hatay", altNames: [], coordinates: [36.2167, 36.2] },
  { name: "Isparta", altNames: [], coordinates: [30.5569, 37.7667] },
  { name: "İçel", altNames: ["Mersin", "Icel"], coordinates: [34.6415, 36.8] },
  { name: "İstanbul", altNames: ["Istanbul"], coordinates: [28.9744, 41.0082] },
  { name: "İzmir", altNames: ["Izmir"], coordinates: [27.1428, 38.4237] },
  { name: "Kars", altNames: [], coordinates: [43.0953, 40.6081] },
  { name: "Kastamonu", altNames: [], coordinates: [33.7753, 41.3781] },
  { name: "Kayseri", altNames: [], coordinates: [35.4876, 38.7312] },
  {
    name: "Kırklareli",
    altNames: ["Kirklareli"],
    coordinates: [27.2244, 41.7378],
  },
  { name: "Kırşehir", altNames: ["Kirsehir"], coordinates: [34.1628, 39.1467] },
  { name: "Kocaeli", altNames: [], coordinates: [29.9167, 40.7667] },
  { name: "Konya", altNames: [], coordinates: [32.4846, 37.8746] },
  { name: "Kütahya", altNames: ["Kutahya"], coordinates: [29.9792, 39.4197] },
  { name: "Malatya", altNames: [], coordinates: [38.3097, 38.3552] },
  { name: "Manisa", altNames: [], coordinates: [27.4264, 38.6197] },
  {
    name: "Kahramanmaraş",
    altNames: ["Kahramanmaras", "Maraş", "Maras"],
    coordinates: [36.9375, 37.5858],
  },
  { name: "Mardin", altNames: [], coordinates: [40.7375, 37.3131] },
  { name: "Muğla", altNames: ["Mugla"], coordinates: [28.3639, 37.2153] },
  { name: "Muş", altNames: ["Mus"], coordinates: [41.4928, 38.7453] },
  { name: "Nevşehir", altNames: ["Nevsehir"], coordinates: [34.7236, 38.6244] },
  { name: "Niğde", altNames: ["Nigde"], coordinates: [34.6781, 37.9658] },
  { name: "Ordu", altNames: [], coordinates: [37.8764, 40.9839] },
  { name: "Rize", altNames: [], coordinates: [40.5219, 41.0208] },
  { name: "Sakarya", altNames: [], coordinates: [30.3883, 40.7767] },
  { name: "Samsun", altNames: [], coordinates: [36.33, 41.2867] },
  { name: "Siirt", altNames: [], coordinates: [41.9408, 37.9294] },
  { name: "Sinop", altNames: [], coordinates: [35.1511, 42.0231] },
  { name: "Sivas", altNames: [], coordinates: [37.035, 39.7472] },
  { name: "Tekirdağ", altNames: ["Tekirdag"], coordinates: [27.5114, 40.9833] },
  { name: "Tokat", altNames: [], coordinates: [36.5542, 40.3139] },
  { name: "Trabzon", altNames: [], coordinates: [39.7167, 41.0015] },
  { name: "Tunceli", altNames: [], coordinates: [39.5447, 39.1083] },
  {
    name: "Şanlıurfa",
    altNames: ["Sanliurfa", "Urfa"],
    coordinates: [38.7955, 37.1674],
  },
  { name: "Uşak", altNames: ["Usak"], coordinates: [29.4081, 38.6739] },
  { name: "Van", altNames: [], coordinates: [43.3833, 38.4891] },
  { name: "Yozgat", altNames: [], coordinates: [34.8014, 39.8217] },
  { name: "Zonguldak", altNames: [], coordinates: [31.7931, 41.4514] },
  { name: "Aksaray", altNames: [], coordinates: [34.025, 38.3689] },
  { name: "Bayburt", altNames: [], coordinates: [40.2278, 40.255] },
  { name: "Karaman", altNames: [], coordinates: [33.2153, 37.1811] },
  {
    name: "Kırıkkale",
    altNames: ["Kirikkale"],
    coordinates: [33.5083, 39.8453],
  },
  { name: "Batman", altNames: [], coordinates: [41.13, 37.8874] },
  { name: "Şırnak", altNames: ["Sirnak"], coordinates: [42.4631, 37.5181] },
  { name: "Bartın", altNames: ["Bartin"], coordinates: [32.3378, 41.6342] },
  { name: "Ardahan", altNames: [], coordinates: [42.7022, 41.1106] },
  { name: "Iğdır", altNames: ["Igdir"], coordinates: [43.9981, 39.9167] },
  { name: "Yalova", altNames: [], coordinates: [29.2764, 40.655] },
  { name: "Karabük", altNames: ["Karabuk"], coordinates: [32.6231, 41.2064] },
  { name: "Kilis", altNames: [], coordinates: [37.1125, 36.7164] },
  { name: "Osmaniye", altNames: [], coordinates: [36.2475, 37.0742] },
  { name: "Düzce", altNames: ["Duzce"], coordinates: [31.1606, 40.8389] },
];

// Türkiye sınırları için basit SVG path (basitleştirilmiş)
const turkeySVGPath =
  "M 25 20 L 30 18 L 35 15 L 40 12 L 45 10 L 50 12 L 55 15 L 58 20 L 60 25 L 62 30 L 63 35 L 62 40 L 60 45 L 58 48 L 55 50 L 50 52 L 45 53 L 40 52 L 35 50 L 30 48 L 28 45 L 25 40 L 23 35 L 22 30 L 23 25 Z";

export default function TurkeyMap({
  cityData = [],
  selectedCity,
  onCityClick,
}) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [geoData, setGeoData] = useState(null);

  // Şehir isimlerini normalize et - daha esnek eşleştirme
  const normalizeCityName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .trim()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/İ/g, "i")
      .replace(/Ğ/g, "g")
      .replace(/Ü/g, "u")
      .replace(/Ş/g, "s")
      .replace(/Ö/g, "o")
      .replace(/Ç/g, "c");
  };

  // Şehir verilerini haritaya göre eşleştir - esnek eşleştirme
  const getCityValue = (cityName, altNames = []) => {
    if (!cityName) return 0;
    const normalizedMapName = normalizeCityName(cityName);

    // Önce tam eşleşme
    let found = cityData.find(
      (item) => normalizeCityName(item.regionName) === normalizedMapName
    );

    if (found) return found.value || 0;

    // Sonra alternatif isimlerle dene
    for (const altName of altNames) {
      found = cityData.find(
        (item) =>
          normalizeCityName(item.regionName) === normalizeCityName(altName)
      );
      if (found) return found.value || 0;
    }

    // Son olarak içerik eşleştirme (kısmi eşleşme)
    found = cityData.find((item) => {
      const normalizedItem = normalizeCityName(item.regionName);
      return (
        normalizedItem.includes(normalizedMapName) ||
        normalizedMapName.includes(normalizedItem)
      );
    });

    return found?.value || 0;
  };

  const getColor = (value, maxValue) => {
    if (!value || value === 0) return "#d1d5db"; // açık gri
    const ratio = value / maxValue;
    if (ratio > 0.8) return "#dc2626"; // koyu kırmızı
    if (ratio > 0.6) return "#ef4444"; // kırmızı
    if (ratio > 0.4) return "#f87171"; // açık kırmızı
    if (ratio > 0.2) return "#fca5a5"; // daha açık kırmızı
    return "#fecaca"; // en açık kırmızı
  };

  const maxValue = Math.max(...cityData.map((d) => d.value || 0), 1);

  // Basit Türkiye sınırları SVG - arka plan için
  useEffect(() => {
    // Türkiye sınırlarını gösteren basit bir SVG oluştur
    setGeoData(null);
  }, []);

  return (
    <div className="w-full h-[600px] relative border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Türkiye sınırları için basit arka plan SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="20 10 45 45"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M 22 25 Q 25 20 30 18 Q 35 15 40 12 Q 45 10 50 12 Q 55 15 58 18 Q 60 20 62 25 Q 63 30 62 35 Q 60 40 58 43 Q 55 45 50 47 Q 45 48 40 47 Q 35 45 30 43 Q 25 40 23 35 Q 22 30 22 25 Z"
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth="0.5"
        />
      </svg>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [35, 39],
          scale: 2500,
        }}
        width={800}
        height={600}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Şehir marker'ları - Tüm 81 il */}
        {turkeyCities.map((city, index) => {
          const value = getCityValue(city.name, city.altNames);
          const isSelected =
            normalizeCityName(selectedCity) === normalizeCityName(city.name);
          const baseRadius = 4;
          const radius =
            value > 0
              ? Math.max(
                  baseRadius,
                  Math.min(16, baseRadius + (value / maxValue) * 12)
                )
              : baseRadius;

          return (
            <Marker
              key={`${city.name}-${index}`}
              coordinates={city.coordinates}
              onMouseEnter={() => {
                setTooltipContent(
                  `${city.name}: ${value.toLocaleString()} vaka`
                );
              }}
              onMouseLeave={() => {
                setTooltipContent("");
              }}
              onClick={() => {
                if (onCityClick) onCityClick(city.name);
              }}
            >
              <circle
                r={radius}
                fill={getColor(value, maxValue)}
                fillOpacity={value > 0 ? 0.9 : 0.6}
                stroke={
                  isSelected ? "#1f2937" : value > 0 ? "#ffffff" : "#9ca3af"
                }
                strokeWidth={isSelected ? 3.5 : value > 0 ? 2.5 : 1.5}
                style={{ cursor: "pointer" }}
              />
              {isSelected && (
                <circle
                  r={radius + 6}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                />
              )}
              {/* Vaka sayısını göster */}
              {value > 0 && (
                <text
                  textAnchor="middle"
                  y={radius + 20}
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "10px",
                    fill: "#1f2937",
                    fontWeight: "700",
                    pointerEvents: "none",
                    textShadow: "0 0 3px rgba(255,255,255,0.8)",
                  }}
                >
                  {value.toLocaleString()}
                </text>
              )}
              {/* Şehir ismi */}
              {value === 0 && (
                <text
                  textAnchor="middle"
                  y={radius + 15}
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "9px",
                    fill: "#6b7280",
                    fontWeight: "500",
                    pointerEvents: "none",
                  }}
                >
                  {city.name.length > 8
                    ? city.name.substring(0, 6) + ".."
                    : city.name}
                </text>
              )}
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border-2 border-blue-200 dark:border-blue-800 z-10">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {tooltipContent}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700 z-10">
        <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
          Vaka Sayısı (81 İl)
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1 items-center">
            <div className="w-10 h-5 bg-gray-300 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">0</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-10 h-5 bg-red-300 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Düşük
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-10 h-5 bg-red-400 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Orta
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-10 h-5 bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Yüksek
            </span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="w-10 h-5 bg-red-600 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Çok Yüksek
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
          Şehir üzerine tıklayarak filtreleyin
        </p>
      </div>
    </div>
  );
}
