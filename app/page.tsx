import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/theme/theme-toggle";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen font-oswald grid grid-rows-[auto_1fr_auto]">

      <Button type="button">
        <Link href="/login">
          Login
        </Link>
      </Button>
    </div>
  );
}
