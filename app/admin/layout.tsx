// app/layout.tsx (SERVER COMPONENT)

import SlideNav from "@/components/Navbar/Navbar";
import { SidebarProvider } from "@/components/Navbar/NavBarContext";
import { Send } from "lucide-react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-rows-[40px_1fr] bg-theme-normal">
            {/* Top bar */}
            <div className="flex gap-2 items-center px-4 font-semibold">
                <Send size={15} />  Check-Ins
            </div>
            {/* Content */}
            <SidebarProvider>
                <div className="grid grid-cols-[auto_1fr] h-full">
                    <SlideNav />
                    <main className="min-w-0 flex">
                        <div className="flex-1 min-w-0 p-4 m-2 rounded-lg bg-background shadow-[0_0_5px] shadow-border">
                            {children}
                        </div>
                    </main>
                </div>

            </SidebarProvider>
        </div>
    );
}
