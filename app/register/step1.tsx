"use client";
import { useForm } from "react-hook-form";
import { registerUser, FormData, delay } from "./actions";
import { Country, City } from "country-state-city";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import FormInput from "./FormInput";
import { InfoModal } from "../modal";

export default function RegisterStep_1({ onNext }: { onNext: () => void }) {

    const [countryCode, setCountryCode] = useState<string>("");
    const countries = Country.getAllCountries();
    const cities = countryCode ? City.getCitiesOfCountry(countryCode) : [];

    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [nextStep, setNextStep] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        await delay(1000); // opcjonalne opóźnienie dla lepszego UX
        const result = await registerUser(data);

        if (result.error) {
            setModalMessage(result.error);
            setModalOpen(true);
        } else {
            setModalMessage("Konto zostało utworzone! sprawdź swój email aby je aktywować.");
            setModalOpen(true);
            setNextStep(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!modalOpen && nextStep) {
            onNext();
            setNextStep(false);
        }
    }, [modalOpen, nextStep]);

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className="text-2xl mb-4 font-bold text-gray-100">Rejestracja</h1>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormInput
                                label="Nazwa hotelu"
                                name="hotelName"
                                register={register}
                                error={errors.hotelName}
                                rules={{required: "Nazwa hotelu jest wymagana"}}
                                type="text"
                            />
                            <FormInput
                                label="Kraj"
                                type="select"
                                name="country"
                                register={register}
                                error={errors.country}
                                value={countryCode}
                                rules={{required: "Kraj jest wymagany"}}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    setCountryCode(selected);

                                    const country = countries.find((c) => c.isoCode === selected);
                                    setValue("country", country?.name ?? "");
                                }}
                            >
                                <option className="text-gray-800" value="">Wybierz kraj</option>
                                {countries.map((c) => (
                                    <option className="text-gray-800" key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                    </option>
                                ))}
                            </FormInput>
                            <FormInput
                                label="Miasto"
                                type="select"
                                name="city"
                                register={register}
                                rules={{required: "Miasto jest wymagane"}}
                                error={errors.city}
                                disabled={!countryCode}
                            >
                                <option className="text-gray-800" value="">Wybierz miasto</option>
                                {cities?.map((c, index) => (
                                    <option className="text-gray-800" key={index} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </FormInput>
                            <FormInput
                                label="Email"
                                name="email"
                                register={register}
                                rules={{required: "Email jest wymagany", pattern: {value: /^\S+@\S+$/i, message: "Nieprawidłowy format email"}}}
                                error={errors.email}
                                type="email"
                            />
                            <FormInput
                                label="Hasło"
                                name="password"
                                register={register}
                                rules={{
                                    required: "Hasło jest wymagane",
                                    minLength: {
                                        value: 6,
                                        message: "Min 6 znaków"
                                    }
                                }}
                                error={errors.password}
                                type="password"
                            />
                            <FormInput
                                label="Potwierdź hasło"
                                name="confirmPassword"
                                register={register}
                                rules={{
                                    required: "Musisz powtórzyć hasło",
                                    validate: (value) =>
                                        value === watch("password") || "Hasła muszą być takie same"
                                }}
                                error={errors.confirmPassword}
                                type="password"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="lex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                {isLoading ? "" : "Zarejestruj się"}
                                {isLoading && <Loader2 className="ml-2 h-8 w-8 animate-spin inline-block" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <InfoModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                message={modalMessage}
            />
        </>
    );
}