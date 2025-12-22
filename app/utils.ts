"use client"
import { supabase } from "./client";
import { FormData } from './register/types';



export async function getUserId() {
    const session = supabase.auth.getSession();
   // const token = (await session).data.session?.access_token;
    //const { data, error } = await supabase.auth.getUser(token);
    //if (error || !data?.user) {
        //return null;
    //}
    if(session?.user)
    {
        return session.user
    }

    return null;

}

export async function SignOut() {
    await supabase.auth.signOut()
}

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function registerUser(formData: FormData) {
    const { email, password, confirmPassword, country, city, hotelName } = formData;

    if (password !== confirmPassword) {
        throw new Error("Hasła nie są zgodne");
    }

    const { data: emailExists, error } = await supabase.rpc('is_email_exist', { email });
    console.log('Wynik is_email_exist:', emailExists, error);

    if (error || emailExists) {
        return { error: 'Użytkownik o podanym adresie już istnieje.' };
    }


    try {

        // tworzenie użytkownika w Supabase Auth
        const { data: authData, error: errorSignUp } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Auto-confirm email without verification
                data: {
                    email_confirm: true
                }
            },
            cookieOptions: {
                name: 'sb-auth-token', // Wymuś stałą nazwę
                path: '/',             // Wymuś dostępność w całej aplikacji
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            },

        });

        if (errorSignUp) {
            return { error: errorSignUp.message };
        }

        if (!authData.user) {
            return { error: 'Nie udało się utworzyć użytkownika.' }
        }



        const userId = authData.user?.id;

        if (!userId) {
            // Jeśli nie ma ID, to prawdopodobnie trzeba potwierdzić maila
            return { error: 'Nie udało się utworzyć użytkownika.' }
        }

      


        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                { id: userId, country, city, hotel_name: hotelName },
            ]);

        if (profileError) {
            console.error('Błąd tworzenia profilu. Wykonywanie rollbacku...', profileError);
            const { error: deleteError } = await supabase.auth.admin.deleteUser(userId as string);
            if (deleteError) {
                // TO JEST KRYTYCZNY BŁĄD! Użytkownik nie ma profilu I nie można go usunąć.
                // Wymaga ręcznej interwencji (powiadomienia administratora).
                console.error('KRYTYCZNY BŁĄD ROLLBACKU: Nie udało się usunąć użytkownika:', deleteError);
                return {
                    success: false,
                    error: 'Wystąpił krytyczny błąd serwera. Skontaktuj się z pomocą techniczną.',
                    critical: true // Dodatkowa flaga dla logowania
                }
            }
            return { error: 'Nie udało się utworzyć profilu użytkownika. Rejestracja anulowana.' };
        }

        return { success: true, userId: userId };


    } catch (err) {
        return { error: "Błąd serwera podczas rejestracji." };
    }
}
