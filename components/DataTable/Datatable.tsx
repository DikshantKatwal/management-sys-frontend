"use client";

import { DataGrid, type DataGridProps } from "@mui/x-data-grid";
import { BedRounded } from "@mui/icons-material";
import { Button } from "../ui/button";
import TextField from "../TextField";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import apiService from "@/lib/api";
import React, { memo } from "react";

type DataTableProps = {
    queryKey: string;
    url: string;
    columns: any[];
    title: string;
    buttonChildren?: React.ReactNode;
    onButtonClick: () => void;
} & DataGridProps;


const DataTable = ({
    queryKey,
    url,
    columns,
    buttonChildren,
    onButtonClick,
    title,
    ...dataGridProps
}: DataTableProps) => {
    const [searchValue, setSearchValue] = useState<string>("")

    const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 200);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const queryKeyFinal = debouncedSearch
        ? [queryKey, debouncedSearch]
        : [queryKey];



    const { data: rows, isLoading } = useQuery<any[]>({
        queryKey: queryKeyFinal,
        queryFn: () =>
            apiService.get(
                debouncedSearch ? `${url}?search=${debouncedSearch}` : url
            ),
    });


    const DataTable = useMemo(() => {
        return (
            <DataGrid
                {...dataGridProps}
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                loading={isLoading}
                filterMode="server"
                slotProps={{
                    loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                    },
                }}
                disableRowSelectionOnClick
            // density="compact"
            />
        )
    }, [rows, columns])
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    return (
        <div className="flex flex-col gap-2">
            <div className=" flex justify-between">
                <div className="font-nunito font-semibold w-40">
                    <h2 className=""><BedRounded /> {title}</h2>
                    {/* <TextField
                        label="search"
                        labelIcon={<Search size={10} />}
                        className="h-9"
                        textSize={14}
                    /> */}
                </div>
                <div>
                    {buttonChildren &&
                        <Button onClick={onButtonClick} className="font-nunito font-semibold">{buttonChildren}</Button>
                    }
                </div>
            </div>
            <div className=" flex justify-between ">
                <div className="font-nunito font-semibold w-40">
                    <TextField
                        label="search"
                        labelIcon={<Search size={10} />}
                        className="h-10 w-60"
                        textSize={14}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full h-[60vh] min-w-0 overflow-auto bg-white rounded-lg">
                {DataTable}
            </div>
        </div>
    );
}
export default memo(DataTable)