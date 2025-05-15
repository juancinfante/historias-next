import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function AdminLayout({ children }) {
    return (
            <div className="bg-gray-100 h-screen flex flex-col md:flex-row overflow-hidden">
                {children} {/* Aquí se renderizará el contenido de las páginas del panel */}
            </div>
    );
}
