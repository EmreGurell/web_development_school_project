"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center px-4 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-8">
              <Search className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          <br />
          Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg no-underline"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Ana Sayfaya Dön
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="px-8 py-6 text-lg border-2 no-underline"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri Git
          </Button>
        </div>
      </div>
    </div>
  );
}
