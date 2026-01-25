import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "Sood (수드) | Startup Consulting",
    description: "Personal homepage of Sood - Startup Consulting & Insights",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body
                className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
            >
                <Header />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
