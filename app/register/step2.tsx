"use client";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { getHotelStandard, getObjectTypes, getUserId,uploadLogo } from "./actions";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
export type ObjectFormType = {
    objectType: string;             // Hotel, Aparthotel itd.
    category: string;               // Gwiazdki lub poziom standardu
    website?: string;               // URL
    googleCard?: string;            // Google Business link
    bookingSystems?: string;        // wpis tekstowy
    socialMedia?: string;           // wpis tekstowy
    logo?: FileList;                // upload pliku
};
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 3 * 1024 * 1024; // 5MB
export default function RegisterStep_2({ onNext }: { onNext: () => void }) {

    const { register, handleSubmit, formState: { errors }} = useForm<ObjectFormType>();
    const [objectTypes, setObjectTypes] = useState<{ id: string; name: string }[]>([]);
    const [hotelStandards, setHotelStandards] = useState<{ id: string; level: number }[]>([]);
    const [jwtToken, setJwtToken] = useState<string>("");
    const fetchData = async () => {
        const types = await getObjectTypes();
        setObjectTypes(types);
        const standards = await getHotelStandard();
        setHotelStandards(standards);
        console.log(objectTypes, hotelStandards);
    };
    useEffect(() => {
        const supabase = createBrowserSupabaseClient(
        );
        supabase.auth.getSession().then((session) => {
            console.log("Session data:", session);
            setJwtToken(session.data.session?.access_token || "");
        });
        fetchData();
    }, []);

    const onSubmit = async (data: ObjectFormType) => {
        console.log(data);
        const uid = await getUserId(jwtToken);
        console.log("JWT Token:", jwtToken);
        console.log("Zalogowany użytkownik ID:", uid);
        if (uid && data.logo && data.logo.length > 0) {
            const file = data.logo[0];
            const uploadResult = await uploadLogo(uid, file);
            if (uploadResult.error) {
                console.error("Błąd podczas uploadu logo:", uploadResult.error);
            } else {
                console.log("Logo załadowane pomyślnie:", uploadResult.data);
            }
        }
    };

    return (
        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h1 className="text-2xl mb-6 font-bold text-gray-100">
                    Sekcja A – Informacje o obiekcie
                </h1>

                {/* KARTA PROFILOWA */}
                <div className="bg-gray-800/40 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-700">

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* -------------------- TYP & KATEGORIA -------------------- */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Podstawowe informacje
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Typ obiektu"
                                    type="select"
                                    name="objectType"
                                    register={register}
                                    rules={{ required: "Typ obiektu jest wymagany" }}
                                    error={errors.objectType}
                                >
                                    <option className="text-gray-800" value="">Wybierz typ</option>
                                    {objectTypes.map((type, index) => (
                                        <option className="text-gray-800" key={index} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </FormInput>

                                <FormInput
                                    label="Kategoria"
                                    type="select"
                                    name="category"
                                    register={register}
                                    rules={{ required: "Kategoria jest wymagana" }}
                                    error={errors.category}
                                >
                                    <option className="text-gray-800" value="">Wybierz kategorię</option>
                                    {hotelStandards.map((standard, index) => (
                                        <option className="text-gray-800" key={index} value={standard.id}>
                                            {standard.level} {standard.level === 1 ? "gwiazdka" : standard.level <= 4 ? "gwiazdki" : "gwiazdek"}
                                        </option>
                                    ))}
                               
                                </FormInput>
                            </div>
                        </div>

                        {/* -------------------- WWW & GOOGLE -------------------- */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Linki & wizytówki
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <FormInput
                                    label="Strona www"
                                    name="website"
                                    type="url"
                                    register={register}
                                    rules={{ required: true }}
                                    error={errors.website}
                                />

                                <FormInput
                                    label="Wizytówka Google"
                                    name="googleCard"
                                    type="url"
                                    register={register}
                                    rules={{ required: true }}
                                    error={errors.googleCard}
                                />
                            </div>
                        </div>

                        {/* -------------------- SYSTEMY REZERWACJI -------------------- */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Rezerwacje & Social Media
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Systemy rezerwacji"
                                    name="bookingSystems"
                                    type="text"
                                    placeholder="Np. booking.com, tripadvisor, własny system"
                                    register={register}
                                />

                                <FormInput
                                    label="Social media"
                                    name="socialMedia"
                                    type="text"
                                    placeholder="Linki do profili"
                                    register={register}
                                />
                            </div>
                        </div>

                        {/* -------------------- LOGO -------------------- */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Logo obiektu
                            </h2>

                            <FormInput
                                label="Logo (min. 300 dpi)"
                                name="logo"
                                type="file"
                                register={register}
                                rules={{
                                    required: false,
                                    validate: (value) =>{
                                        if (value && value.length > 0) {
                                            const file = value[0] as File;
                                            if (!ACCEPTED_IMAGE_TYPES.includes(file?.type)) {
                                                    return "Only JPG, PNG, and WebP formats are accepted";
                                            }
                                            if (file && file.size > maxFileSize) {
                                                return "File size must be less than 3MB";
                                            }
                                        }
                                        return true;
                                    }
                                }}
                                error={errors.logo}
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="flex justify-end">
                            <button className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
                                Zapisz dane
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}