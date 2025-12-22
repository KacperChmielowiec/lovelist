"use client";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useRef } from "react";

const containerStyle = {
    width: "100%",
    height: "300px"
};

type Props<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    showMap: boolean
};


export default function AddressAutocompleteMap<T extends FieldValues>({ name, label, showMap}: Props<T>) {

    const { setValue, watch, control } = useFormContext();
    const autocompleteRef = useRef(null);

    const lat = watch(`${name}.lat`);
    const lng = watch(`${name}.lng`);

    const defaultCenter = {
        lat: lat || 52.237049,  // Warszawa fallback
        lng: lng || 21.017532
    };

    const handlePlaceChanged = () => {
        if (!autocompleteRef.current) return;
        //@ts-ignore    
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) return;

        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        // zapisujemy dane w RHF
        setValue(`${name}.address`, place.formatted_address || "");
        setValue(`${name}.lat`, newLat);
        setValue(`${name}.lng`, newLng);
    };

    

    return (
        <>
            <Controller
                name={`${name}.address`}
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        //@ts-ignore
                        onLoad={(ref) => (autocompleteRef.current = ref)}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <>
                        <label className="block text-sm font-medium text-gray-100 mb-2" >{label}</label>
                        <input
                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white
                            outline-1 -outline-offset-1 outline-white/10
                            focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Wpisz adres..."
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "16px",
                                marginBottom: "12px"
                            }}
                        />
                        </>
                    </Autocomplete>
                )}
            />
            {showMap && <GoogleMap
                mapContainerStyle={containerStyle}
                center={lat && lng ? { lat, lng } : defaultCenter}
                zoom={lat && lng ? 15 : 12}
            >
                {lat && lng && <Marker position={{ lat, lng }} />}
            </GoogleMap>}
        </>
    )
}