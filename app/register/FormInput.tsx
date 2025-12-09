import React, { useState } from "react";
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
    type?: InputTypes;
    className?: string;
    children?: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    rules?: RegisterOptions<T, Path<T>>;
    removable?: boolean;

    removeCallback?: () => void;    
} & React.InputHTMLAttributes<HTMLInputElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>;


type InputTypes = 
  | "text"
  | "number"
  | "date"
  | "time"
  | "select"
  | "url"
  | "email"
  | "file"
  | "checkbox"
  | "password";

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
    removable,
    removeCallback,
    ...rest
}: BaseProps<T>) {
    
    const reg = rules ? register(name,rules) : register(name);
    const [checked, setChecked] = React.useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        reg.onChange(e); // RHF handling
        onChange?.(e);   // custom logic
    };

    const isSelect = type === "select";
    const isCheckbox = type === "checkbox";

    return (
        <div className="w-full">
            {!isCheckbox && <label className="block text-sm font-medium text-gray-100">
                {label}
            </label>}

            <div className="mt-2 flex items-center gap-2">
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
                        defaultValue={rest.defaultValue}
                        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
                    >
                        {children}
                    </select>
                ) : 
                isCheckbox ? (
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-100"> 
                        {label}
                        <input type="checkbox" {...reg} onChange={(e) => {handleChange(e); setChecked(e.target.checked)}} className="sr-only"
                        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} /> 
                        <span className={` w-5 h-5 flex-shrink-0 rounded border-2 border-white/50 flex items-center justify-center bg-transparent ${className} `}> 
                        {checked && ( <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" > 
                            <path d="M5 13l4 4L19 7" /> </svg> )} 
                        </span> 
                    </label>
                ) :
                (
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
                {removable && <button className="text-gray-100" onClick={removeCallback} type="button">Usuń</button>}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
    );
}