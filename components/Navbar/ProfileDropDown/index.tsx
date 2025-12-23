"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NavItem from "../NavItem"
import { Settings } from "lucide-react"
import { useSidebar } from "../NavBarContext"
import { Logout } from "@mui/icons-material"
import { useQuery } from "@tanstack/react-query"
import apiService from "@/lib/api"
import { EditProfileDialog } from "./ProfileModal"

type Checked = DropdownMenuCheckboxItemProps["checked"]

type User = {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
    user_type: string
    phone: string
    employee: {
        role?: string;
        department?: string;
        position?: string;
        hire_date?: string;
    } | null
    avatar?: string;

}

export function DropdownMenuCheckboxes() {
    const { open } = useSidebar();
    const { data: userData, isLoading } = useQuery<User>({
        queryFn: () => apiService.get("/user/me"),
        queryKey: ["me"],
    });
    const [dialogOpen, setDialogOpen] = React.useState(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings />
                        <span className={`${open ? "block" : "hidden"} transition-all duration-300`}>
                            Settings
                        </span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 p-2">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                setDialogOpen(true);  // open dialog
                            }}>
                            <div className="flex gap-2 items-center">
                                <div className="size-7 bg-border rounded-full flex items-center justify-center">
                                    {/* {userData?.first_name?.[0]}
                                    {userData?.last_name?.[0]} */}
                                    <img
                                        alt=""
                                        src={userData?.avatar}
                                        className="w-full h-full object-cover z-0 rounded-full"
                                    />
                                </div>
                                <div className="flex  flex-col text-[12px]">
                                    <span>
                                        {userData?.full_name}
                                    </span>
                                    <span className="text-[10px]">
                                        {userData?.email}
                                    </span>
                                </div>
                            </div>
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Logout fontSize="small" />
                            Logout
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu >
            <EditProfileDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                userData={userData}
            />
        </>
    )
}
