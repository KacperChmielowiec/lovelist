"use client";
import { useState, useEffect } from "react";
import { getRegisterStatus, updateRegisterStatus } from "./actions";
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RegisterStep_1 from "./step1";
import RegisterStep_2 from "./step2";
import RegisterStep_3 from "./step3";
import RegisterStep_4 from "./step4";
import RegisterStep_5 from "./step5";
import Stepper from "./stepper";

export default function RegisterSteps() {
    const { user, isLoading: authLoading } = useAuth();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const setStatus = async () => {
        let step = 1;
        setIsLoading(true);
        if (user?.id) {
            const status = await getRegisterStatus(user.id);
            if (status && status.register_status == true) router.push('/dashboard');
            if (status && status.register_step) {
                step = status.register_step
            }
        }
        setStep(step);
        setIsLoading(false);
    };

    useEffect(() => {
        if(authLoading)
        {
            setStatus()
        }
    }, [authLoading]);

    const handleStep = async () => {
        updateRegisterStatus(user?.id as string, step + 1 === 6 ? step : step + 1, step + 1 === 6 ? true : false);
        if(step === 5)
        {
            router.push("/dashboard")
            setIsLoading(true)
            return
        }
         setStep(step + 1);
    };
    return (
        <>
            {step > 0 && !isLoading && <div className="max-w-[800px] mx-4 md:mx-auto mb-2 pt-8">
                <Stepper steps={["Krok 1", "Krok 2", "Krok 3", "Krok 4", "krok 5"]} currentStep={step} />
            </div>}
            <div>
                {step === 1 && <RegisterStep_1 onNext={handleStep} />}
                {step === 2 && user?.id && <RegisterStep_2 onNext={handleStep} userId={user.id} />}
                {step === 3 && user?.id && <RegisterStep_3 onNext={handleStep} userId={user.id} />}
                {step === 4 && user?.id && <RegisterStep_4 onNext={handleStep} userId={user.id} />}
                {step === 5 && user?.id && <RegisterStep_5 onNext={handleStep} userId={user.id} />}
                {isLoading && step < 1 && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                        <Loader2 className="h-20 w-20 animate-spin text-white" />
                    </div>
                )}
            </div>
        </>
    );
}