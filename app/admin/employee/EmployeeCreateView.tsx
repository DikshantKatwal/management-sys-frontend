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
import { Pen, Plus, User } from "lucide-react";
import { FormEvent, useState } from "react";
import AutoComplete from "@/components/SelectField/SelectField";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { formatDate } from "@/lib/utils";




const employeeRoleOptions = [
    { id: "admin", label: "Admin" },
    { id: "employee", label: "Employee" },
]


const columns = [
    {
        field: "full_name",
        headerName: "Profile",
        minWidth: 200,
        flex: 1,
        resizable: true,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <span className={`flex items-center gap-3`}>
                    <img
                        alt=""
                        src={params?.row?.avatar}
                        className="size-10  object-cover z-0 rounded-full"
                    />
                    {params?.row?.full_name ?? "—"}
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
                    {params?.row?.employee.department ?? "—"}
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
                <span className={`flex items-center`}>
                    {params?.row?.employee.position ?? "—"}
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
                    {formatDate(params?.row?.employee.hire_date) ?? "—"}
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
            let bgColor = "";
            switch (params?.row?.employee.role) {
                case "admin":
                    bgColor = "!bg-purple-500/20";
                    break;
                case "employee":
                    bgColor = "!bg-stone-500/20";
                    break;
            }

            return (
                <span className={`px-2 py-1 rounded text-white text-xs font-medium ${bgColor}`}>
                    {params?.row?.employee.role ?? "—"}
                </span>
            );
        },
    },
];

type TResponseData = {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    avatar?: string | File
    email?: string;
    id?: UUID;
    user_type?: string;
    username?: string;
    position?: string;
    department?: string;
    hire_date?: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
}

type TUser = {
    id: UUID
    email: string
    first_name: string
    last_name: string
    full_name: string
    user_type: string
    employee: {
        role?: string;
        department?: string;
        position?: string;
        hire_date?: string;
    } | null
    avatar?: string;

}

type TRequest = {
    method: "post" | "put",
    url: string,
    data: any | FormData
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
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<TResponseData>({} as TResponseData)

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
        setFormData({})
        setPreview(null)
    }


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFormData((prev) => ({ ...prev, avatar: file }));

        const reader = new FileReader();
        reader.onload = (event) => setPreview(event.target?.result as string);
        reader.readAsDataURL(file);
    };


    const handleEditEmployee = ({ row }: { row: TUser }) => {
        const { avatar, employee, ...withoutEmployee } = row ?? {};

        const unifiedData = { ...withoutEmployee, ...employee }
        setFormData(unifiedData);
        if (avatar) {
            setPreview(avatar);
        }
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
                url: formData.id ? `/user/register/employees/${formData.id}/` : '/user/register/employees/',
                data: fd,
            },
            { onSuccess: closeDrawer }
        );
    };
    return (
        <>
            <Drawer color="black" anchor="right" open={open} onClose={closeDrawer}>
                <form className="h-full overflow-x-hidden" onSubmit={handleSubmit}>
                    <div className="bg-background text-foreground w-80 md:w-170 sm:120 font-nunito grid grid-rows-[50px_1fr_60px] h-full">

                        <div className="font-oswald border-b border-border p-2 flex items-center gap-2">
                            Add Employee
                        </div>

                        <div className="p-2 flex-col flex gap-3">
                            <div className="flex items-center gap-3 my-4">
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



                            <div className="grid  items-center md:grid-cols-[50px_auto_auto] gap-2">
                                <div className="relative size-13 border border-inactive rounded-full flex items-center justify-center">
                                    {preview ? (
                                        <img
                                            alt=""
                                            src={preview}
                                            className="w-full h-full object-cover z-0 rounded-full"
                                        />
                                    ) : (
                                        <span className="text-xs text-muted-foreground rounded-full ">
                                            <User />
                                        </span>
                                    )}
                                    <label className="cursor-pointer bg-background border border-black p-1 rounded-full absolute -top-1 -right-1 z-10">
                                        <Pen className="size-3" />

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
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
                            {/* <div className="grid grid-cols-1 gap-2">
                                <TextField
                                    label="Address"
                                    type="text"
                                    name="address"
                                    value={formData.sequence}
                                    onChange={handleInputChange}
                                />

                            </div> */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 border-t" />
                                <span className="px-2 text-sm text-muted-foreground">
                                    Designation Information
                                </span>
                                <div className="flex-1 border-t" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                                <AutoComplete
                                    label="Role"
                                    name="role"
                                    options={employeeRoleOptions}
                                    value={formData.role}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Department"
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Position"
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                />
                                <TextField
                                    label="Hire Date"
                                    type="date"
                                    name="hire_date"
                                    value={formData.hire_date}
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
