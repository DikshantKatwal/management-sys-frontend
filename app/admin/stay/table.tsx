"use client"

import Datatable from "@/components/DataTable/Datatable";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from "@/lib/utils";
import Drawer from "@mui/material/Drawer";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const statusOptions = [
    { id: "hold", label: "Hold" },
    { id: "confirmed", label: "Confirmed" },
    { id: "checked_in", label: "Checked In" },
    { id: "checked_out", label: "Checked Out" },
    { id: "cancelled", label: "Cancelled" },
    { id: "no_show", label: "No show" },
]


const StayTable = () => {
    const isPending = true
    const [formData, setFormData] = useState<any>()
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "guest",
            headerName: "Guest Name",
            minWidth: 200,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => (
                <span className={`flex h-full items-center gap-3`}>
                    <img
                        alt=""
                        src={params?.row?.reservation?.guest?.user?.avatar}
                        className="size-10 min-w-10  object-cover z-0 rounded-full"
                    />
                    <span className="flex flex-col h-full justify-center">
                        <span className="leading-tight">
                            {params?.row?.reservation?.guest?.user?.full_name ?? "—"}

                        </span>
                        <span className="text-xs font-extralight">
                            {params?.row?.reservation?.guest?.user?.phone ?? "—"}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            field: "expected_check_in_out_date",
            sortable: false,
            editable: false,
            headerName: "Expected Check In / Out Date",
            minWidth: 210,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {formatDateTime(params.row.reservation.check_in_date)} - {formatDateTime(params.row.expected_check_out_date)}
                </span>
            ),
        },
        {
            field: "real_check_in_out_date",
            headerName: "Check In / Out Date",
            flex: 1,
            minWidth: 220,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {formatDateTime(params.row.checked_in_at)} - {formatDateTime(params.row.checked_out_at)}
                </span>
            ),
        },
        {
            field: "room",
            headerName: "Room",
            minWidth: 80,
            resizable: true,
            valueGetter: (value, row) => {
                const roomNumber = row?.room?.number ?? "";
                return `${roomNumber}`;
            },
            renderCell: (params) => (
                <span className="text-xs font-medium">
                    {params.value}
                </span>
            ),
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
                    case "hold":
                        bgColor = "!bg-green-500/20";
                        break;
                    case "confirmed":
                        bgColor = "!bg-gray-400/20";
                        break;
                    case "checked_in":
                        bgColor = "!bg-blue-500/20";
                        break;
                    case "checked_out":
                        bgColor = "!bg-red-500/20";
                        break;
                    case "cancelled":
                        bgColor = "!bg-purple-500/20";
                        break;
                    case "no_show":
                        bgColor = "!bg-pink-500/20";
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
    ], []);


    function handleAddStay() {
        setDrawerOpen(true)
    }

    function handleEditStay() {

    }
    function closeDrawer() {

    }
    function handleSubmit(e: FormEvent) {
        e.preventDefault();
    }
    return (
        <>
            <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="bg-background text-foreground w-80 font-nunito grid grid-rows-[50px_1fr_60px] h-full">
                        <div className="font-oswald border-b border-border p-2 flex items-center gap-2">
                            <Plus size={15} /> Add Stay
                        </div>
                        <div className="">
                            <div className=" p-2 flex flex-col gap-2 ">

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
            <Datatable
                queryKey="stays"
                url="/stay/stays/"
                title="Stay"
                onRowClick={handleEditStay}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Stay</>}
                onButtonClick={handleAddStay}
            />
        </>
    )
}
export default StayTable