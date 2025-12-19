import React from 'react';
import HealthCard from "@/components/health_card";
import {ScanHeart,AlertCircle,Shield,ChartSpline} from "lucide-react";

function Features() {
    return (
        <section
            className="py-20 bg-white dark:bg-surface-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center gap-2 text-center mb-16">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Neler Sunuyoruz?
                </h1>
                <h2 className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Sağlığınızı anlamak ve daha iyi yönetmek için tasarlanan kapsamlı özelliklerimizle tanışın.
                </h2>
            </div>

            {/* RESPONSIVE GRID */}
            <div
                className="
                  grid md:grid-cols-2 lg:grid-cols-4 gap-8
                "
            >
                <HealthCard
                    icon={<ScanHeart/>}
                    title="Kişisel Sağlık Takibi"
                    description="Tüm sağlık verilerinizi kolayca tek bir yerden kontrol edin."
                    centerImageSrc="/images/watch.png"
                />

                <HealthCard
                    icon={<AlertCircle/>}
                    iconColor="text-red-500"
                    iconBg="bg-red-200"
                    title="Erken Uyarı Sistemi"
                    description="Sağlık bilgileriniz ile yapay zeka destekli sistemimizden risk skoru oluşturun ve tavsiyeler alın."
                    centerImageSrc="/images/watch.png"
                />

                <HealthCard
                    icon={<Shield/>}
                    iconColor="text-green-500"
                    iconBg="bg-green-200"
                    title="Anonim Veri Analizi"
                    description="Kişisel bilgilerinizden arındırılmış verilerle güvenli analizler yapılır. Kullanıcı gizliliği korunurken, eğilimler ve istatistiksel sonuçlar elde edilir."
                    centerImageSrc="/images/watch.png"
                />

                <HealthCard
                    icon={<ChartSpline />}
                    iconColor="text-yellow-500"
                    iconBg="bg-yellow-200"
                    title="Toplumsal Sağlık İstatistikleri"
                    description="Toplum düzeyinde sağlık verilerinin anonimleştirilmiş analizleriyle eğilimler ve risk faktörleri belirlenir."
                    centerImageSrc="/images/watch.png"
                />
            </div>
        </div>
        </section>
    );
}

export default Features;
