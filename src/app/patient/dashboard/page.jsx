"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DropdownButton from "@/components/ui/dropdown_button";
import { EmptyState } from "@/components/empty-state";
import { Plus, Activity, FileText, TrendingUp, AlertTriangle, Database, Calendar } from "lucide-react";
import { getUserFromToken } from "@/lib/utils/auth";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    BarChart,
    Bar,
    Cell,
} from "recharts";

export default function PatientDashboard() {
    const router = useRouter();
    const [chartData, setChartData] = useState([]);
    const [miniBar, setMiniBar] = useState([]);
    const [lastDiagnosis, setLastDiagnosis] = useState(null);
    const [totalMeasurements, setTotalMeasurements] = useState(0);
    const [lastMeasurementDate, setLastMeasurementDate] = useState(null);
    const [riskValue, setRiskValue] = useState(null); // null = henüz oluşturulmamış
    const [aiAdvice, setAiAdvice] = useState({
        title: "",
        summary: "",
        level: "",
        warnings: [],
        recommendations: [],
    });

    // Her bir veri kaynağı için ayrı loading ve error state
    const [loading, setLoading] = useState({
        measurements: true,
        diagnosis: true,
        risk: true,
        ai: true,
    });
    const [errors, setErrors] = useState({
        measurements: null,
        diagnosis: null,
        risk: null,
        ai: null,
    });

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    useEffect(() => {
        if (!token) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        // Her fetch'i bağımsız olarak başlat - progressive loading için
        // Ölçümler
        (async () => {
            try {
                setLoading(prev => ({ ...prev, measurements: true }));
                const res = await fetch(`${API_URL}measurements/last/30`, { headers });
                const data = await res.json();
                
                if (data.success) {
                    const formatted = data.data.map(m => {
                        let glucose = null;
                        let heartRate = null;
                        
                        if (m.type === 'blood_sugar' || m.type === 'glucose' || m.type === 'şeker' || m.type === 'Kan Şekeri') {
                            glucose = typeof m.value === 'number' ? m.value : parseFloat(m.value) || null;
                        }
                        if (m.type === 'heart_rate' || m.type === 'nabız' || m.type === 'pulse' || m.type === 'Nabız') {
                            heartRate = typeof m.value === 'number' ? m.value : parseFloat(m.value) || null;
                        }

                        return {
                            day: new Date(m.createdAt).getDate(),
                            glucose,
                            heart: heartRate,
                            createdAt: m.createdAt,
                        };
                    });

                    setChartData(formatted);
                    setMiniBar(Array.isArray(data.monthlyStats) ? data.monthlyStats : []);
                    setTotalMeasurements(data.data.length);
                    if (data.data.length > 0) {
                        const lastDate = new Date(data.data[0].createdAt);
                        setLastMeasurementDate(lastDate);
                    }
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, measurements: err }));
            } finally {
                setLoading(prev => ({ ...prev, measurements: false }));
            }
        })();

        // Son Teşhis
        (async () => {
            try {
                setLoading(prev => ({ ...prev, diagnosis: true }));
                const res = await fetch(`${API_URL}diagnosis/last`, { headers });
                const data = await res.json();
                
                if (data.success) {
                    setLastDiagnosis(data.data);
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, diagnosis: err }));
            } finally {
                setLoading(prev => ({ ...prev, diagnosis: false }));
            }
        })();

        // Risk
        (async () => {
            try {
                setLoading(prev => ({ ...prev, risk: true }));
                const res = await fetch(`${API_URL}risk/me`, { headers });
                const data = await res.json();
                
                if (data.success && data.data?.overallScore !== undefined && data.data?.overallScore !== null) {
                    setRiskValue(data.data.overallScore || data.data.score);
                    
                    // Risk varsa AI tavsiyesini de çek
                    (async () => {
                        try {
                            setLoading(prev => ({ ...prev, ai: true }));
                            const aiRes = await fetch(`${API_URL}risk/ai/me`, { headers });
                            const aiData = await aiRes.json();
                            
                            if (aiData.success && aiData.data) {
                                setAiAdvice({
                                    title: aiData.data.title || "AI Risk Analizi",
                                    summary: aiData.data.summary || "Genel değerlendirme.",
                                    level: aiData.data.level || "Orta",
                                    warnings: Array.isArray(aiData.data.warnings)
                                        ? aiData.data.warnings
                                        : [],
                                    recommendations: Array.isArray(aiData.data.recommendations)
                                        ? aiData.data.recommendations
                                        : [],
                                });
                            }
                        } catch (err) {
                            // AI hatası kritik değil, ignore
                        } finally {
                            setLoading(prev => ({ ...prev, ai: false }));
                        }
                    })();
                } else {
                    setRiskValue(null);
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, risk: err }));
            } finally {
                setLoading(prev => ({ ...prev, risk: false }));
            }
        })();
    }, [token]);

    const handleGenerateRisk = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const token = localStorage.getItem("token");
            const user = getUserFromToken();
            
            if (!user?.id) {
                console.error('Kullanıcı bilgisi bulunamadı');
                return;
            }
            
            const res = await fetch(`${API_URL}risk/generate/${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                router.push('/patient/risk');
                router.refresh(); // Sayfayı yenile
            }
        } catch (error) {
            console.error('Risk oluşturma hatası:', error);
        }
    };

    // Artık tüm veriler yüklenene kadar beklemiyoruz, progressive loading kullanıyoruz

    // RadialBarChart için data: riskValue 0-100 arası
    // Chart'ın max değerini 100 olarak ayarlamak için iki değer ekliyoruz
    // Max değerini Cell ile görünmez yapacağız
    const radialData = riskValue !== null ? [
        { name: "Risk", value: riskValue },
        { name: "Max", value: 100 }, // Max değeri belirtmek için
    ] : [];

    const hasDiagnosis = lastDiagnosis && lastDiagnosis.name && lastDiagnosis.name !== "Teşhis yok";
    const hasMeasurements = chartData.length > 0;
    const hasMonthlyStats = miniBar.length > 0 && miniBar.some(b => (b.value || 0) > 0);
    const hasRisk = riskValue !== null;

    return (
        <div className="w-full p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* --- ÜST SATIR --- */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SOL TARAF - Alt Alta İki Kart (Aynı Yükseklikte) */}
                    <div className="space-y-6">
                        {/* --- SON TEŞHİS --- */}
                        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 min-h-[180px] flex flex-col">
                            <CardHeader className="flex justify-between items-center pb-2">
                                <div className="flex space-x-2 items-center">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-gray-800 dark:text-gray-200 text-base font-semibold">
                                        Son Teşhis Bilgisi
                                    </CardTitle>
                                </div>
                                <DropdownButton
                                    options={[{ label: "Görüntüle" }]}
                                />
                            </CardHeader>

                            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
                                {loading.diagnosis ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : errors.diagnosis ? (
                                    <div className="text-sm text-red-600">Teşhis bilgisi yüklenemedi</div>
                                ) : hasDiagnosis ? (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {lastDiagnosis.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                                                {lastDiagnosis.type || "Genel"}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {lastDiagnosis && new Date(lastDiagnosis.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                                            {lastDiagnosis.doctorName || "—"}
                                        </p>
                                    </div>
                                ) : (
                                    <EmptyState
                                        type="diagnosis"
                                        title="Henüz teşhis bilgisi yok"
                                        description="Doktorunuz tarafından eklenen teşhis bilgileriniz burada görünecektir."
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* --- SON ZİYARET --- */}
                        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 min-h-[180px] flex flex-col">
                            <CardHeader className="flex justify-between items-center pb-2">
                                <div className="flex space-x-2 items-center">
                                    <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                        <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <CardTitle className="text-gray-800 dark:text-gray-200 text-base font-semibold">
                                        Son Ziyaret Edilen Doktor
                                    </CardTitle>
                                </div>
                                <DropdownButton options={[{ label: "Görüntüle" }]} />
                            </CardHeader>

                            <CardContent className="pt-0 flex-1 flex flex-col justify-center">
                                {lastDiagnosis?.doctorName ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {lastDiagnosis.doctorName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {lastDiagnosis && new Date(lastDiagnosis.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                ) : (
                                    <EmptyState
                                        type="doctor"
                                        title="Henüz ziyaret kaydı yok"
                                        description="Doktor ziyaretleriniz burada görünecektir."
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* SAĞ TARAF - Yeni Ölçüm İstatistikleri Kartı */}
                    <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="flex justify-between items-center pb-3">
                            <div className="flex space-x-3 items-center">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                                    Ölçüm İstatistikleri
                                </CardTitle>
                            </div>
                            <DropdownButton options={[{ label: "Detaylar" }]} />
                        </CardHeader>

                        <CardContent>
                            {errors.measurements ? (
                                <div className="text-sm text-red-600">Ölçüm bilgileri yüklenemedi</div>
                            ) : totalMeasurements > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Son 30 Gün</p>
                                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                {totalMeasurements}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ölçüm Kaydı</p>
                                        </div>
                                        <Database className="h-12 w-12 text-green-300 dark:text-green-700 opacity-50" />
                                    </div>

                                    {lastMeasurementDate && (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Son Ölçüm</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {lastMeasurementDate.toLocaleDateString('tr-TR', { 
                                                        day: 'numeric', 
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyState
                                    type="measurement"
                                    title="Henüz ölçüm verisi yok"
                                    description="Ölçümleriniz eklendikçe istatistikler burada görünecektir."
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- ALT SATIR --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* TREND */}
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                            Son 30 Günlük Ölçüm Trendleri
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="h-[300px]">
                        {loading.measurements ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            </div>
                        ) : errors.measurements ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-red-600">Grafik verileri yüklenemedi</p>
                            </div>
                        ) : hasMeasurements ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="day" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="glucose" 
                                        stroke="#60a5fa" 
                                        strokeWidth={2}
                                        name="Glukoz"
                                        dot={{ r: 4 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="heart" 
                                        stroke="#fb7185" 
                                        strokeWidth={2}
                                        name="Nabız"
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState
                                type="measurement"
                                title="Ölçüm verisi bulunamadı"
                                description="Son 30 güne ait ölçümleriniz burada görünecektir."
                            />
                        )}
                    </CardContent>
                </Card>

                {/* RİSK */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-red-200 dark:bg-red-900/40">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-red-800 dark:text-red-300 text-lg font-semibold">
                                Risk Raporu
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center">
                        {hasRisk ? (
                            <>
                                {/* Chart with centered text */}
                                <div className="w-48 h-48 mb-4 relative flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadialBarChart
                                            innerRadius="60%"
                                            outerRadius="100%"
                                            data={radialData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar 
                                                dataKey="value" 
                                                cornerRadius={4}
                                            >
                                                {radialData.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={entry.name === "Risk" ? "#f87171" : "transparent"}
                                                    />
                                                ))}
                                            </RadialBar>
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                    {/* Centered text overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                                            {riskValue}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            / 100
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl p-4 w-full shadow-sm">
                                    {loading.ai ? (
                                        <div className="flex items-center justify-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                        </div>
                                    ) : errors.ai ? (
                                        <p className="text-sm text-red-600">AI analizi yüklenemedi</p>
                                    ) : (
                                        <>
                                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                                                {aiAdvice.title || "Risk Analizi"}
                                            </h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                {aiAdvice.summary || "Değerlendirme yapılıyor..."}
                                            </p>
                                            {aiAdvice.warnings.length > 0 && (
                                                <ul className="list-disc ml-5 mt-3 text-sm text-red-700 dark:text-red-400 space-y-1">
                                                    {aiAdvice.warnings.map((w, i) => (
                                                        <li key={i}>{w}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {aiAdvice.recommendations.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                                                    <strong className="text-sm text-gray-800 dark:text-gray-200">Öneriler:</strong>
                                                    <ul className="list-disc ml-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                                                        {aiAdvice.recommendations.map((r, i) => (
                                                            <li key={i}>{r}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                type="risk"
                                title="Risk raporu henüz oluşturulmamış"
                                description="Risk raporunuzu oluşturarak sağlık durumunuz hakkında detaylı analiz alabilirsiniz."
                                action={
                                    <Button
                                        onClick={handleGenerateRisk}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Risk Raporu Oluştur</span>
                                    </Button>
                                }
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
