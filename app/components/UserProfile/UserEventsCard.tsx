"use client"
import { useModal } from "../../hooks/useModal";
import { Modal } from "./ui/modal";
import { EventsAccountInfo } from "./types";
import { EventItem } from "@/app/register/types";
import { useForm, useFieldArray, Controller, FormProvider, UseFormReturn } from "react-hook-form";
import { useState, useMemo, ReactNode } from "react";
import { locationType, EventCategory } from "@/app/register/types";
import { InfoModal } from "@/app/modal";
import { useJsApiLoader } from '@react-google-maps/api'
import { AddEventAccount, RemoveEventsAccount, UpdateEventsAccount } from "./actions";
import { Loader2 } from "lucide-react";
import AddressAutocompleteMap from "@/app/register/LocationInput";
import Select from "./form/Select"
import Input from "./form/input/InputField";
import Label from "./form/Label";
import Button from "./ui/button/Button";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const LIBRARIES = ["places"]; // stała tablica

export function MapLoader({ children }: { children: React.ReactNode }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_KEY,
        //@ts-ignore
        libraries: LIBRARIES,
        id: 'google-map-script', // WAŻNE, żeby hook wiedział, że to ta sama instancja
    });

    if (!isLoaded) return null;

    return <>{children}</>;
}

function RootLayout({ children, methods }: { children: ReactNode, methods: UseFormReturn<EventsAccountInfo, any, EventsAccountInfo> }) {
    return (
        <>
            <FormProvider {...methods}>
                <MapLoader>
                    {children}
                </MapLoader>
            </FormProvider>
        </>
    );
}


