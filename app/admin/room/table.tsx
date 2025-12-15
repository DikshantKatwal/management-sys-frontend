"use client"

import DataTable from "@/components/DataTable/Datatable";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api";
import Drawer from "@mui/material/Drawer";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { UUID } from "crypto";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import AutoComplete from "@/components/SelectField/SelectField";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Skeleton from "@mui/material/Skeleton";


const statusOptions = [
    { id: "available", label: "Available" },
    { id: "occupied", label: "Occupied" },
    { id: "out_of_order", label: "Out of order" },
    { id: "cleaning", label: "Cleaning" },
]

type TRoom = {
    id?: UUID;
    number: string;
    room_type: string;
    floor: string;
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
    const { data: roomTypes = [] } = useQuery<any[]>({
        queryKey: ['room-type'],
        queryFn: () =>
            apiService.get(
                "/room/type"
            ),
    });

    const roomTypeOptions = roomTypes.map((roomType) => ({
        id: roomType.id,
        label: roomType.name
    }))

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "number",
            headerName: "Room Number",
            flex: 1,
            minWidth: 150,
            resizable: true,
        },
        {
            field: "room_type",
            headerName: "Room Type",
            minWidth: 130,
            resizable: true,
            valueGetter: (params: GridRenderCellParams) => {
                const roomType = roomTypeOptions.find(
                    (item) => item.id === params
                );
                return roomType?.label || <Skeleton />;
            },
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {params.value}
                </span>
            ),
        },
        {
            field: "floor",
            headerName: "Room Floor",
            flex: 1,
            minWidth: 150,
            resizable: true,
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
                    case "available":
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
                    <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}
                    >
                        {status?.label}
                    </span>
                );
            },
        },
    ], [roomTypeOptions, statusOptions]);
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
            room_type: row.room_type,
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
                                    label="Room Number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                />
                                <AutoComplete
                                    name="room_type"
                                    label="Room Type"
                                    options={roomTypeOptions}
                                    value={formData.room_type}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Sequence"
                                    type="number"
                                    name="sequence"
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Room Floor"
                                    name="floor"
                                    value={formData.floor}
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
