"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function NavItem({
    icon,
    label,
    open,
    onClick,
    type,
    link,
}: {
    icon: React.ReactNode;
    label: string;
    open: boolean;
    onClick?: () => void
    type?: "button" | "link"
    link?: string
}) {
    const router = useRouter();
    return (
        <div onClick={type == "button" ? onClick : type == "link" && link ? () => router.push(link) : undefined} className="flex items-center py-1 rounded cursor-pointer">
            <Button variant="ghost" className="gap-2 md:gap-3 w-full justify-start max-md:pl-1!">
                {icon}
                <span className={`${open ? "block" : "hidden"} transition-all duration-300`}>
                    {label}
                </span>
            </Button>
        </div>
    );
}
