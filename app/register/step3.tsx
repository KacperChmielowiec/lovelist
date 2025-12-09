import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import FormInput from "./FormInput";
import CreatableSelect from "react-select/creatable";
import { delay } from "../utils";
import { getGuestTypes, getSeasons, getStayTime, registerStep3 } from "./actions";
import { FormData3 } from "./types";

type Option = { label: string; value: string };
type StayTime = { id: string; period: string };


export default function RegisterStep_3({ onNext, userId }: { onNext: () => void; userId: string; }) {

    if (userId === null) return <div>Brak użytkownika</div>;

    const [isLoading, setIsLoading] = useState(false);
    const [seasonsOptions, setSeasonsOptions] = useState<Option[]>([])
    const [stayTime,setStayTime] = useState<StayTime[]>([])
    const [guestType, setGuestType] = useState<Option[]>([])


    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData3>();

    useEffect(() => {
        async function fetchData() {
            const data = await getSeasons()
            setSeasonsOptions(data.map((x) => { return { label: x.season, value: x.id } }))
            const stayTime = await getStayTime()
            setStayTime(stayTime)
            const guests = await getGuestTypes()
            setGuestType(guests.map((x) => { return { label: x.guest_type, value: x.id } }))
        }
        fetchData()
    }, [])


    const onSubmit = async (data: FormData3) => {
        setIsLoading(true);
        console.log("Dane z kroku 3:", data);
        await delay(1000)
        const result = await registerStep3(userId, data)
        setIsLoading(false)

        if(!result.success)
        {
            window.alert(result.error)
            return
        }

        onNext()
    };


    return (
        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h1 className="text-2xl mb-6 font-bold text-gray-100">
                    Sekcja B – Informacje o obiekcie
                </h1>

                {/* KARTA PROFILOWA */}
                <div className="bg-gray-800/40 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-700">

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* -------------------- TYP & KATEGORIA -------------------- */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Informacje o hotelu
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Liczba gości"
                                    type="number"
                                    name="room_number"
                                    register={register}
                                    rules={{ required: "Liczba gości jest wymagana" }}
                                    error={errors.room_number}
                                >
                                </FormInput>
                                <FormInput
                                    label="Liczba łóżek"
                                    type="number"
                                    name="bed_number"
                                    register={register}
                                    rules={{ required: "Liczba łóżek jest wymagana" }}
                                    error={errors.bed_number}
                                >
                                </FormInput>
                                <FormInput
                                    label="Średnie długość pobytu"
                                    type="select"
                                    name="average_stay_length"
                                    className="text-gray-100"
                                    register={register}
                                    rules={{ required: "Średnia długość pobytu jest wymagana",}}
                                    error={errors.average_stay_length}
                                >
                                    <option value="">Wybierz czas</option>
                                    {stayTime.map(o => (
                                        <option className="text-gray-800" key={o.id} value={o.id}>{o.period}</option>
                                    ))}
                                </FormInput>
                                <FormInput
                                    label="Średnie obłozenie roczne ( % )"
                                    type="number"
                                    name="annual_occupancy"
                                    className="text-gray-100"
                                    register={register}
                                    rules={{ required: "To pole jest wymagane", min: { value: 1, message: "minimaln wartość to 1%" }, max: {value:100, message: "maksymalna wartość to 100%"} }}
                                    error={errors.annual_occupancy}
                                >
                                </FormInput>
                            </div>
                            <div className="grid grid-cols-1 gap-2 mt-6">
                                <label className="block text-sm font-medium text-gray-100">
                                    Sezon szczytowy
                                </label>
                                <CreatableSelect<Option, true>
                                    onChange={(options) => {
                                        const values = options?.map((o) => o.value) ?? [];
                                        setValue("clients_type", values);
                                    }}
                                    isMulti
                                    options={guestType}
                                    placeholder="Wybierz typ klientów"
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
                        {/* SUBMIT */}
                        <div className="flex justify-end">
                            <button disabled={isLoading} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
                                {isLoading ? "" : "Zapisz dane"}
                                {isLoading && <Loader2 className="mx-4 h-8 w-8 animate-spin inline-block" />}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );

}