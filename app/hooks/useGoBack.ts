"use client";

import { useRouter } from "next/navigation";

const useGoBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back(); // Wróć do poprzedniej strony
    } else {
      router.push("/"); // Jeśli brak historii, przekieruj na stronę główną
    }
  };

  return goBack;
};

export default useGoBack;
