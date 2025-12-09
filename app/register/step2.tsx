"use client";
import {useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { getHotelStandard, getObjectTypes, uploadLogo, registerStep2 } from "./actions";
import { ObjectFormType } from './types'
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { InfoModal } from "../modal";
import { delay } from "../utils";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 3 * 1024 * 1024; // 3MB
type Option = { label: string; value: string };
export default function RegisterStep_2({ onNext, userId }: { onNext: () => void, userId: string }) {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ObjectFormType>();
    const [objectTypes, setObjectTypes] = useState<{ id: string; name: string }[]>([]);
    const [hotelStandards, setHotelStandards] = useState<{ id: string; level: number }[]>([]);

    const [modalMessage, setModalMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);  
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        const types = await getObjectTypes();
        setObjectTypes(types);
        const standards = await getHotelStandard();
        setHotelStandards(standards);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const uploadLogoFile = async (fileList: FileList) => {
        {
            if (userId && fileList && fileList.length > 0) {
                const file = fileList[0];
                const uploadResult = await uploadLogo(userId, file);
                if (uploadResult.error) {
                    console.error("Błąd podczas uploadu logo:", uploadResult.error);
                } else {
                    console.log("Logo załadowane pomyślnie:", uploadResult.data);
                }

            }
        }
    };
    const onSubmit = async (data: ObjectFormType) => {
        console.log("Dane obiektu:", data);
        setIsLoading(true);
        await delay(1000); // opcjonalne opóźnienie dla lepszego UX
        if (data.logo) await uploadLogoFile(data.logo);
        const result = await registerStep2(userId, data);
        if (result.error) {
            setModalMessage(`Błąd podczas zapisywania danych obiektu: ${result.error}`);
            setModalOpen(true);
        } else {
            console.log("Dane obiektu zapisane pomyślnie");
            onNext();
        }
        setIsLoading(false);
    };

    if (userId === null) return <div>Brak użytkownika</div>;

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
                                <div>
                                    <label className="block text-sm font-medium text-gray-100">
                                        Linki do mediów społecznościowych
                                    </label>
                                    <div className="mt-2 w-full">
                                        <CreatableSelect<Option, true>
                                            onChange={(options) => {
                                                const values = options?.map((o) => o.value) ?? [];
                                                setValue("socialMedia", values);
                                            }}
                                            isMulti
                                            placeholder="Wpisz URL i naciśnij Entesr"
                                            styles={{
                                                container: (base) => ({
                                                    ...base,
                                                    width: "100%",        // <--- Wymagane!
                                                }),
                                                control: (base) => ({
                                                    ...base,
                                                    width: "100%",        // <--- Wymagane!
                                                    minHeight: "42px",
                                                    backgroundColor: "#ffffff0d",
                                                    borderColor: "#3b3b3b",
                                                }),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                    validate: (value) => {
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
                            <button disabled={isLoading} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
                                {isLoading ? "" : "Zapisz dane"}
                                {isLoading && <Loader2 className="ml-2 h-8 w-8 animate-spin inline-block" />}
                            </button>
                        </div>

                    </form>
                </div>
                <InfoModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    message={modalMessage}
                />
            </div>
        </div>
    );
}