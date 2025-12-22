"use client";
import { useForm, Controller } from "react-hook-form";
import FormInput from "./FormInput";
import { registerStep5 } from "./actions";
import { FormData5 } from './types'
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { InfoModal } from "../modal";
import { delay } from "../utils";
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';

export default function RegisterStep_5({ onNext, userId }: { onNext: () => void, userId: string }) {

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<FormData5>(
        {
            defaultValues: {
                towel_amount_xl: 1.5,
                towel_amount_md: 2,
                towel_amount_sm: 2,
                bathrobes: false,
                slippers: false,
                cosmetics: false,
                bag: false
            }
        }
    );
    function valuetext(value: number) {
        return `${value}x ręczników`;
    }
    const [modalMessage, setModalMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: FormData5) => {
        setIsLoading(true)
        await delay(1000)
        console.log("dane formularza", data);
        const result = await registerStep5(userId,data)
        if(result.error){
            setModalMessage(`Bład w przetwarzaniu formularza: ${result.error}`)
            setModalOpen(true)
           
        }else{
            onNext()
        }

        setIsLoading(false)
    };

    if (userId === null) return <div>Brak użytkownika</div>;

    return (
        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h1 className="text-2xl mb-6 font-bold text-gray-100">
                    Pakiety dodatkowe
                </h1>

                {/* KARTA PROFILOWA */}
                <div className="bg-gray-800/40 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-700">

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        <div>
                            <span className="text-gray-100 text-center">
                                <p className="text-2xl text-center font-semibold">„Chcesz dodać QR Concierge do pokoi?” </p>
                                <p>(Wszystko zaczyna się od funkcjonalności, nie od sprzedaży.)</p>
                            </span>
                        </div>
                        <div className="text-gray-100">
                            <p className="font-semibold text-xl">QR kod w pokoju pozwala gościom:</p>
                            <ul className="list-disc ml-6 my-2">
                                <li>poznać trasy tematyczne hotelu,</li>
                                <li>odkrywać rekomendacje,</li>
                                <li>planować pobyt w czasie rzeczywistym.</li>
                            </ul>
                            <p className="font-semibold mt-4">Aby gość mógł zeskanować QR — umieszczamy go na ręczniku lub zawieszce.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Potrzebne informacje
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <FormInput
                                    label="Liczba łóżek"
                                    name="towel_color"
                                    type="number"
                                    register={register}
                                    rules={{ required: true, min: { value: 0, message: "Minimalna ilośc to 0" } }}
                                    error={errors.towel_color}
                                />
                                <FormInput
                                    label="Liczba łazienek"
                                    name="bathroom_amount"
                                    type="number"
                                    register={register}
                                    rules={{ required: true, min: { value: 0, message: "Minimalna ilośc to 0" } }}
                                    error={errors.bathroom_amount}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-4">
                                <FormInput
                                    label="Cze chcesz logo na reczniku ?"
                                    name="logo"
                                    type="select"
                                    register={register}
                                    rules={{ required: true }}
                                    error={errors.logo}
                                    defaultValue={1}
                                >
                                    <option className="text-gray-800" value="0">Nie</option>
                                    <option className="text-gray-800" value="1">Tak</option>
                                </FormInput>

                            </div>
                        </div>
                        <label className="block text-sm font-medium text-gray-100">
                            Wybierz ilość ręczników XL na pokój
                        </label>
                        <Controller
                            name="towel_amount_xl"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    {...field}
                                    aria-label="towel_amount_xl"
                                    defaultValue={30}
                                    getAriaValueText={valuetext}
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={0.5}
                                    marks
                                    min={0.5}
                                    max={10}
                                    onChange={(_, value) => field.onChange(value)}
                                    value={field.value}
                                />
                            )}
                        />
                        <label className="block text-sm font-medium text-gray-100">
                            Wybierz ilość ręczników średnich na pokój
                        </label>
                        <Controller
                            name="towel_amount_md"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    {...field}
                                    aria-label="towel_amount_md"
                                    defaultValue={30}
                                    getAriaValueText={valuetext}
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={0.5}
                                    marks
                                    min={0.5}
                                    max={10}
                                    onChange={(_, value) => field.onChange(value)}
                                    value={field.value}
                                />
                            )}
                        />
                        <label className="block text-sm font-medium text-gray-100">
                            Wybierz ilość małych reczników na pokój
                        </label>
                        <Controller
                            name="towel_amount_sm"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    {...field}
                                    aria-label="towel_amount_sm"
                                    defaultValue={30}
                                    getAriaValueText={valuetext}
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={0.5}
                                    marks
                                    min={0.5}
                                    max={10}
                                    onChange={(_, value) => field.onChange(value)}
                                    value={field.value}
                                />
                            )}
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                Dodatkowe Pakiety
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-100">
                                        Szlafroki z kodem QR
                                    </label>
                                    <Controller
                                        name="bathrobes"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Switch
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                {field.value ? "Tak" : "Nie"}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-100">
                                        Klapki z kodem QR
                                    </label>
                                    <Controller
                                        name="slippers"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Switch
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                {field.value ? "Tak" : "Nie"}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-100">
                                        Kosmetyki z kodem QR
                                    </label>
                                    <Controller
                                        name="cosmetics"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Switch
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                {field.value ? "Tak" : "Nie"}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-gray-100">
                                <div>
                                    <label className="block text-sm font-medium text-gray-100">
                                        Torby plażowe z kodem QR
                                    </label>
                                    <Controller
                                        name="bag"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Switch
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                />
                                                {field.value ? "Tak" : "Nie"}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* SUBMIT */}
                        <div className="flex justify-end">
                            <button disabled={isLoading} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
                                {isLoading ? "" : "Zapisz dane"}
                                {isLoading && <Loader2 className="mx-6 h-8 w-8 animate-spin inline-block" />}
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
        </div >
    );
}