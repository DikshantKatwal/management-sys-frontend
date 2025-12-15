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
import { FormEvent, useState } from "react";

type TRoomType = {
    id?: UUID;
    name: string;
    max_occupancy: number;
    base_rate: number;
    description: string;
}

type TRequest = {
    method: "post" | "put",
    url: string,
    data: TRoomType
}

const columns = [
    {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 150,
        resizable: true,
    },
    {
        field: "max_occupancy",
        headerName: "Maximum Occupancy",
        flex: 1,
        minWidth: 150,
        resizable: true,
    },
    {
        field: "base_rate",
        headerName: "Base Rate",
        flex: 1,
        minWidth: 150,
        resizable: true,
    },

]

const useRoomTypeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ method, url, data }: TRequest) =>
            apiService[method](url, data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['room-type'] }),
    });
};

export default function RoomTypesTable() {
    const [open, setOpen] = useState<boolean>(false)
    const [formData, setFormData] = useState<TRoomType>({ max_occupancy: 2 } as TRoomType)
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const { mutate, isPending } = useRoomTypeMutation()

    const handleAddRoomType = () => {
        setOpen(true)
    }
    const closeDrawer = () => {
        setOpen(false)
        setFormData({ max_occupancy: 2 } as TRoomType)
    }

    const handleEditRoomType = ({ row }: { row: TRoomType }) => {
        setFormData({
            ...row,
        });
        setOpen(true);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        mutate(
            {
                method: formData.id ? 'put' : 'post',
                url: formData.id ? `/room/type/${formData.id}/` : '/room/type/',
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
                            <Plus size={15} /> Add RoomType
                        </div>
                        <div className="">
                            <div className=" p-2 flex flex-col gap-2 ">
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    label="Maximum Occcupancy"
                                    type="number"
                                    name="max_occupancy"
                                    value={formData.max_occupancy}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Base Rate"
                                    type="number"
                                    name="base_rate"
                                    value={formData.base_rate}
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
                queryKey="room-type"
                url="/room/type/"
                title="Room Type"
                onRowClick={handleEditRoomType}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Room Type</>}
                onButtonClick={handleAddRoomType}
            />
        </>
    );
}
