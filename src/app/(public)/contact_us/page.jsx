"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, Mail, Phone, Navigation, Loader2 } from "lucide-react";

export default function ContactPage() {
    // Topkapı Üniversitesi Altunizade Yerleşkesi coordinates
    const officeLat = 41.0175;
    const officeLng = 29.0155;

    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [distance, setDistance] = useState(null);

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Tarayıcınız konum servisini desteklemiyor.");
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                
                // Calculate distance to office
                const dist = calculateDistance(latitude, longitude, officeLat, officeLng);
                setDistance(dist.toFixed(2));
                setLocationLoading(false);
            },
            (error) => {
                setLocationError("Konum alınamadı. Lütfen izin verdiğinizden emin olun.");
                setLocationLoading(false);
            }
        );
    };

    // Google Maps embed URL for Topkapı Üniversitesi Altunizade Yerleşkesi
    const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7458!2d${officeLng}!3d${officeLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzAzLjAiTiAyOcKwMDAnNTUuOCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str`;

    return (
        <section className="w-full bg-gradient-to-b from-sky-50 to-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold text-black">
                        Bizimle İletişime Geçin
                    </h1>
                    <p className="mt-4 text-gray-600">
                        Sorularınız, önerileriniz veya destek talepleriniz için buradayız.
                        Sağlığınızla ilgili her konuda size yardımcı olmaktan mutluluk duyarız.
                    </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left - Contact Info & Map */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-sm text-gray-600">

                                <div className="flex gap-3">
                                    <MapPin className="text-sky-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">Adres</p>
                                        <p>
                                            Topkapı Üniversitesi Altunizade Yerleşkesi<br />
                                            Selami Ali Mahallesi, Kuşbakışı Caddesi No: 2/1<br />
                                            Üsküdar/İstanbul, Türkiye
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Mail className="text-sky-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">E-Posta</p>
                                        <p>info@healthcare.com</p>
                                        <p>destek@healthcare.com</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Phone className="text-sky-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">Telefon</p>
                                        <p>+90 (212) 555 00 00</p>
                                        <p className="text-xs">Hafta içi: 09:00 – 18:00</p>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="rounded-2xl shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="text-sky-500" size={20} />
                                    Konum Bilgisi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="w-full h-64 rounded-lg overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7458!2d${officeLng}!3d${officeLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzAzLjAiTiAyOcKwMDAnNTUuOCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str`}
                                    />
                                </div>

                                <div className="pt-2 border-t">
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={getCurrentLocation}
                                        disabled={locationLoading}
                                    >
                                        {locationLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Konum alınıyor...
                                            </>
                                        ) : (
                                            <>
                                                <Navigation size={16} />
                                                Konumumu Al
                                            </>
                                        )}
                                    </Button>

                                    {locationError && (
                                        <p className="text-sm text-red-600 mt-2">{locationError}</p>
                                    )}

                                    {userLocation && !locationError && (
                                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                                Konumunuz alındı
                                            </p>
                                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                Koordinatlar: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                                            </p>
                                            {distance && (
                                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                    Ofisimize uzaklık: ~{distance} km
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right - Extended Form */}
                    <Card className="rounded-2xl shadow-sm lg:col-span-2 lg:h-[600px] flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-lg">Bize Mesaj Gönderin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 overflow-y-auto">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Adınız Soyadınız" />
                                <Input type="email" placeholder="E-Posta Adresiniz" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Telefon Numaranız" />
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Konu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Genel Bilgi Talebi</SelectItem>
                                        <SelectItem value="support">Destek</SelectItem>
                                        <SelectItem value="sales">Satış</SelectItem>
                                        <SelectItem value="technical">Teknik Destek</SelectItem>
                                        <SelectItem value="feedback">Geri Bildirim</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Input placeholder="Konu Başlığı (Opsiyonel)" />
                            </div>

                            <Textarea
                                placeholder="Mesajınızı buraya yazın..."
                                className="min-h-[180px]"
                            />

                            <div className="flex items-start gap-2">
                                <Checkbox id="kvkk" />
                                <label
                                    htmlFor="kvkk"
                                    className="text-xs text-gray-600 leading-relaxed"
                                >
                                    Kişisel Verilerin Korunması metnini okudum ve onaylıyorum.
                                </label>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-sky-500 to-emerald-400">
                                Gönder →
                            </Button>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    );
}
