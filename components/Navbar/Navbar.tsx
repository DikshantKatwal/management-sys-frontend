"use client";

import { ChevronLeft, ChevronRight, Home, FileText, Moon, Sun, DoorOpen, Users, IdCard, CheckCheck, DoorClosed } from "lucide-react";
import { useSidebar } from "./NavBarContext";
import { useTheme } from "next-themes";
import NavItem from "./NavItem";
import { DropdownMenuCheckboxes } from "./ProfileDropDown";

export default function SlideNav() {
    const { open, toggle } = useSidebar();
    const { theme, setTheme } = useTheme();

    return (
        <aside
            className={`
            h-full
            
                transition-all duration-300 ease-in-out
                ${open ? "md:w-46 w-30" : "sm:w-12 w-0"}
            `}
        ><div className="h-full grid grid-rows-[1fr_auto]">

                <nav className="p-1 py-2 sm:p-2">
                    <div className="sm:block hidden">
                        <NavItem
                            icon={open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            type="button" onClick={toggle}
                            label="Sidebar" open={open}
                        />
                    </div>
                    <NavItem
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        icon={
                            <>
                                <Moon size={18}
                                    className="hidden w-4 h-4 dark:block" />
                                <Sun size={18} className="w-4 h-4 dark:hidden" />
                            </>
                        }
                        label="Mode"
                        open={open} />
                    <NavItem icon={<Home size={18} />}
                        label="Home"
                        type="link"
                        link="/admin/"
                        open={open} />
                    <NavItem
                        icon={<DoorClosed size={18} />}
                        type="link"
                        link="/admin/room-type"
                        label="Room Type" open={open} />
                    <NavItem
                        icon={<DoorOpen size={18} />}
                        type="link"
                        link="/admin/room"
                        label="Room" open={open} />
                    <NavItem
                        icon={<Users size={18} />}
                        type="link"
                        link="/admin/guest"
                        label="Guest" open={open} />
                    <NavItem
                        icon={<IdCard size={18} />}
                        type="link"
                        link="/admin/employee"
                        label="Employee" open={open} />

                    <NavItem
                        icon={<CheckCheck size={18} />}
                        type="link"
                        link="/admin/check-in"
                        label="Check Ins" open={open} />

                    <NavItem
                        icon={<CheckCheck size={18} />}
                        type="link"
                        link="/admin/reservation"
                        label="Reservation" open={open} />
                    <NavItem icon={<FileText size={18} />} label="Notes" open={open} />
                </nav>
                <nav className="p-1 py-2 sm:p-2">
                    <DropdownMenuCheckboxes />
                    {/* <NavItem icon={<Settings size={18} />} label="Settings" open={open} /> */}
                </nav>
            </div>
        </aside>
    );
}
