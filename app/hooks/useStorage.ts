import { useCallback, useState, useEffect } from "react"

export function useLocalStorage(key: string, defaultValue: any) {
    return useStorage(key, defaultValue, window.localStorage)
}
export function useSessionStorage(key: string, defaultValue: any) {
    return useStorage(key, defaultValue, window.sessionStorage)
}
function useStorage(key: string, defaultValue : any, storageObject : any): any {
// 1. Inicjalizujemy stan wartością domyślną (bezpieczne dla SSR)
  const [value, setValue] = useState(() => {
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  // 2. Używamy useEffect, który odpala się TYLKO w przeglądarce
  useEffect(() => {
    // Tutaj window już na pewno istnieje
    const jsonValue = storageObject.getItem(key);
    
    if (jsonValue != null) {
      setValue(JSON.parse(jsonValue));
    }
  }, [key, storageObject]); // Wykona się raz po zamontowaniu

  // 3. Reagujemy na zmiany 'value', aby zapisać je w storage
  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}