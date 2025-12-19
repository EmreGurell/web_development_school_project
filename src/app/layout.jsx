import { Geist } from "next/font/google";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/header";
import {Toaster} from "sonner";
import Footer from "@/components/layout/footer";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-space-grotesk",
});


export const metadata = {
    title: "Sağlık Platformu",
    description: "SDG 3 Sağlık & Kaliteli Yaşam",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={spaceGrotesk.variable}>
        <body className="bg-background-light dark:bg-background-dark text-gray-700 dark:text-gray-300 transition-colors duration-300 antialiased">

        {children}

        <Toaster />
        </body>
        </html>
    );
}
