// app/register/actions.ts
"use server";
import { createClient } from '@supabase/supabase-js';

export type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    city: string;
    hotelName: string;
};

export type ObjectFormType = {
    objectType: string;             // Hotel, Aparthotel itd.
    category: string;               // Gwiazdki lub poziom standardu
    website?: string;               // URL
    googleCard?: string;            // Google Business link
    bookingSystems?: string;        // wpis tekstowy
    socialMedia?: string[];           // wpis tekstowy
    logo?: FileList;                // upload pliku
};

export async function registerUser(formData: FormData) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const { email, password, confirmPassword, country, city, hotelName } = formData;

  if (password !== confirmPassword) {
    throw new Error("Hasła nie są zgodne");
  }

  const { data: emailExists, error } = await supabase.rpc('is_email_exist', { email });
  console.log('Wynik is_email_exist:', emailExists, error);

  if (error || emailExists ) {
    return { error: 'Użytkownik o podanym adresie już istnieje.'};
  }


  try {

    // tworzenie użytkownika w Supabase Auth
    const { data: user, error: errorSignUp } = await supabase.auth.signUp({
      email,
      password,
      
    });

    if (errorSignUp) {
      return { error: errorSignUp.message };
    }
 
    const userId = user.user?.id;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: userId, country, city, hotel_name: hotelName },
      ]);

    if (profileError){
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

    return { success: true };

    
  } catch (err) {
    return { error: "Błąd serwera podczas rejestracji." };
  }
}

export async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function getObjectTypes() : Promise<{ id: string; name: string }[]> {
   const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const { data, error } = await supabase.from('object_types').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}


export async function getHotelStandard() : Promise<{ id: string; level: number }[]> {
   const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const { data, error } = await supabase.from('hotel_standard').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}


export async function getUserId(token? : string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const {data,error} = await supabase.auth.getUser(token);

  if (error || !data?.user){
      return null;  
  }

  return data.user.id;
  }


  export async function uploadLogo(userId: string, file: File) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );

    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${userId}.${fileExt}`;
    const filePath = `${fileName}`;
    const { data, error } = await supabase.storage
      .from('users_avatar')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    if (error) {
      console.error("Błąd podczas przesyłania logo:", error);
      return { error: error.message  };
    }
    return {data :data};
  }

export async function getRegisterStatus(userId: string) : Promise<{ register_status: boolean; register_step: number } | null> {

   const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  console.log("Pobieranie statusu rejestracji dla userId:", userId);

  const { data, error } = await supabase.from('profiles')
  .select('register_status, register_step')
  .eq('id', userId)
  .single();

  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return null;
  }
  return data;
}

export async function registerStep2(userId: string, formData: ObjectFormType) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const { objectType, category, website, googleCard, bookingSystems, socialMedia } = formData;

  try { 
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        type_object: objectType,
        standard: category,
        website_url: website,
        google_profile: googleCard,
        b_system: bookingSystems,
        social_media: socialMedia
       })
      .eq('id', userId);

    if (profileError) {
      console.error("Błąd aktualizacji profilu:", profileError);
      return { error: profileError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error);
    return { error: "Błąd serwera podczas aktualizacji profilu." };
  }
} 