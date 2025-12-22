
import "../globals.css";
import "../index.css"
import LayoutContent  from "./layoutContent";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "../context/SidebarContext";
import { ThemeProvider } from "../context/ThemeContext"
import React from "react";
import { getUserId } from "@/app/auth/actions"
import { redirect } from "next/navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getUserId()
  //const userIdClient = await getUserIdClient() 
  //console.log("userId",userIdClient)

  if (!user) {
    redirect('/login')
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent>
          {children}
        </LayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}
