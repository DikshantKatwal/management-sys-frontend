import { ChangeEventHandler, Fragment, HTMLAttributes, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode, useState } from "react";
import { ClassNameValue, twMerge } from "tailwind-merge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { formatDate } from "@/lib/utils";

interface TextFieldProps {
    label?: string;
    name: string;
    value?: string | number | readonly string[] | undefined | any
    labelIcon?: ReactNode
    type?: HTMLInputTypeAttribute;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    className?: ClassNameValue
    textSize?: number
    disabled?: boolean
}

const TextField = ({ value = "", disabled, name, label = "Label", type = "text", onChange, labelIcon, className, textSize = 16 }: TextFieldProps) => {
    const [openDate, setOpenDate] = useState(false)

    if (type === "date") {
        const parsedDate =
            typeof value === "number"
                ? new Date(value * 1000)
                : typeof value === "string" && /^\d+$/.test(value)
                    ? new Date(Number(value) * 1000)
                    : value
                        ? new Date(value)
                        : undefined;


        return (
            <Fragment>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            disabled={disabled}
                            className={twMerge(
                                `relative border h-12 rounded-sm w-full text-left px-2
                            ${disabled
                                    ? "border-inactive/10 text-foreground/50 cursor-not-allowed"
                                    : "border-inactive hover:border-light-active/50"
                                }`,
                                className
                            )}
                        >
                            <span
                                style={{ fontSize: textSize }}
                                className="absolute bottom-1 left-2"
                            >
                                {value ? formatDate(String(value)) : ""}
                            </span>

                            <label className="flex items-center text-[12px] absolute top-0 left-2 text-placeholder">
                                {labelIcon}
                                {label}
                            </label>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent sideOffset={8} className="w-auto p-0 z-1500" align="start">
                        <Calendar
                            mode="single"

                            selected={parsedDate}
                            onSelect={(selectedDate) => {
                                if (!selectedDate) return;
                                const y = selectedDate.getFullYear()
                                const m = String(selectedDate.getMonth() + 1).padStart(2, "0")
                                const d = String(selectedDate.getDate()).padStart(2, "0")

                                onChange?.({
                                    target: {
                                        name,
                                        value: `${y}-${m}-${d}`,
                                    },
                                } as React.ChangeEvent<HTMLInputElement>);
                                setOpenDate(false);
                            }}
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
            </Fragment>
        )
    }
    return (

        <div className={twMerge(
            `relative border h-12  ${disabled ? "border-inactive/70 text-foreground/60" : "border-foreground/70"} rounded-sm  w-full has-[input:focus]:border-light-active/50 `,
            className
        )}>
            <input
                onChange={onChange}
                type={type}
                name={name}
                disabled={disabled}
                placeholder=" "
                value={value ?? ""}
                style={{ fontSize: textSize }}
                className={`peer absolute bottom-0 pr-2 mb-1 pt-3 pl-1 left-0 outline-none w-full bg-transparent ${disabled ? "cursor-not-allowed" : ""}`}
            />
            <label className="flex items-center text-[12px] absolute text-light-active top-0 left-1 transition-colors peer-focus:text-accent-foreground">
                {labelIcon}
                {label}
            </label>
        </div>
    );
};

export default TextField;



// import { ChangeEventHandler, HTMLAttributes, HTMLInputTypeAttribute, ReactNode } from "react";
// import { ClassNameValue, twMerge } from "tailwind-merge";

// interface TextFieldProps {
//     label?: string;
//     labelIcon?: ReactNode
//     type?: HTMLInputTypeAttribute;
//     onChange?: ChangeEventHandler<HTMLInputElement>;
//     className?: ClassNameValue
// }

// const TextField = ({ label = "Label", type = "text", onChange, labelIcon, className }: TextFieldProps) => {
//     return (
//         <div className={twMerge(
//             `relative border border-inactive rounded-sm m-1 w-full has-[input:focus]:border-light-active/50 `,
//             className
//         )}>
//             <input
//                 onChange={onChange}
//                 type={type}
//                 placeholder=" "
//                 className="peer pt-5 pl-1 pb-1 outline-none w-full bg-transparent text-[16px]"
//             />
//             <label className="flex items-center text-[12px] absolute text-placeholder top-0 left-1 transition-colors peer-focus:text-light-active">
//                 {labelIcon}
//                 {label}
//             </label>
//         </div>
//     );
// };

// export default TextField;
