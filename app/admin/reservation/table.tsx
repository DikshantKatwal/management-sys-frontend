"use client"

import Datatable from "@/components/DataTable/Datatable";
import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import Drawer from "@mui/material/Drawer";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const ReservationTable = () => {
    const isPending = true
    const [formData, setFormData] = useState<any>()
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const columns = useMemo<GridColDef[]>(() => [
        {
            field: "room_type",
            headerName: "Room Type",
            minWidth: 130,
            resizable: true,
            // valueGetter: (params: GridRenderCellParams) => {
            //     const roomType = roomTypeOptions.find(
            //         (item) => item.id === params
            //     );
            //     return roomType?.label || <Skeleton />;
            // },
            renderCell: (params: GridRenderCellParams) => (
                <span className="text-xs font-medium">
                    {params.value}
                </span>
            ),
        },
        {
            field: "room",
            headerName: "Room",
            flex: 1,
            minWidth: 150,
            resizable: true,
        },
        {
            field: "room_type",
            headerName: "Room Type",
            flex: 1,
            minWidth: 130,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <span
                        className={`px-2 py-1 rounded text-white text-xs font-medium`}
                    >
                        asd
                    </span>
                );
            },
        },
    ], []);


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
                queryKey="rooms"
                url="/room/"
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