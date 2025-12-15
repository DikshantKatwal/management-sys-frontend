"use client"

import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { useSidebar } from "../Navbar/NavBarContext";

const TopBar = () => {
    const { open, toggle } = useSidebar();


    return (
        <div className="flex gap-2 items-center px-4 font-semibold">
            <div className="sm:hidden">
                {open ? <ChevronLeft size={18} onClick={toggle} /> : <ChevronRight size={18} onClick={toggle} />}
            </div>

            <Send size={15} />  Check-Ins
        </div>
    )
}
export default TopBar