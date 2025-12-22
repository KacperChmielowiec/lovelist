"use client";

import Link from "next/link";
export default function Home(){
     return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-sm">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Witamy!</h1>
        <p className="text-gray-600 mb-6">
          Ta strona jest w budowie. Kliknij przycisk poniżej, aby przejść do dashboardu.
        </p>
        <Link href="/dashboard">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            Przejdź do Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}