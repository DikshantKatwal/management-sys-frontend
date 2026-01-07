
import Autocomplete, {
    AutocompleteProps,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
type Option = {
    id: any;
    label: string;
};

type TSelect = {
    label?: string;
    name: string;
    options: Option[];
    value: any;
    onChange?: any;
} & Omit<
    AutocompleteProps<Option, false, false, false>,
    "options" | "value" | "onChange" | "renderInput"
>;
// type TSelect = {
//     params?: any
//     label: string,
//     name: string,
//     options: { id: any; label: string }[],
//     onChange?: any;
//     value: any,
// }
const AutoComplete = ({ name = "", value, label = "Label", options = [], onChange = undefined, ...params }: TSelect) => {
    const selectedOption =
        options.find(opt => opt.id === value) ?? null;

    return (
        <Autocomplete<Option, false, false, false>
            {...params}
            disablePortal
            value={selectedOption}
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(event, value) => {
                if (!value) return;

                onChange?.({
                    target: {
                        name,
                        value: value.id,   // 👈 send id
                        label: value.label // 👈 you still have the label
                    }
                });
            }}
            sx={{
                fontFamily: "Nunito, sans-serif", // ✅ root fallback
                outline: "none",

                /* INPUT ROOT (wrapper) */
                "& .MuiAutocomplete-inputRoot": {
                    paddingTop: "14px !important",
                    fontFamily: "Nunito, sans-serif",
                },

                /* OUTLINED INPUT */
                "& .MuiOutlinedInput-root": {
                    height: 48,
                    padding: 0,
                    borderRadius: "6px",
                    alignItems: "flex-start",
                    fontFamily: "Nunito, sans-serif",

                    "& input": {
                        padding: "14px 8px 4px 8px",
                        fontSize: 14,
                        fontFamily: "Nunito, sans-serif",
                    },
                    "& fieldset": {
                        border: "1px solid var(--color-border, #9ca3af)"
                    },

                    "&:hover fieldset": {
                        border: "1px solid var(--color-border, #9ca3af)"
                    },
                    "&.Mui-focused fieldset": {
                        border: (theme) =>
                            theme.palette.mode === "light"
                                ? "1px solid #707070" // darker for light mode
                                : "1px solid #302f2f", // lighter for dark mode
                    },
                },
                // MuiFormLabel-root
                /* LABEL — fixed (no float) */
                "& .MuiInputLabel-root": {
                    position: "absolute",
                    top: 4,
                    left: 8,
                    fontSize: 12,
                    fontFamily: "Nunito, sans-serif !important",
                    color: "var(--color-placeholder)",
                    transform: "none !important",
                    transition: "none !important",
                    "&.Mui-focused fieldset": {
                        border: (theme) =>
                            theme.palette.mode === "light"
                                ? "1px solid #707070" // darker for light mode
                                : "1px solid #302f2f", // lighter for dark mode
                    },
                },
                "& .MuiAutocomplete-endAdornment .MuiIconButton-root": {
                    color: "var(--color-foreground, #ffffff)",
                },
                "& .MuiInputLabel-shrink": {
                    transform: "none !important",
                },
                "& .MuiInputBase-input": {
                    color: "var(--color-foreground, #ffffff)",
                },

                "& .MuiAutocomplete-paper": {
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "16px",
                },

            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}

                    label={label}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    sx={{
                        "& input": {
                            fontFamily: "Nunito, sans-serif",
                        },
                    }}
                />
            )}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "var(--color-background, #ffffff)",
                        color: "var(--color-light-active, #ffffff)",
                        borderRadius: "12px",
                        border: "2px solid var(--color-placeholder, #ffffff)"
                    }
                },
                popper: {
                    sx: {
                        "& .MuiAutocomplete-option": {
                            backgroundColor: "var(--color-background, #ffffff)",
                            color: "var(--color-foreground, #ffffff)",
                            padding: "10px 12px",

                            "&:not(:last-of-type)": {
                                borderBottom: "1px solid var(--color-border, #ffffff)"
                            },
                        }
                    }
                }
            }}
        />
    );
};

export default AutoComplete;