export default function UserEventsCard({ data }: { data: EventsAccountInfo }) {

    const { isOpen, openModal, closeModal } = useModal();
    const [fieldIndex, setFieldIndex] = useState(0)
    const [type, setType] = useState<locationType>()
    const [modalOpen, setModalOpen] = useState(false)

    const modalMessage = "Czy na pewno chcesz usunąć wydarzenie/atrakcje ?"

    const methods = useForm<EventsAccountInfo>({
        defaultValues: {
            ...data
        }
    })

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch, setValue } = methods

    const { fields: eventFields, append: appendEvent, remove: removeEvent } = useFieldArray({
        control,
        name: "events"
    });

    const watchedEvents = watch("events");

    const events = useMemo(() => {
        return watchedEvents
            ?.map((e, i) => ({ value: e, index: i }))
            .filter(e => e.value.type === locationType.event);
    }, [watchedEvents]);


    const attractions = useMemo(() => {
        return watchedEvents
            ?.map((e, i) => ({ value: e, index: i }))
            .filter(e => e.value.type === locationType.attraction);
    }, [watchedEvents])

    const onSubmit = async (data: EventsAccountInfo) => {

        const cleanData = Object.fromEntries(
            Object.entries(data.events[fieldIndex]).filter(([_, value]) => value !== "")
        );

        cleanData.type = type!

        if (!cleanData?.id_event) {

            const { error, id } = await AddEventAccount(cleanData as EventItem)
            if (error) {
                alert("Bład podczas dodawania wydarzenia po stonie serwera")
            }
            cleanData.id_event = id
            appendEvent(cleanData as EventItem)

        }
        else {
            console.log("event", cleanData)
            const { error } = await UpdateEventsAccount(cleanData as EventItem)
            if (error) {
                alert("Bład podczas dodawania wydarzenia po stonie serwera")
            }
        }
        closeModal()
    }

    const openModalWrapper = (index: number, type: locationType) => {
        setType(type)
        openModal()
        setFieldIndex(index)
    }

    const addEvent = (location: locationType) => {
        const lastIndex = eventFields.length
        setTimeout(() => (openModalWrapper(lastIndex, location)), 0)
    }


    const getCategory = () => {
        //@ts-ignore
        return Object.keys(EventCategory).filter(key => (!Number(key))).map((key) => ({ label: key, value: EventCategory[key] }))
    }

    const removeEventConfirmation = (index: number) => {
        setFieldIndex(index)
        setModalOpen(true)
    }

    const RemoveEventWrapper = async (index: number) => {
        const { error } = await RemoveEventsAccount(String(eventFields?.[index].id_event))
        if (error) {
            alert("Bład w usuwaniu wydarzenia")
        } else {
            removeEvent(index)
        }
    }


    return (
        <>
            <RootLayout methods={methods}>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="w-full">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 mb-4">
                                Wydarzenia
                            </h4>
                            {events.map((e => (
                                <div key={e.index} className="relative grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Nazwa
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {e.value.name}
                                        </p>
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Data
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {`${e.value.date ?? "-"}`}
                                        </p>
                                    </div>
                                    <div className="absolute right-0 top-1/2 y-translate-y-1/2 flex justify-content-center items-center gap-x-2">
                                        <button onClick={() => removeEventConfirmation(e.index)} className="border border-gray-300 text-sm text-red-700 rounded-full px-3 py-1">
                                            Usuń
                                        </button>
                                        <button
                                            onClick={() => openModalWrapper(e.index, locationType.event)}
                                            className="px-2 py-1 flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                    fill=""
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            )))}
                            <div className="pt-4 w-full flex justify-center">
                                <button onClick={() => addEvent(locationType.event)} >Dodaj wydarzenia +</button>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 mb-4 mt-4">
                                Atrakcje
                            </h4>
                            {attractions.map((e => (
                                <div key={e.index} className="relative grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Nazwa
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {e.value.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Data
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {e.value.date?.length ? e.value.date : "-"}
                                        </p>
                                    </div>
                                    <div className="absolute right-0 top-1/2 y-translate-y-1/2 flex justify-content-center items-center gap-x-2">
                                        <button onClick={() => removeEventConfirmation(e.index)} className="border border-gray-300 text-sm text-red-700 rounded-full px-3 py-1">
                                            Usuń
                                        </button>
                                        <button
                                            onClick={() => openModalWrapper(e.index, locationType.attraction)}
                                            className="px-2 py-1 flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                                    fill=""
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            )))}
                            <div className="pt-4 w-full flex justify-center">
                                <button onClick={() => addEvent(locationType.attraction)} >Dodaj atrakcje +</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                        <div className="px-2 pr-14">
                            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                                Edytuj swoje {`${type == locationType.event ? 'Wydarzenie' : 'Atrakcje'}`}
                            </h4>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                                Wypełnij dane, które uwarzasz za potrzebne
                            </p>
                        </div>
                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-2 overflow-y-auto max-h-[600px] custom-scrollbar">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div>
                                        <Label>Nazwa wydarzenia</Label>
                                        <Input rules={{ required: "Wpisz nazwe wydarzenia" }} type="text" register={register} hint={errors.events?.[fieldIndex]?.name} error={!!errors.events?.[fieldIndex]?.name} name={`events.${fieldIndex}.name`} />
                                    </div>
                                    <div>
                                        <Label>Opis wdyarzenia</Label>
                                        <Input rules={{ required: "Wpisz opis wydarzenia" }} type="text" register={register} hint={errors.events?.[fieldIndex]?.description} error={!!errors.events?.[fieldIndex]?.description} name={`events.${fieldIndex}.description`} />
                                    </div>
                                    {type === locationType.event &&
                                        <>
                                            <div>
                                                <Label>Data wydarzenia</Label>
                                                <Input type="date" register={register} hint={errors.events?.[fieldIndex]?.date} error={!!errors.events?.[fieldIndex]?.date} name={`events.${fieldIndex}.date`} />
                                            </div>
                                            <div>
                                                <Label>Godzina wydarzenia</Label>
                                                <Input type="time" register={register} hint={errors.events?.[fieldIndex]?.hour} error={!!errors.events?.[fieldIndex]?.hour} name={`events.${fieldIndex}.hour`} />
                                            </div>
                                            <div>
                                                <Label>Strona wydarzenia</Label>
                                                <Input type="text" register={register} hint={errors.events?.[fieldIndex]?.url} error={!!errors.events?.[fieldIndex]?.url} name={`events.${fieldIndex}.url`} />
                                            </div>
                                        </>
                                    }
                                    <div>
                                        <Label>Kategoria {`${type == locationType.event ? 'wydarzenia' : 'atrakcji'}`}</Label>
                                        <Controller
                                            name={`events.${fieldIndex}.category`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    onChange={(val) => field.onChange(val)}
                                                    options={getCategory()}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label>Cena {`${type == locationType.event ? 'wydarzenia' : 'atrakcji'}`}</Label>
                                        <Input type="number" register={register} hint={errors.events?.[fieldIndex]?.price} error={!!errors.events?.[fieldIndex]?.price} name={`events.${fieldIndex}.price`} />
                                    </div>
                                    <div>
                                        <AddressAutocompleteMap
                                            key={eventFields[fieldIndex]?.id}
                                            name={`events.${fieldIndex}.location`}
                                            label="Adres miejsca"
                                            showMap={true}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                                <Button size="sm" variant="outline" onClick={closeModal}>
                                    Close
                                </Button>
                                <Button size="sm">
                                    Save Changes
                                    {isSubmitting && <Loader2 className="ml-2 h-5 w-5 animate-spin inline-block" />}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </RootLayout>
            <InfoModal
                title="Potwierdzenie"
                open={modalOpen}
                onOpenChange={setModalOpen}
                message={modalMessage}
                onConfirm={() => RemoveEventWrapper(fieldIndex)}
            />

        </>
    );
}
