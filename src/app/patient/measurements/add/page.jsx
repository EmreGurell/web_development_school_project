"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getUserFromToken } from "@/lib/utils/auth";

export default function AddMeasurement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    value: "",
    unit: "",
    symptoms: [],
  });
  const [symptomInput, setSymptomInput] = useState("");

  const addSymptom = () => {
    if (symptomInput.trim()) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptomInput.trim()],
      });
      setSymptomInput("");
    }
  };

  const removeSymptom = (index) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type.trim() || !formData.value.toString().trim()) {
      toast.error("Ölçüm tipi ve değer gereklidir");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = getUserFromToken();

      if (!token || !user?.id) {
        toast.error("Oturum bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const requestBody = {
        userId: user.id,
        type: formData.type.trim(),
        value: formData.value.toString().trim(),
      };

      if (formData.unit?.trim()) {
        requestBody.unit = formData.unit.trim();
      }

      if (formData.symptoms && formData.symptoms.length > 0) {
        requestBody.symptoms = formData.symptoms;
      }

      const res = await fetch(`${API_URL}measurement/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        let errorMessage = "Ölçüm eklenemedi.";
        let errorDetails = null;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData.error || errorData.errors;
          console.error("Backend hatası:", errorData);
        } catch {
          errorMessage = res.statusText || errorMessage;
        }

        if (res.status === 500) {
          errorMessage =
            "Sunucu hatası oluştu. Lütfen backend console'unu kontrol edin.";
          if (errorDetails) {
            console.error("Hata detayları:", errorDetails);
          }
        }

        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Ölçüm eklenemedi.");
        setLoading(false);
        return;
      }

      toast.success("Ölçüm başarıyla eklendi!");

      // Formu temizle
      setFormData({
        type: "",
        value: "",
        unit: "",
        symptoms: [],
      });
      setSymptomInput("");

      // Dashboard'a yönlendir
      router.push("/patient/dashboard");
    } catch (error) {
      console.error("Ölçüm ekleme hatası:", error);
      toast.error(
        error.message ||
          "Ölçüm eklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl space-y-6">
      <h2 className="text-2xl font-semibold">Yeni Ölçüm Ekle</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ölçüm Bilgileri</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ölçüm Tipi */}
            <div className="space-y-2">
              <Label
                htmlFor="measurement-type"
                className="text-base font-medium"
              >
                Ölçüm Tipi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="measurement-type"
                placeholder="Örn: Kan Basıncı, Ateş, Nabız, Kan Şekeri"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                className="h-11"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ölçümünüzün türünü belirtin
              </p>
            </div>

            {/* Değer ve Birim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="measurement-value"
                  className="text-base font-medium"
                >
                  Değer <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="measurement-value"
                  type="text"
                  placeholder="120 veya Normal/Yüksek/Düşük"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="measurement-unit"
                  className="text-base font-medium"
                >
                  Birim
                </Label>
                <Input
                  id="measurement-unit"
                  placeholder="Örn: mmHg, °C, bpm, mg/dL"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="h-11"
                />
              </div>
            </div>

            {/* Semptomlar */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Semptomlar</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Semptom ekle (örn: Baş ağrısı, Mide bulantısı)"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSymptom();
                    }
                  }}
                  className="h-11"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSymptom}
                  className="h-11"
                >
                  Ekle
                </Button>
              </div>
              {formData.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm"
                    >
                      <span className="text-gray-800 dark:text-gray-200">
                        {symptom}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-lg leading-none"
                        aria-label="Semptomu kaldır"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Varsa semptomlarınızı ekleyebilirsiniz
              </p>
            </div>

            {/* Butonlar */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ekleniyor...
                  </>
                ) : (
                  "Ölçümü Kaydet"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
