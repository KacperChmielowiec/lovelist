"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { delay } from "../utils";
import { supabase } from "../client";

export default function Home() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoginError, setLoginError] = useState(false)
    const loginError = "NIepoprawne login lub hasło"

    type LoginForm = {
        email: string;
        password: string;
    };


    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const router = useRouter();

    const onSubmit = async (data: LoginForm) => {
        setIsSubmitting(true);
        await delay(1000); // opcjonalne opóźnienie dla lepszego UX
        await handleLogin(data);
        setIsSubmitting(false);
    }

    const handleLogin = async (data: LoginForm) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                setLoginError(true)
                return
            }

            router.push("/dashboard");

        } catch (error) {
            setLoginError(true)
            console.error("Nieoczekiwany błąd podczas logowania:", error);
            return { error: "Nieoczekiwany błąd podczas logowania." };
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-2xl mb-4 font-bold text-gray-100 text-center">
                    Logowanie
                </h1>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 
                                        text-base text-white outline-1 -outline-offset-1 
                                        outline-white/10 placeholder:text-gray-500 
                                        focus:outline-2 focus:-outline-offset-2 
                                        focus:outline-indigo-500 sm:text-sm"
                                    {...register("email", {
                                        required: "Email jest wymagany"
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-100">
                                Hasło
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 
                                        text-base text-white outline-1 -outline-offset-1 
                                        outline-white/10 placeholder:text-gray-500 
                                        focus:outline-2 focus:-outline-offset-2 
                                        focus:outline-indigo-500 sm:text-sm"
                                    {...register("password", {
                                        required: "Hasło jest wymagane"
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center rounded-md bg-indigo-500 
                                px-3 py-1.5 text-sm font-semibold text-white 
                                hover:bg-indigo-400 
                                focus-visible:outline-2 focus-visible:outline-offset-2 
                                focus-visible:outline-indigo-500"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                "Zaloguj się"
                            )}
                        </button>
                        {isLoginError && (
                            <p className="text-red-500 text-sm mt-1">
                                {loginError}
                            </p>
                        )}
                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                            Nie masz konta ?
                            <a href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 ml-2">Zarejestruj się</a>
                        </p>
                    </form>

                </div>
            </div>
        </div>
    );
}
