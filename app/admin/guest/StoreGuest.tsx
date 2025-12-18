"use client"
import AutoComplete from "@/components/SelectField/SelectField";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api";
import { TGuest, TUser } from "@/types/CommonType";
import Drawer from "@mui/material/Drawer"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";



const identificationType = [
    { id: "passport", label: "Passport" },
    { id: "national_id", label: "National ID" },
    { id: "drivers_license", label: "Driver’s License" },
    { id: "voter_id", label: "Voter ID" },
    { id: "residence_permit", label: "Residence Permit" }
];

type TGuestRes = TUser & {
    guest: TGuest;
};
type TUnifiedGuestUserRes = TUser & TGuest


type TRequest = {
    method: "post" | "put",
    url: string,
    data: TGuest
}

type tStoreGuest = {
    open: boolean
    setOpen: (open: boolean) => void
    formData: TUnifiedGuestUserRes
    setFormData: Dispatch<SetStateAction<TUnifiedGuestUserRes>>

}

const StoreGuest = ({
    open,
    setOpen,
    formData,
    setFormData
}: tStoreGuest) => {
    const queryClient = useQueryClient();
    const useGuestMutation = () => {

        return useMutation({
            mutationFn: ({ method, url, data }: TRequest) =>
                apiService[method](url, data),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ['guests'] }),
        });
    };
    const { mutate, isPending } = useGuestMutation()
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const closeDrawer = () => {
        setOpen(false)
        setFormData({} as TUnifiedGuestUserRes)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate(
            {
                method: formData.id ? 'put' : 'post',
                url: formData.id ? `/user/register/guests/${formData.id}/` : '/user/register/guests/',
                data: formData,
            },
            { onSuccess: closeDrawer }
        );
    };

    return (
        <Drawer anchor="right" open={open} onClose={closeDrawer}>
            <form className="h-full" onSubmit={handleSubmit}>
                <div className="bg-background text-foreground w-110 md:w-170 font-nunito grid grid-rows-[50px_1fr_60px] h-full">

                    <div className="font-oswald border-b border-border p-2 flex items-center gap-2">
                        Add Guest
                    </div>

                    <div className="p-2 flex-col flex gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 border-t" />
                            <span className="px-2 text-sm text-muted-foreground">
                                Contact Information
                            </span>
                            <div className="flex-1 border-t" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Contact Number"
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t" />
                            <span className="px-2 text-sm text-muted-foreground">
                                General Information
                            </span>
                            <div className="flex-1 border-t" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <TextField
                                label="First Name"
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="Last Name"
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <TextField
                                label="Address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />

                        </div>

                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 border-t" />
                            <span className="px-2 text-sm text-muted-foreground">
                                Identification Information
                            </span>
                            <div className="flex-1 border-t" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <AutoComplete
                                name="identification"
                                label="Identification Type"
                                options={identificationType}
                                value={formData.identification}
                                onChange={handleInputChange}
                            />
                            <TextField
                                label="ID Number"
                                type="text"
                                name="id_number"
                                value={formData.id_number}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between p-3">
                        <Button type={"button"} onClick={closeDrawer} variant="ghost">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : formData.id ? "Update" : "Add"}
                        </Button>
                    </div>

                </div>
            </form>

        </Drawer>
    )
}
export default StoreGuest