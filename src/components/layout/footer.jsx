import React from "react";
import Image from "next/image";

const footerLinks = [
    {
        title: "Hakkımızda & Kurumsal",
        links: [
            { label: "Hakkımızda", href: "#" },
            { label: "Misyon & Vizyon", href: "#" },
            { label: "Gizlilik Politikası", href: "#" },
            { label: "Kullanım Şartları", href: "#" },
        ],
    },
    {
        title: "Sağlık Kaynakları",
        links: [
            { label: "Sürdürülebilir Kalkınma Amaçları (SKA 3)", href: "#" },
            { label: "Sağlık Yaşam Rehberleri", href: "#" },
            { label: "Aşı ve Hastalık Bilgileri", href: "#" },
            { label: "Anonim Sağlık Verileri", href: "#" },
        ],
    },
    {
        title: "Destek & İletişim",
        links: [
            { label: "İletişim & Destek", href: "#" },
            { label: "Geri Bildirim Gönder", href: "#" },
            { label: "Teknik Destek Merkezi", href: "#" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* TOP */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* LOGO */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" className="w-10 h-10" alt="logo" />
                            <span className="font-semibold text-gray-900 text-lg">
                                HEALTHCARE
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed">
                            Dijital Sağlık Takip Platformu
                        </p>
                    </div>

                    {/* LINKS */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-semibold text-gray-900 mb-4">
                                {section.title}
                            </h4>

                            <ul className="space-y-2 text-sm text-gray-500">
                                {section.links.map((link) => (
                                    <li
                                        key={link.label}
                                        className="hover:text-gray-900 transition-colors cursor-pointer"
                                    >
                                        {link.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* BOTTOM */}
                <div className="mt-16 pt-6 border-t border-gray-200 text-sm text-gray-400
                                flex flex-col md:flex-row items-center justify-between gap-4">
                    <span>© 2025 HEALTHCARE. Tüm hakları saklıdır.</span>
                    <span>Dijital Sağlık & Veri Güvenliği</span>
                </div>
            </div>
        </footer>
    );
}
