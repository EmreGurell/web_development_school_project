"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Plus, AlertTriangle } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {getUserFromToken} from "@/lib/utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RiskPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [risks, setRisks] = useState([]);
    const [currentRisk, setCurrentRisk] = useState(null);
    const [aiAdvice, setAiAdvice] = useState(null);
    const [error, setError] = useState(null);

    const user = getUserFromToken();
    const userId = user?.id;

    const fetchRisks = async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}risk/me`, {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const json = await res.json();
            
            if (json.success && json.data) {
                // Risk data varsa risks array'ini oluştur
                if (json.data.risks && Array.isArray(json.data.risks) && json.data.risks.length > 0) {
                    setRisks(json.data.risks);
                    setCurrentRisk({
                        score: json.data.overallScore || json.data.score || 0,
                        level: json.data.overallLevel || json.data.level || "low",
                        ...json.data
                    });
                } else {
                    // Risk data yok
                    setRisks([]);
                    setCurrentRisk(null);
                }
            } else {
                setRisks([]);
                setCurrentRisk(null);
            }
        } catch (err) {
            console.error("Risk fetch error:", err);
            setError("Risk verileri yüklenirken bir hata oluştu");
            setRisks([]);
            setCurrentRisk(null);
        } finally {
            setLoading(false);
        }
    };

    const generateRisk = async () => {
        if (!userId) return;
        
        setGenerating(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}risk/generate/${userId}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                // Risk oluşturuldu, verileri tekrar çek
                await fetchRisks();
            } else {
                const json = await res.json();
                setError(json.message || "Risk skoru oluşturulamadı");
            }
        } catch (err) {
            console.error("Risk generate error:", err);
            setError("Risk skoru oluşturulurken bir hata oluştu");
        } finally {
            setGenerating(false);
        }
    };

    const fetchAiAdvice = async () => {
        if (!userId || !currentRisk) return;
        
        try {
            const res = await fetch(`${API_URL}risk/ai/me`, {
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const json = await res.json();
            
            if (json.success && json.data) {
                setAiAdvice(json.data);
            }
        } catch (err) {
            console.error("AI advice fetch error:", err);
            // AI hatası kritik değil, sessizce ignore
        }
    };

    useEffect(() => {
        fetchRisks();
    }, [userId]);

    useEffect(() => {
        if (currentRisk) {
            fetchAiAdvice();
        }
    }, [currentRisk]);

    if (loading) {
        return <LoadingSpinner message="Risk verileri yükleniyor..." />;
    }

    const hasRisk = currentRisk !== null && risks.length > 0;

    return (
        <section className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Risk Değerlendirmesi
                </h2>
                <Button 
                    onClick={generateRisk} 
                    disabled={generating}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    {generating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Hesaplanıyor...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            {hasRisk ? "Yeni Risk Skoru Oluştur" : "Risk Skoru Oluştur"}
                        </>
                    )}
                </Button>
            </div>

            {/* ERROR */}
            {error && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="pt-6">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* CURRENT RISK */}
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-800 dark:text-gray-200">
                        Güncel Risk Durumu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {hasRisk ? (
                        <div className="space-y-4">
                            <div className="flex gap-6 items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Risk Skoru</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                                        {currentRisk.score}/100
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Seviye</p>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                                            currentRisk.level === "high" || currentRisk.level === "critical"
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                : currentRisk.level === "medium"
                                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        }`}
                                    >
                                        {currentRisk.level?.toUpperCase() || "LOW"}
                                    </span>
                                </div>
                            </div>

                            {/* Risk detayları varsa göster */}
                            {currentRisk.risks && Array.isArray(currentRisk.risks) && currentRisk.risks.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                        Risk Faktörleri
                                    </h4>
                                    <div className="space-y-2">
                                        {currentRisk.risks.map((risk, index) => (
                                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {risk.disease || "Bilinmeyen"}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                                        risk.level === "high" || risk.level === "critical"
                                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            : risk.level === "medium"
                                                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    }`}>
                                                        {risk.level?.toUpperCase() || "LOW"}
                                                    </span>
                                                </div>
                                                {risk.reason && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {risk.reason}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState
                            type="risk"
                            title="Henüz risk raporu oluşturulmamış"
                            description="Yukarıdaki 'Risk Skoru Oluştur' butonuna tıklayarak sağlık durumunuz hakkında detaylı analiz alabilirsiniz."
                        />
                    )}
                </CardContent>
            </Card>

            {/* AI TAVSİYE - Sadece risk varsa göster */}
            {hasRisk && aiAdvice && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardHeader>
                        <CardTitle className="text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI Tavsiyesi ve Değerlendirme
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {aiAdvice.title && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        {aiAdvice.title}
                                    </h4>
                                </div>
                            )}
                            
                            {aiAdvice.summary && (
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {aiAdvice.summary}
                                    </p>
                                </div>
                            )}

                            {aiAdvice.warnings && aiAdvice.warnings.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                                        ⚠️ Uyarılar
                                    </h5>
                                    <ul className="space-y-2">
                                        {aiAdvice.warnings.map((warning, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="text-red-500 mt-1">•</span>
                                                <span>{warning}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiAdvice.recommendations && aiAdvice.recommendations.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                        💡 Öneriler
                                    </h5>
                                    <ul className="space-y-2">
                                        {aiAdvice.recommendations.map((rec, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {aiAdvice.level && (
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        Seviye: {aiAdvice.level}
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* CHART - Sadece risk varsa göster */}
            {hasRisk && (
                <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-800 dark:text-gray-200">
                            Risk Skoru Geçmişi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {risks.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={risks.map((r, idx) => ({
                                        date: new Date(r.createdAt || Date.now()).toLocaleDateString('tr-TR'),
                                        score: r.score || 0,
                                        createdAt: r.createdAt || Date.now()
                                    }))}
                                    margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                                >
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#6b7280"
                                        fontSize={12}
                                    />
                                    <YAxis 
                                        domain={[0, 100]} 
                                        stroke="#6b7280"
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                        }}
                                        labelFormatter={(label) => `Tarih: ${label}`}
                                        formatter={(value) => [`${value}`, "Risk Skoru"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#f87171"
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: "#f87171" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <EmptyState
                                type="risk"
                                title="Geçmiş veri bulunamadı"
                                description="Risk raporu geçmişi burada görünecektir."
                            />
                        )}
                    </CardContent>
                </Card>
            )}
        </section>
    );
}
