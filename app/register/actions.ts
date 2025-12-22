// app/register/actions.ts
"use server";
import { createClientServer as createClientAsync } from "@/app/auth/clientServer"
import { FormData, FormData3, FormData4, FormData5, FormData2 } from "./types";


export async function registerUser(formData: FormData) {

  const supabase = await createClientAsync()
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
    const { data: user, error: errorSignUp } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Auto-confirm email without verification
        data: {
          email_confirm: true
        }

      },
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

    return { success: true };


  } catch (err) {
    return { error: "Błąd serwera podczas rejestracji." };
  }
}

export async function getObjectTypes(): Promise<{ id: string; name: string }[]> {

  const supabase = await createClientAsync()
  const { data, error } = await supabase.from('object_types').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}


export async function getSeasons(): Promise<{ id: string; season: string }[]> {
  const supabase = await createClientAsync()
  const { data, error } = await supabase.from('seasons_table').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}

export async function getStayTime(): Promise<{ id: string; period: string }[]> {
  const supabase = await createClientAsync()
  const { data, error } = await supabase.from('stay_length_table').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}



export async function getHotelStandard(): Promise<{ id: string; level: number }[]> {
  const supabase = await createClientAsync()
  const { data, error } = await supabase.from('hotel_standard').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}

export async function getGuestTypes(): Promise<{ id: string; guest_type: string }[]> {
  const supabase = await createClientAsync()
  const { data, error } = await supabase.from('guest_types_table').select('*');
  if (error) {
    console.error("Błąd pobierania typów obiektów:", error);
    return [];
  }
  return data;
}



export async function getUserId(token?: string) {
  const supabase = await createClientAsync()

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return null;
  }

  return data.user.id;
}


export async function uploadLogo(userId: string, file: File) {
  const supabase = await createClientAsync()
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
    return { error: error.message };
  }
  return { data: data };
}

export async function getRegisterStatus(userId: string): Promise<{ register_status: boolean; register_step: number } | null> {

  const supabase = await createClientAsync()
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



export async function updateRegisterStatus(userId: string, step: number, status: boolean) {
  const supabase = await createClientAsync()
  const { error } = await supabase
    .from('profiles')
    .update({ register_step: step, register_status: status })
    .eq('id', userId);
  if (error) {
    console.error("Błąd aktualizacji statusu rejestracji:", error);
    return { error: error.message };
  }
}


export async function registerStep2(userId: string, formData: FormData2) {
  const supabase = await createClientAsync()

  const { objectType, category, website, googleCard, bookingSystems, facebook, linkedin, instagram } = formData;

  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        type_object: objectType,
        standard: category,
        website_url: website,
        google_profile: googleCard,
        b_system: bookingSystems,
        facebook_url: facebook,
        instagram_url: instagram,
        linkedin_url: linkedin
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

export async function registerStep3(userId: string, formData: FormData3) {
  const supabase = await createClientAsync()

  const { room_number, bed_number, annual_occupancy, average_stay_length, clients_type, peak_season } = formData;

  try {

    const { data: key, error: placeError } = await supabase
      .from('place_info_table')
      .insert({
        room_amount: room_number,
        bed_amount: bed_number,
        annual_occupancy: annual_occupancy,
        season: peak_season,
        avarage_time: average_stay_length
      })
      .select('id')
      .single()



    if (placeError) {
      console.error("Błąd dodania informacji o obiekcie:", placeError);
      return { error: placeError.message };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        fk_place_info: key.id
      })
      .eq('id', userId);

    if (profileError) {
      console.error("Błąd aktualizacji profilu:", profileError);
      return { error: profileError.message };
    }

    const guestToInsert = clients_type.map(c => ({ profile_id: userId, guest_type: c }))

    const { error: guestError } = await supabase
      .from('guest_type_items')
      .insert(guestToInsert)

    if (guestError) {
      console.error("Błąd dodania typu gości:", guestError);
      return { error: guestError.message };
    }


    return { success: true };

  } catch (error) {
    console.error("Błąd podczas aktualizacji profilu:", error);
    return { error: "Błąd serwera podczas aktualizacji profilu." };
  }
}

export async function registerStep4(userId: string, formData: FormData4) {

  const dataToInsert = [...formData.events, ...formData.attractions].map(event => ({
    name: event.name,
    description: event.description,
    type: event.type,
    category: event.category,
    date: event.date,
    time: event.hour,
    price: event.price,
    url: event.url,
    best_time: event.bestTime,
    address: event.location?.address,
    location: `(${event.location?.lng},${event.location?.lat})`,
    fk_profile: userId

  }))

  const supabase = await createClientAsync()

  const { error: eventError } = await supabase
    .from('event_local_info')
    .insert(dataToInsert)

  if (eventError) {
    return { success: false, error: eventError.message };
  }

  return { success: true }
}

export async function registerStep5(userId: string, formData: FormData5) {

  const dataToInsert = {
    towel_color: formData.towel_color,
    bathroom_amount: formData.bathroom_amount,
    logo: formData.logo,
    t_amount_xl: formData.towel_amount_xl,
    t_amount_md: formData.towel_amount_md,
    t_amount_sm: formData.towel_amount_sm,
    bathrobes: formData.bathrobes,
    slippers: formData.slippers,
    bag: formData.bag,
    fk_profile: userId
  }
  const supabase = await createClientAsync()

  const { error: eventError } = await supabase
    .from('packages_table')
    .insert(dataToInsert)

  if (eventError) {
    return { success: false, error: eventError.message };
  }

  return { success: true }
}

