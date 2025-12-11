import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
    return (
        <div className="bg-gray-200">
            <Button type="button">
                <Link href="/admin/room">
                    room
                </Link>
            </Button>
        </div>
    );
}
