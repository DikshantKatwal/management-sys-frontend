"use client"

import DataTable from "@/components/DataTable/Datatable";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api";
import Drawer from "@mui/material/Drawer";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TGuest, TUser } from "@/types/CommonType";
import { formatDate } from "@/lib/utils";
import AutoComplete from "@/components/SelectField/SelectField";

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



export default function GuestCreateView() {
    const [open, setOpen] = useState<boolean>(false)

    const useGuestMutation = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: ({ method, url, data }: TRequest) =>
                apiService[method](url, data),
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ['guests'] }),
        });
    };

    const columns = useMemo(() => [
        {
            field: "full_name",
            headerName: "Profile",
            minWidth: 150,
            flex: 2,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <span className={`flex h-full items-center gap-3`}>
                        <img
                            alt=""
                            src={params?.row?.avatar}
                            className="size-10  object-cover z-0 rounded-full"
                        />
                        <span className="flex flex-col h-full justify-center">
                            <span className="leading-tight">
                                {params?.row?.full_name ?? "—"}

                            </span>
                            <span className="text-xs font-extralight">
                                {params?.row?.email ?? "—"}
                            </span>
                        </span>
                    </span>
                );
            },
        },
        {
            field: "identification",
            headerName: "Identification",
            minWidth: 120,
            flex: 1,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => {
                let bgColor = "";
                switch (params?.row?.guest.identification) {
                    case "passport":
                        bgColor = "!bg-purple-500/20";
                        break;
                    case "national_id":
                        bgColor = "!bg-pink-500/20";
                        break;
                }
                return (
                    <span>
                        <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
                            {identificationType.find((value) => (value.id === params?.row?.guest.identification))?.label ?? "—"}
                        </span>

                    </span>
                );
            },
        },
        {
            field: "id_number",
            flex: 1,
            headerName: "Identification Number",
            minWidth: 120,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <span className="leading-tight  text-xs">
                        {params?.row?.guest.id_number ?? "—"}
                    </span>
                );
            },
        },
        {
            field: "phone",
            flex: 1,
            headerName: "Phone",
            minWidth: 120,
            resizable: true,
        },
        {
            field: "dob",
            flex: 1,
            headerName: "Date of Birth",
            minWidth: 120,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <span className={`flex items-center gap-3`}>
                        {formatDate(params?.row?.guest.dob) ?? "—"}
                    </span>
                );
            },
        },
        // {
        //     field: "role",
        //     headerName: "Employee Role",
        //     resizable: true,
        //     minWidth: 130,
        //     renderCell: (params: GridRenderCellParams) => {
        //         let bgColor = "";
        //         switch (params?.row?.employee.role) {
        //             case "admin":
        //                 bgColor = "!bg-purple-500/20";
        //                 break;
        //             case "employee":
        //                 bgColor = "!bg-stone-500/20";
        //                 break;
        //         }

        //         return (
        //             <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
        //                 {params?.row?.employee.role ?? "—"}
        //             </span>
        //         );
        //     },
        // },
    ], []);


    const [formData, setFormData] = useState<TUnifiedGuestUserRes>({} as TUnifiedGuestUserRes)

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const { mutate, isPending } = useGuestMutation()

    const handleAddGuest = () => {
        setOpen(true)
    }
    const closeDrawer = () => {
        setOpen(false)
        setFormData({} as TUnifiedGuestUserRes)
    }

    const handleEditGuest = ({ row }: { row: TGuestRes }) => {
        const { avatar, guest, ...withoutGuest } = row ?? {};
        const unifiedData = { ...withoutGuest, ...guest }
        setFormData(unifiedData);
        setOpen(true);
    };

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
        <>
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
            {/* <TextField
                label="Email"
                type="email"
                name="email"
                value={test}
                onChange={(event) => setTest(event.target.value)}
            /> */}

            <DataTable
                queryKey="guests"
                title="Guest"
                url="/guest/"
                onRowClick={handleEditGuest}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Guest</>}
                onButtonClick={handleAddGuest}
            />
        </>
    );
}
