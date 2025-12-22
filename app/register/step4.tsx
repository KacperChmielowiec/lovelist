"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { FormData4, EventCategory, BestTime, locationType, EventItem } from "./types";
import { LoadScript } from "@react-google-maps/api";
import FormInput from "./FormInput";
import AddressAutocompleteMap from "./LocationInput";
import { registerStep4 } from "./actions";
import { InfoModal } from "../modal";
import { delay } from "../utils";


const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES = ["places"]; // stała tablica

export default function RegisterStep_4({ onNext, userId }: { onNext: () => void, userId: string }) {

    const methods = useForm<FormData4>({
        defaultValues: {
            events: [],
            attractions: []
        }
    });

    const { register, handleSubmit, control, formState: { errors } } = methods;

    const { fields: eventFields, append: appendEvent, remove: removeEvent } = useFieldArray({
        control,
        name: "events"
    });

    const { fields: attractionsFields, append: appendAttraction, remove: removeAttraction } = useFieldArray({
        control,
        name: "attractions"
    });


    const [isLoading, setIsLoading] = useState(false);
    const [eventsExpanded, setEventsExpanded] = useState<boolean[]>([]);
    const [attractionsExpanded, setAttractionsExpanded] = useState<boolean[]>([]);

    const [isOpenModal,openModal] = useState(false)
    const [modalMessage,setModalMessage] = useState("")

    const appendEventWrapper = () => {
        setEventsExpanded(prev => prev.map(v => v = false))
        setEventsExpanded(prev => [...prev, true])
        appendEvent({ type: locationType.event, location: { address: "", lat: 0, lng: 0 }, date: "2024-01-01" } as EventItem)
    }

    const removeEventWrapper = (index: number) => {
        removeEvent(index)
        setEventsExpanded(prev => prev.filter((_, i) => i !== index));
    }

    const appendAttractionWrapper = () => {
        setAttractionsExpanded(prev => prev.map(v => v = false))
        appendAttraction({ type: locationType.attraction, location: { address: "", lat: 0, lng: 0 } } as EventItem)
        setAttractionsExpanded(prev => [...prev, true]); // nowa atrakcja od razu rozwinięta
    };

    const removeAttractionWrapper = (index: number) => {
        removeAttraction(index);
        setAttractionsExpanded(prev => prev.filter((_, i) => i !== index));
    };

    const eventCategoryKeys = Object.keys(EventCategory).filter(key => isNaN(Number(key)));

    if (userId === null) return <div>Brak użytkownika</div>;

    const onSubmit = async (data: FormData4) => {
        setIsLoading(true)
        await delay(1000)
        console.log("dane formularza", data);
        const result = await registerStep4(userId,data)
        if(result.error){
            setModalMessage(`Bład w ptzetwarzaniu formularza: ${result.error}`)
            openModal(true)
           
        }else{
            onNext()
        }

        setIsLoading(false)
    };

    return (
        <FormProvider {...methods}>
            <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <h1 className="text-2xl mb-6 font-bold text-gray-100">
                        Sekcja D – Informacje o miejscach
                    </h1>

                    {/* KARTA PROFILOWA */}
                    <div className="bg-gray-800/40 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-700">

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            <LoadScript googleMapsApiKey={GOOGLE_MAPS_KEY} libraries={LIBRARIES}>
                                {/* -------------------- TYP & KATEGORIA ---    ----------------- */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">
                                        Wydarzenia
                                    </h2>
                                    <div className="grid grid-cols-1 gap-2">
                                        {eventFields.map((field, index) => (
                                            <div key={field.id} className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="bg-gray-800 px-2 text-sm text-gray-400">Wydarzenie {index + 1}</h3>
                                                    <button className="text-gray-100" onClick={() => setEventsExpanded(prev =>
                                                        prev.map((v, i) => (i === index ? !v : v))
                                                    )} type="button">{eventsExpanded[index] ? "Ukryj" : "Pokaż"}</button>
                                                    <button className="text-gray-100" onClick={() => removeEventWrapper(index)} type="button">Usuń</button>
                                                </div>
                                                {eventsExpanded[index] && (
                                                    <>
                                                        <div className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                            <FormInput
                                                                label={`Nazwa wydarzenia`}
                                                                name={`events.${index}.name`}
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.name}
                                                                rules={{ required: "Nazwa wydarzenia jest wymagana" }}
                                                            />
                                                            <FormInput
                                                                label={`Opis wydarzenia`}
                                                                name={`events.${index}.description`}
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.description}
                                                            />
                                                            <FormInput
                                                                label="Typ wydarzenia (kategoria)"
                                                                name={`events.${index}.category`}
                                                                type="select"
                                                                register={register}
                                                                rules={{ required: "Typ wydarzenia jest wymagany" }}
                                                            >
                                                                <option className="text-gray-800" value="">Wybierz kategorię</option>
                                                                {eventCategoryKeys.map(key => (
                                                                    <option className="text-gray-800" key={EventCategory[key]} value={EventCategory[key]}>
                                                                        {key}
                                                                    </option>
                                                                ))}
                                                            </FormInput>
                                                        </div>
                                                        <div className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                            <h4 className="px-2 text-sm text-gray-400">Szczegóły wydarzenia</h4>
                                                            <FormInput
                                                                label={`Data wydarzenia`}
                                                                name={`events.${index}.date`}
                                                                type="date"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.date}
                                                                rules={{ required: "Data wydarzenia jest wymagana" }}
                                                            />
                                                            <FormInput
                                                                label={`Godzina wydarzenia`}
                                                                name={`events.${index}.hour`}
                                                                type="time"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.hour}
                                                            />
                                                            <FormInput
                                                                label={`Cena biletu (PLN)`}
                                                                name={`events.${index}.price`}
                                                                type="number"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.price}
                                                            />
                                                            <FormInput
                                                                label={`Link do wydarzenia`}
                                                                name={`events.${index}.url`}
                                                                type="url"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.events?.[index]?.url}
                                                            />
                                                            <AddressAutocompleteMap
                                                                name={`events.${index}.location`}
                                                                label="Adres miejsca"
                                                                showMap={false}
                                                            />
                                                        </div>
                                                    </>)}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="text-gray-100 pointer underline mt-2"
                                            onClick={() => appendEventWrapper()}
                                        >
                                            + Dodaj wydarzenie
                                        </button>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2 mt-6">
                                        Atrakcje
                                    </h2>
                                    <div className="grid grid-cols-1 gap-2">
                                        {attractionsFields.map((field, index) => (
                                            <div key={field.id} className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="bg-gray-800 px-2 text-sm text-gray-400">Atrakcja {index + 1}</h3>
                                                    <button className="text-gray-100" onClick={() => setAttractionsExpanded(prev =>
                                                        prev.map((v, i) => (i === index ? !v : v))
                                                    )} type="button">{attractionsExpanded[index] ? "Ukryj" : "Pokaż"}</button>
                                                    <button className="text-gray-100" onClick={() => removeAttractionWrapper(index)} type="button">Usuń</button>
                                                </div>
                                                {attractionsExpanded[index] && (
                                                    <>
                                                        <div className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                            <FormInput
                                                                label={`Nazwa atrakcji`}
                                                                name={`attractions.${index}.name`}
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.attractions?.[index]?.name}
                                                                rules={{ required: "Nazwa atrakcji jest wymagana" }}
                                                            />
                                                            <FormInput
                                                                label={`Opis atrakcji`}
                                                                name={`attractions.${index}.description`}
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.attractions?.[index]?.description}
                                                            />
                                                            <FormInput
                                                                label="Typ wydarzenia (kategoria)"
                                                                name={`attractions.${index}.category`}
                                                                type="select"
                                                                register={register}
                                                                rules={{ required: "Typ atrakcji jest wymaganay" }}
                                                            >
                                                                <option value="">Wybierz kategorię</option>
                                                                 {eventCategoryKeys.map(key => (
                                                                    <option className="text-gray-800" key={EventCategory[key]} value={EventCategory[key]}>
                                                                        {key}
                                                                    </option>
                                                                ))}
                                                            </FormInput>
                                                        </div>
                                                        <div className="relative flex flex-col items-stretch justify-stretch gap-4">
                                                            <h4 className="px-2 text-sm text-gray-400">Szczegóły atrakcji</h4>
                                                            <FormInput
                                                                label={`Cena atrakcji (PLN)`}
                                                                name={`attractions.${index}.price`}
                                                                type="number"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.attractions?.[index]?.price}
                                                                rules={{min: {value: 0, message: "Minimalna cena to 0" }}}
                                                            />
                                                            <FormInput
                                                                label={`Najlepsza pora dnia`}
                                                                name={`attractions.${index}.bestTime`}
                                                                type="select"
                                                                register={register}
                                                                className="w-full"
                                                                error={errors.attractions?.[index]?.bestTime}
                                                                rules={{ required: "Te pole jest wymagane ( zaznacz dowolna )" }}
                                                            >
                                                                <option className="text-gray-800" value="">Wybierz porę dnia</option>
                                                                {Object.keys(BestTime).map((time) => (
                                                                    <option className="text-gray-800" key={time} value={time}>
                                                                        {time}
                                                                    </option>
                                                                ))}
                                                            </FormInput>
                                                            <AddressAutocompleteMap
                                                                key={field.id}
                                                                name={`attractions.${index}.location`}
                                                                label="Adres miejsca"
                                                                showMap={false}
                                                            />
                                                        </div>
                                                    </>)}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="text-gray-100 pointer underline mt-2"
                                            onClick={() => appendAttractionWrapper()}
                                        >
                                            + Dodaj atrakcji
                                        </button>
                                    </div>
                                    {/* SUBMIT */}
                                    <div className="flex justify-end mt-6">
                                        <button disabled={isLoading} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
                                            {isLoading ? "" : "Zapisz dane"}
                                            {isLoading && <Loader2 className="mx-6 h-8 w-8 animate-spin inline-block" />}
                                        </button>
                                    </div>
                                </div>
                            </LoadScript>
                        </form>
                    </div>
                </div>
            </div>
            <InfoModal open={isOpenModal} message={modalMessage} onOpenChange={openModal} />
        </FormProvider>
    );
}