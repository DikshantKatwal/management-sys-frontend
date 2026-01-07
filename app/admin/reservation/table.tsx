"use client"

import Datatable from "@/components/DataTable/Datatable";
import AutoComplete from "@/components/SelectField/SelectField";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Drawer from "@mui/material/Drawer";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
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


const ReservationTable = () => {
    const isPending = true
    const [formData, setFormData] = useState<any>({
        "check_in_date": "",
        "check_out_date": "",
        "adults": 1,
        "children": 0,
        "status": "hold",
        "notes": "",
        "guest_id": null,
        "room_id": null,
        "room_type_id": null
    })
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "guest_name",
            headerName: "Guest Name",
            minWidth: 130,
            resizable: true,
            // valueGetter: (params: GridRenderCellParams) => {
            //     const roomType = roomTypeOptions.find(
            //         (item) => item.id === params
            //     );
            //     return roomType?.label || <Skeleton />;
            // },
            renderCell: (params: GridRenderCellParams) => (
                <span className={`flex h-full items-center gap-3`}>
                    <img
                        alt=""
                        src={params?.row?.guest?.user?.avatar}
                        className="size-10 min-w-10  object-cover z-0 rounded-full"
                    />
                    <span className="flex flex-col h-full justify-center">
                        <span className="leading-tight">
                            {params?.row?.guest?.user.full_name ?? "—"}

                        </span>
                        <span className="text-xs font-extralight">
                            {params?.row?.guest.user.phone ?? "—"}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            field: "check_in_date",
            headerName: "Check In Date",
            minWidth: 130,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {formatDate(params.value)}
                </span>
            ),
        },
        {
            field: "check_out_date",
            headerName: "Check Out Date",
            minWidth: 130,
            resizable: true,
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {formatDate(params.value)}
                </span>
            ),
        },
        {
            field: "adults",
            headerName: "Adults / Children",
            minWidth: 150,
            resizable: true,
            valueGetter: (value, row) => {
                const adultCount = row.adults ?? "0";
                const childrenCount = row?.choldrens ?? "0";
                return `${adultCount} / ${childrenCount}`;
            },
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {params.value}
                </span>
            ),
        },
        {
            field: "room_type",
            headerName: "Room Type / Number",
            minWidth: 160,
            resizable: true,
            valueGetter: (value, row) => {
                const roomTypeLabel = row.room_type?.name ?? "";
                const roomNumber = row?.room?.number ?? "—";
                return `${roomTypeLabel} / ${roomNumber}`;
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


    const { data: roomTypes = [] } = useQuery<any[]>({
        queryKey: ['room-type'],
        queryFn: () =>
            apiService.get(
                "/room/type"
            ),
    });

    const { data: rooms = [] } = useQuery<any[]>({
        queryKey: ['rooms', formData.room_type_id],
        enabled: !!formData.room_type_id,
        queryFn: () =>
            apiService.get(
                `/room/?room_type=${formData.room_type_id}`
            ),
    });


    const { data: guests = [] } = useQuery<any[]>({
        queryKey: ['guests'],
        queryFn: () =>
            apiService.get(
                "/guest/"
            ),
    });

    const roomTypeOptions = roomTypes.map((roomType) => ({
        id: roomType.id,
        label: roomType.name
    }))

    const roomsOptions = rooms.map((room) => ({
        id: room.id,
        label: room.number
    }))

    const guestsOptions = guests.map((guest) => ({
        id: guest.id,
        label: guest.full_name
    }))
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    function handleAddReservation() {
        setDrawerOpen(true)
    }

    function handleEditReservation() {

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
                            <Plus size={15} /> Add Reservation
                        </div>
                        <div className="">
                            <div className=" p-2 flex flex-col gap-2 ">
                                <AutoComplete
                                    name="guest_id"
                                    label="Guest"
                                    options={guestsOptions}
                                    value={formData.guest_id}
                                    onChange={handleInputChange}
                                />
                                <AutoComplete
                                    name="room_type_id"
                                    label="Room Type"
                                    options={roomTypeOptions}
                                    value={formData.room_type_id}
                                    onChange={handleInputChange}
                                />
                                <AutoComplete
                                    name="room_id"
                                    label="Room Number"
                                    options={roomsOptions}
                                    noOptionsText="No rooms available"
                                    disabled={!formData.room_type_id}
                                    value={formData.room_id}
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
            <Datatable
                queryKey="reservations"
                url="/stay/reservations/"
                title="Reservation"
                onRowClick={handleEditReservation}
                columns={columns}
                buttonChildren={<><Plus fontSize="small" /> Add Reservation</>}
                onButtonClick={handleAddReservation}
            />
        </>
    )
}
export default ReservationTable