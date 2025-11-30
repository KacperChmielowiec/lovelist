
export default function RegisterStep_3({userId}: {userId: string}) {
    
    if (!userId.length) {
        return (
            <div className="min-h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Brak identyfikatora użytkownika.</p>
            </div>
        );
    }
    return (
        <div className="min-h-full bg-gray-900">
            <main className="min-h-full">
                <h1 className="text-white text-3xl font-bold text-center pt-10">
                    Krok 3: Ustawienia pokoju
                </h1>
                {/* Zawartość kroku 3 rejestracji */}
            </main>
        </div>
    );
}