"use client";
import { useState,useEffect } from "react";
import RegisterStep_1 from "./step1";
import RegisterStep_2 from "./step2";
import { getUserId } from "././../utils";
import { getRegisterStatus} from "./actions";
import { useRouter } from 'next/navigation'
export default function RegisterSteps() {

    const [step, setStep] = useState(1);
    const router = useRouter(); 
    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getUserId();
            console.log("User ID:", userId);
            if (userId) {
                const status = await getRegisterStatus(userId);
                console.log("Register Status:", status);
                if(!status) return;
                if (!status.register_status && status.register_step){    
                    setStep(status.register_step);
                }
                router.push('/');
            }
            
        };

        fetchUserId();
    }, []);

    const handleStep = () => {
        setStep(step + 1);
    };
    return (
        <div>
            {step === 1 && <RegisterStep_1 onNext={handleStep} />}
            {step === 2 && <RegisterStep_2 onNext={handleStep} />}
        </div>
    );
}