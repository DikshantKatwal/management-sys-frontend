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
import { Pen, Plus, User } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TGuest, TUser } from "@/types/CommonType";
import { formatDate } from "@/lib/utils";
import AutoComplete from "@/components/SelectField/SelectField";
import { Calendar } from "@/components/ui/calendar";
import ImageViewer from "@/components/customUI/imageViewer";

const identificationType = [
    { id: "passport", label: "Passport" },
    { id: "national_id", label: "National ID" },
    { id: "drivers_license", label: "Driver’s License" },
    { id: "voter_id", label: "Voter ID" },
    { id: "residence_permit", label: "Residence Permit" },
    { id: "other", label: "Other" },
];

type TGuestRes = TUser & {
    guest: TGuest;
};
type TUnifiedGuestUserRes = TUser & TGuest


type TRequest = {
    method: "post" | "put",
    url: string,
    data: any
}



export default function GuestCreateView() {
    const [open, setOpen] = useState<boolean>(false)
    const [preview, setPreview] = useState<string | File | undefined>(undefined);

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
                            className="size-10 min-w-10  object-cover z-0 rounded-full"
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
                        bgColor = "!bg-yellow-500/20";
                        break;
                    case "drivers_license":
                        bgColor = "!bg-pink-500/20";
                        break;
                    case "voter_id":
                        bgColor = "!bg-green-500/20";
                        break;
                    case "residence_permit":
                        bgColor = "!bg-cyan-500/20";
                        break;
                    case "other":
                        bgColor = "!bg-white-500/20";
                        break;
                }
                const identificationTypeLabel = identificationType.find((value) => (value.id === params?.row?.guest.identification))?.label ?? "—"

                return (
                    <span>
                        <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
                            {identificationTypeLabel}
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
    ], []);


    const [formData, setFormData] = useState<TUnifiedGuestUserRes>({} as TUnifiedGuestUserRes)

    const [viewerImage, setViewerImage] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData((prev) => ({ ...prev, avatar: file }));

        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target?.result as string);
        reader.readAsDataURL(file);
    };


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
        setPreview(avatar)
        setFormData(unifiedData);
        setOpen(true);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value as any);
            }
        });
        mutate(
            {
                method: formData.id ? 'put' : 'post',
                url: formData.id ? `/user/register/guests/${formData.id}/` : '/user/register/guests/',
                data: fd,
            },
            { onSuccess: closeDrawer }
        );
    };
    return (
        <>

            <Drawer color="black" anchor="right" open={open} onClose={closeDrawer}>
                <ImageViewer
                    image={viewerImage}
                    onClose={() => setViewerImage(null)}
                />
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="bg-background text-foreground w-110 md:w-170 font-nunito grid grid-rows-[50px_1fr_60px] h-full">

                        <div className="font-oswald border-b border-border p-2 flex items-center gap-2">
                            Add Guest
                        </div>

                        <div className="p-2 flex-col flex gap-3">
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 border-t" />
                                <span className="px-2 text-sm text-accent-foreground">
                                    Contact Information
                                </span>
                                <div className="flex-1 border-t" />
                            </div>

                            <div className="grid grid-cols-[auto_1fr] gap-2">
                                <div className="relative size-26 border border-muted-foreground rounded-sm flex items-center justify-center overflow-hidden">
                                    {preview ? (
                                        <img
                                            onClick={() => setViewerImage(String(preview))}
                                            alt=""
                                            src={preview}
                                            className="w-full h-full object-cover z-0"
                                        />
                                    ) : (
                                        <span className="text-xs text-muted-foreground ">
                                            <User />
                                        </span>
                                    )}
                                    <label className="cursor-pointer  text-foreground hover:text-accent bg-muted-foreground p-1 rounded-[0_0_0_8] absolute top-0 right-0 z-10">

                                        {preview ? <Pen className="size-4" /> : <Plus className="size-4" />}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                                <div className="grid grid-rows-2 gap-2">
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
                            </div>
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 border-t" />
                                <span className="px-2 text-sm text-muted-foreground">
                                    General Information
                                </span>
                                <div className="flex-1 border-t" />
                            </div>
                            <div className="grid items-center md:grid-cols-2 gap-2">
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
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
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
