'use server'
import { AddressAccountInfo, BaseAccountInfo, DetailsAccountInfo, EventsAccountInfo, SocialAccountInfo } from './types';
import { createClientServer as createClientAsync } from '@/app/auth/clientServer';
import { EventItem } from "@/app/register/types";

export async function updateAvatar(file: File): Promise<string> {
    const bucketName = 'users_avatar';
    const supabase = await createClientAsync();

    const { data: { user } } = await supabase.auth.getUser();
    const id = user?.id;

    if (!id) throw new Error('User not found');

    // Generujemy nazwę pliku w formacie logo_{userId}.{ext}
    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${id}.${fileExt}`;

    // Sprawdź, czy plik użytkownika już istnieje
    const { data: existingFiles, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list('');

    if (listError) throw listError;

    const existingFile = existingFiles?.find(f => f.name.toLowerCase().startsWith(`logo_${id}.`));
    console.log("existing", existingFile)
    // Jeśli istnieje, usuń go przed dodaniem nowego
    if (existingFile) {
        const { error: removeError } = await supabase
            .storage
            .from(bucketName)
            .remove([existingFile.name]);
        if (removeError) throw removeError;
    }

    // Upload nowego pliku
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Pobierz publiczny URL nowego avatara
    const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function getAvatarUrl(): Promise<string> {
    const bucketName = 'users_avatar';
    const defaultPath = 'default-avatar.png';

    const supabase = await createClientAsync()

    const { data: { user } } = await supabase!.auth.getUser();


    const id = user?.id

    // 1. Spróbuj wylistować pliki dla konkretnego użytkownika
    const { data: files, error } = await supabase
        .storage
        .from(bucketName)
        .list('')


    // 2. Szukamy dokładnego dopasowania nazwy (ignorując wielkość liter i rozszerzenie)
    //@ts-ignore
    const userFile = files?.find(file =>
        file.name.toLowerCase().startsWith(`logo_${id}.`)
    );

    // 3. Wybierz ścieżkę: albo znaleziony plik, albo domyślny
    const finalPath = userFile ? userFile.name : defaultPath;

    // 4. Pobierz URL (getPublicUrl jest synchroniczne w nowym SDK)
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(finalPath);

    return data.publicUrl;
}

export async function getHotelInformation(): Promise<BaseAccountInfo> {

    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (!user) {

        return {
            email: "",
            phone: "",
            hotel_name: "",
            webiste_url: "",
            standard: 0,
            object_type: {
                label: "",
                value: 0
            }
        };
    }

    const { data: profile, error } = await supabase!
        .from("profiles")
        .select(`
            *,
            object_types (*)
        `)
        .eq("id", user.id)
        .single();



    const data: BaseAccountInfo = {
        email: user.email ?? "",
        phone: profile.phone ?? "",
        hotel_name: profile?.hotel_name ?? "",
        webiste_url: profile?.website_url ?? "",
        standard: profile.standard,
        object_type: {
            label: profile.object_types?.name,
            value: profile.object_types?.id
        }
    };



    return data;
}

export async function getHotelIDetails(): Promise<DetailsAccountInfo> {

    //if (!supabase) await createClientAsync()
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (!user) {
        return {} as DetailsAccountInfo;
    }

    const { data: details, error } = await supabase!
        .from("place_info_table")
        .select(`
        *,
        guest_type_items (
            *, guest_types_table (*)
        ),
        seasons_table(*),
        avarage_time(*)
    `)
        .eq("fk_profile", user.id) // Zmienione z "id" na "fk_profile"
        .single();


    console.log("error", error)


    const data: DetailsAccountInfo = {
        room_amount: details?.room_amount,
        bed_amount: details?.bed_amount,
        annoual_occupancy: details?.annual_occupancy,
        // @ts-ignore
        clients_type: details?.guest_type_items.map((row) => ({ key: row.guest_types_table.id, label: row.guest_types_table.guest_type })),
        season: details?.season ? { key: details.seasons_table?.id, label: details.seasons_table?.season } : undefined,
        avarage_time: { key: details?.avarage_time?.id, label: details?.avarage_time?.period }
    };


    return data;
}

export async function SignOut() {
    //if (!supabase) await createClientAsync()
    const supabase = await createClientAsync()
    await supabase!.auth.signOut()
}


export async function getHotelLocation(): Promise<AddressAccountInfo> {


    //if (!supabase) await createClientAsync()
    const supabase = await createClientAsync()
    const { data: { user } } = await supabase!.auth.getUser()

    if (!user) {
        return {
            city: "",
            country: ""
        }
    }

    const { data: profile } = await supabase!
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


    if (!profile) {
        return {
            city: "",
            country: ""
        }
    }

    return {
        city: profile.city ?? "",
        country: profile.country ?? ""
    }

}


export async function getHotelSocialMedia(): Promise<SocialAccountInfo> {

    //if (!supabase) await createClientAsync()
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (!user) {
        return {
            googleCard: "",
            bookingSystem: "",
            facebook: "",
            linkedin: "",
            instagram: ""
        }
    }

    const { data: profile, error } = await supabase!
        .from("profiles")
        .select(`
            *
        `)
        .eq("id", user.id)
        .single();

    const data: SocialAccountInfo = {
        googleCard: profile.google_profile,
        bookingSystem: profile.b_system,
        facebook: profile.facebook_url,
        instagram: profile.instagram_url,
        linkedin: profile.linkedin_url
    };

    return data;
}


export async function getHotelEvents(): Promise<EventsAccountInfo> {

    //if (!supabase) await createClientAsync()
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (!user) {
        return {
            events: []
        }
    }

    const { data: events, error } = await supabase!
        .from("event_local_info")
        .select(`
            *
        `)
        .eq("fk_profile", user.id);

    return {
        events: events?.map((event) => ({
            id_event: event.id,
            name: event.name,
            url: event?.url,
            description: event?.description,
            category: event?.category,
            date: event?.date,
            hour: event?.time ? event.time.split('+')[0].slice(0, 5) : '',
            price: event?.price,
            bestTime: event?.best_time,
            type: event.type,
            location: {
                name: event.name,
                address: event.address,
                lat: 0,
                lng: 0,
            }
        } as EventItem)) || []
    }

}

export async function UpdateAddressAccount(data: AddressAccountInfo) {
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    if (userError || !user) {
        return { error: true }
    }

    const { data: events, error } = await supabase!
        .from("profiles")
        .update({ country: data.country, city: data.city })
        .eq('id', user.id);

    if (error) {
        return { error: true }
    }

    return { error: false }

}


export async function UpdateDetailsAccount(data: DetailsAccountInfo) {

    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    if (userError || !user) {
        return { error: true }
    }

    const { data: updatedRow, error } = await supabase!
        .from("place_info_table")
        .update({
            room_amount: data?.room_amount,
            bed_amount: data?.bed_amount,
            season: data.season?.key,
            avarage_time: data?.avarage_time?.key,
            annual_occupancy: data?.annoual_occupancy
        })
        .eq('fk_profile', user.id)
        .select("id")
        .single()

    if (error) {
        console.log("error1", error)
        return { error: true }
    }

    if (data.clients_type?.length) {
        console.log("set type client", updatedRow.id)
        const { error: error1 } = await supabase
            .from('guest_type_items')
            .upsert(
                data.clients_type.map(c => ({ place_fk: updatedRow.id, guest_type: c.key })),
                {
                    onConflict: 'place_fk,guest_type',
                    ignoreDuplicates: true, // 👈 kluczowe
                }
            )
        if (error1) {
            console.log("error2", error1)
            return { error: true }
        }

    }

    return { error: false }

}


export async function UpdateSocialAccount(data: SocialAccountInfo) {
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    if (userError || !user) {
        return { error: true }
    }

    const { error } = await supabase!
        .from("profiles")
        .update({
            b_system: data.bookingSystem,
            facebook_url: data.facebook,
            linkedin_url: data.linkedin,
            instagram_url: data.instagram,
            google_profile: data.googleCard
        })
        .eq('id', user.id);

    if (error) {
        console.log("error", error)
        return { error: true }
    }

    return { error: false }

}



export async function UpdateBaseAccountInfo(data: BaseAccountInfo) {
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    if (userError || !user) {
        return { error: true }
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
        email: data.email,
    });

    if (updateUserError) {
        console.log("error1", updateUserError)
        return { error: true }
    }

    const { error } = await supabase!
        .from("profiles")
        .update({
            hotel_name: data.hotel_name,
            type_object: data.object_type.value,
            website_url: data.webiste_url,
            standard: data.standard,
            phone: data.phone
        })
        .eq('id', user.id);

    if (error) {
        console.log("error2", error)
        return { error: true }
    }

    return { error: false }

}


export async function UpdateEventsAccount(data: EventItem) {

    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (userError || !user) {
        return { error: true }
    }

    if (!data.id_event) {
        return { error: true }
    }

    const dataToUpdate = {
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        date: data.date,
        time: data.hour,
        price: data.price,
        url: data.url,
        best_time: data.bestTime,
        address: data.location?.address,
        location: data.location?.address ? `(${data.location?.lng},${data.location?.lat})` : null,
        fk_profile: user.id
    }

    const { data: updatedRow, error } = await supabase!
        .from("event_local_info")
        .update(dataToUpdate)
        .eq('id', data.id_event)


    if (error) {
        console.log("error", error)
        return { error: true }
    }


    return { error: false }

}


export async function RemoveEventsAccount(id: string) {

    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase!.auth.getUser();
    if (userError || !user) {
        return { error: true }
    }

    const { error: removError } = await supabase!
        .from("event_local_info")
        .delete()
        .eq("id", id)

    if (removError) {
        console.log("error1", removError)
        console.log("id", id)
        return { error: true }
    }

    return { error: false }

}


export async function AddEventAccount(data: EventItem) {

    const supabase = await createClientAsync()

    const { data: { user }, error: userError } = await supabase!.auth.getUser();

    if (userError || !user) {
        return { error: true }
    }

    const dataToInsert = {
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        date: data.date ? data.date : null,
        time: data.hour,
        price: data.price,
        url: data.url,
        best_time: data.bestTime,
        address: data.location?.address,
        location: data.location?.address ? `(${data.location?.lng},${data.location?.lat})` : null,
        fk_profile: user.id
    }

    const { data: updatedRow, error } = await supabase!
        .from("event_local_info")
        .insert(dataToInsert)
        .select("id")
        .single()

    if (error) {
        console.log("error2", error)
        return { error: true }
    }


    return { error: false, id: updatedRow.id }

}