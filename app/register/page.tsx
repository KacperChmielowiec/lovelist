"use client";
import { useState, useEffect } from "react";
import RegisterStep_1 from "./step1";
import RegisterStep_2 from "./step2";
import { getUserId } from "././../utils";
import { getRegisterStatus } from "./actions";
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react";
export default function RegisterSteps() {

    const [step, setStep] = useState(-1);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {

        const fetchUserId = async () => {
            setIsLoading(true);
            const userId = await getUserId();
            setUserId(userId);
            if (userId) {

                const status = await getRegisterStatus(userId);
                if (!status) return;
                if (status.register_status == true) router.push('/dashboard');
                if (status.register_step) {
                    setStep(status.register_step);
                }
            }
            setIsLoading(false);
        };

        fetchUserId();
    }, []);

    const handleStep = () => {
        setStep(step + 1);
    };
    return (
        <div>
            {step === 1 && <RegisterStep_1 onNext={handleStep} />}
            {step === 2 && userId && <RegisterStep_2 onNext={handleStep} userId={userId} />}
            {isLoading && step === -1 && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <Loader2 className="h-20 w-20 animate-spin text-white" />
                </div>
            )}
        </div>
    );
}