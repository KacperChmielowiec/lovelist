'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import React from "react";
import "./globals.css";
import "./index.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <div className="min-h-full bg-gray-900 test">
          <div> 
            <AuthProvider>
              <main className="min-h-full">{children}</main>
            </AuthProvider>
          </div>
       </div>
      </body>
    </html>
  );
}
