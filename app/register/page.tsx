"use client";
import { useState, useEffect } from "react";
import { getUserId } from "././../utils";
import { getRegisterStatus, updateRegisterStatus } from "./actions";
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react";
import RegisterStep_1 from "./step1";
import RegisterStep_2 from "./step2";
import RegisterStep_3 from "./step3";
import RegisterStep_4 from "./step4";
import Stepper from "./stepper";
import RegisterStep_5 from "./step5";

export default function RegisterSteps() {

    const [step, setStep] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchUserId = async () => {
        let step = 1;
        setIsLoading(true);
        const userId = await getUserId();
        console.log("Pobrane userId:", userId);
        if (userId) {
            setUserId(userId);
            const status = await getRegisterStatus(userId);
            console.log("Pobrany status rejestracji:", status);
            if (status && status.register_status == true) router.push('/dashboard');
            if (status && status.register_step) {
                step = status.register_step
            }
        }
        console.log("register_step", step)
        setStep(step);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const handleStep = async () => {
        setStep(step + 1);
        if(!userId) await fetchUserId()
        updateRegisterStatus(userId as string, step + 1, step + 1 === 10 ? true : false);
    };
    return (
        <>
            {step > 0 && !isLoading && <div className="max-w-[800px] mx-4 md:mx-auto mb-2 pt-8">
                <Stepper steps={["Krok 1", "Krok 2", "Krok 3", "Krok 4", "krok 5"]} currentStep={step} />
            </div>}
            <div>
                {step === 1 && <RegisterStep_1 onNext={handleStep} />}
                {step === 2 && userId && <RegisterStep_2 onNext={handleStep} userId={userId} />}
                {step === 3 && userId && <RegisterStep_3 onNext={handleStep} userId={userId} />}
                {step === 4 && userId && <RegisterStep_4 onNext={handleStep} userId={userId} />}
                {step === 5 && userId && <RegisterStep_5 onNext={handleStep} userId={userId} />}
                {isLoading && step < 1 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                        <Loader2 className="h-20 w-20 animate-spin text-white" />
                    </div>
                )}
            </div>
        </>
    );
}