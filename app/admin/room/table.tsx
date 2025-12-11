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
import { UUID } from "crypto";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import AutoComplete from "@/components/SelectField/SelectField";
import { GridRenderCellParams } from "@mui/x-data-grid";


const roomOptions = [
    { id: "deluxe", label: "Deluxe" },
    { id: "standard", label: "Standard" }
]

const statusOptions = [
    { id: "active", label: "Active" },
    { id: "inactive", label: "In-Active" },
    { id: "booked", label: "Booked" },
    { id: "dirty", label: "Dirty" },
]


const columns = [
    {
        field: "name",
        headerName: "Room Name",
        flex: 1,
        minWidth: 150,
        resizable: true,
    },
    {
        field: "type",
        headerName: "Room Type",
        minWidth: 130,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            const type = roomOptions.find(
                (item) => item.id === params.value
            );
            let bgColor = "bg-gray-300";
            switch (params.value) {
                case "deluxe":
                    bgColor = "!bg-purple-500/20";
                    break;
                case "standard":
                    bgColor = "!bg-stone-500/20";
                    break;
            }

            return (
                <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
                    {type?.label ?? params.value}
                </span>
            );
        },
    },
    {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 130,
        renderCell: (params: GridRenderCellParams) => {
            const status = statusOptions.find(
                (item) => item.id === params.value
            );

            let bgColor = "bg-gray-300";

            switch (params.value) {
                case "active":
                    bgColor = "!bg-green-500/20";
                    break;
                case "inactive":
                    bgColor = "!bg-gray-400/20";
                    break;
                case "booked":
                    bgColor = "!bg-blue-500/20";
                    break;
                case "dirty":
                    bgColor = "!bg-red-500/20";
                    break;
            }

            return (
                <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
                    {status?.label ?? params.value}
                </span>
            );
        },
    }
];

type TRoom = {
    id?: UUID;
    name: string;
    type: string;
    sequence: number;
    status: string;
}

type TRequest = {
    method: "post" | "put",
    url: string,
    data: TRoom
}

const useRoomMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ method, url, data }: TRequest) =>
            apiService[method](url, data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['rooms'] }),
    });
};

export default function RoomsTable() {
    const [open, setOpen] = useState<boolean>(false)

    const [formData, setFormData] = useState<TRoom>({ status: "active" } as TRoom)

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const { mutate, isPending } = useRoomMutation()

    const handleAddRoom = () => {
        setOpen(true)
    }
    const closeDrawer = () => {
        setOpen(false)
        setFormData({ status: "active" } as TRoom)
    }

    const handleEditRoom = ({ row }: { row: TRoom }) => {
        setFormData({
            ...row,
            type: row.type,
        });
        setOpen(true);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate(
            {
                method: formData.id ? 'put' : 'post',
                url: formData.id ? `/room/${formData.id}/` : '/room/',
                data: formData,
            },
            { onSuccess: closeDrawer }
        );
    };
    return (
        <>
            <Drawer anchor="right" open={open} onClose={closeDrawer}>
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="bg-background text-foreground w-80 font-nunito grid grid-rows-[50px_1fr_60px] h-full">
                        <div className="font-oswald border-b border-border p-2 flex items-center gap-2">
                            <Plus size={15} /> Add Room
                        </div>
                        <div className="">
                            <div className=" p-2 flex flex-col gap-2 ">
                                <TextField
                                    label="Room Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <AutoComplete
                                    name="type"
                                    label="Room Type"
                                    options={roomOptions}
                                    value={formData.type}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Sequence"
                                    type="number"
                                    name="sequence"
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />
                                <AutoComplete
                                    name="status"
                                    label="Room Status"
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between p-3">
                            <Button className="" onClick={closeDrawer} variant={"ghost"}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : formData.id ? "Update" : "Add"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Drawer>
            <DataTable
                queryKey="rooms"
                url="/room/"
                title="Room"
                onRowClick={handleEditRoom}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Room</>}
                onButtonClick={handleAddRoom}
            />
        </>
    );
}
