'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./index.css"
import AppSidebar from "./layout/AppSidebar";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext"
import React, { ReactNode } from "react";
import AppHeader from "./layout/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const LayoutContent = ({ children }: { children: ReactNode }) => {

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

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
        <div className="h-full bg-gray-900">
          <div>
            <ThemeProvider>
              <SidebarProvider>
                <LayoutContent>
                    <main className="min-h-full">{children}</main>
                </LayoutContent>
              </SidebarProvider>
            </ThemeProvider>
          </div>
       </div>
      </body>
    </html>
  );
}
