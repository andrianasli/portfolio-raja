import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Raja Adrian Maulana — Portfolio",
  description: "Mahasiswa Teknik Informatika | Mobile & Web Developer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="grid-bg" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
