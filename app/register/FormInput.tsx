import React from "react";
import {
    UseFormRegister,
    FieldValues,
    Path,
    FieldError,
    RegisterOptions
} from "react-hook-form";

type BaseProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    error?: FieldError;
    type?: string;
    className?: string;
    children?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    rules?: RegisterOptions<T, Path<T>>;
} & React.InputHTMLAttributes<HTMLInputElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>;

export default function FormInput<T extends FieldValues>({
    label,
    name,
    register,
    error,
    type = "text",
    className,
    children,
    onChange,
    rules,
    ...rest
}: BaseProps<T>) {
    
    const reg = rules ? register(name,rules) : register(name);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        reg.onChange(e); // RHF handling
        onChange?.(e);   // custom logic
    };

    const isSelect = type === "select";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-100">
                {label}
            </label>

            <div className="mt-2">
                {isSelect ? (
                    <select
                        {...(reg as any)}
                        onChange={handleChange}
                        className={`
                            block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white
                            outline-1 -outline-offset-1 outline-white/10
                            focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500
                            ${className}
                        `}
                        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
                    >
                        {children}
                    </select>
                ) : (
                    <input
                        {...reg}
                        type={type}
                        onChange={handleChange}
                        className={`
                            block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white
                            outline-1 -outline-offset-1 outline-white/10
                            focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500
                            ${className}
                        `}
                        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
                    />
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
}