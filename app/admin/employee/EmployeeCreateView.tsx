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
import { formatDate } from "@/lib/utils";


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
        field: "full_name",
        headerName: "Profile",
        minWidth: 200,
        flex: 1,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            console.log(params?.row.user?.full_name)
            return (
                <span className={`flex items-center gap-3`}>
                    <img
                        alt=""
                        src={params?.row.user?.avatar}
                        className="size-10  object-cover z-0 rounded-full"
                    />
                    {params?.row.user?.full_name ?? "—"}
                </span>
            );
        },
    },
    {
        field: "department",
        headerName: "Department",
        minWidth: 100,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <span className={`flex items-center gap-3`}>
                    {params?.value ?? "—"}
                </span>
            );
        },
    },
    {
        field: "position",
        headerName: "Position",
        minWidth: 100,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <span className={`flex items-center gap-3`}>
                    {params?.value ?? "—"}
                </span>
            );
        },
    },
    {
        field: "hire_date",
        headerName: "Hire Date",
        minWidth: 120,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <span className={`flex items-center gap-3`}>
                    {formatDate(params?.value) ?? "—"}
                </span>
            );
        },
    },
    {
        field: "role",
        headerName: "Employee Role",
        resizable: true,
        minWidth: 130,
        renderCell: (params: GridRenderCellParams) => {
            const type = roomOptions.find(
                (item) => item.id === params.value
            );
            let bgColor = "bg-gray-300";
            switch (params.value) {
                case "admin":
                    bgColor = "!bg-purple-500/20";
                    break;
                case "employee":
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
];

type TEmployee = {
    id?: UUID;
    name: string;
    type: string;
    sequence: number;
    status: string;
}

type TRequest = {
    method: "post" | "put",
    url: string,
    data: TEmployee
}

const useEmployeeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ method, url, data }: TRequest) =>
            apiService[method](url, data),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['employees'] }),
    });
};

export default function EmployeeCreateView() {
    const [open, setOpen] = useState<boolean>(false)

    const [formData, setFormData] = useState<TEmployee>({ status: "active" } as TEmployee)

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const { mutate, isPending } = useEmployeeMutation()

    const handleAddEmployee = () => {
        setOpen(true)
    }
    const closeDrawer = () => {
        setOpen(false)
        setFormData({ status: "active" } as TEmployee)
    }

    const handleEditEmployee = ({ row }: { row: TEmployee }) => {
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
                url: formData.id ? `/employee/${formData.id}/` : '/employee/',
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
                            Add Employee
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
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Contact Number"
                                    type="number"
                                    name="phone"
                                    value={formData.sequence}
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
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Last Name"
                                    type="text"
                                    name="last_name"
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <TextField
                                    label="Address"
                                    type="text"
                                    name="address"
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />

                            </div>
                        </div>

                        <div className="flex justify-between p-3">
                            <Button onClick={closeDrawer} variant="ghost">
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
                queryKey="employees"
                url="/employee/"
                title={"Employee"}
                onRowClick={handleEditEmployee}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Employee</>}
                onButtonClick={handleAddEmployee}
            />
        </>
    );
}
