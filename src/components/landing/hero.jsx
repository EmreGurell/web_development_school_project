import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function Hero() {
    return (
        <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* ----- BG EFFECTS ----- */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* ---------- TEXT ---------- */}
                    <div className="text-center lg:text-left space-y-8">
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            Sağlık İçin{" "}
                            <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                                Akıllı Dijital
                            </span>
                            <br />
                            Takip ve Analiz Sistemi
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Kişisel verilerinizle desteklenen, yapay zeka tabanlı erken uyarı sistemleri ve detaylı
                            sağlık analizleriyle geleceğinizi güvence altına alın.
                        </p>

                        {/* ---------- BUTTONS ---------- */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button className="px-8 py-6 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                Şimdi Başlayın
                            </Button>

                            <Button
                                variant="outline"
                                className="px-8 py-6 rounded-xl flex items-center justify-center gap-2"
                            >
                                Daha Fazla <ArrowDown />
                            </Button>
                        </div>
                    </div>

                    {/* ---------- IMAGE ---------- */}
                    <div className="hidden lg:flex justify-center">
                        <Image
                            src="/landing/hero_image.png"
                            alt="Doctor analysing digital health data"
                            width={600}
                            height={600}
                            className="w-full max-w-[500px] h-auto object-contain"
                            priority
                        />
                    </div>

                </div>
            </div>
        </header>
    );
}
