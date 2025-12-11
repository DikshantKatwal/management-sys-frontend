import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/theme/theme-toggle";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { LoginField } from "./loginField";

export default function Login() {


    return (
        <div className="min-h-screen font-oswald grid grid-rows-[auto_1fr_auto]">

            {/* Header */}
            <header className="w-full backdrop-blur border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-3 flex justify-end">
                    <ThemeToggle />
                </div>
            </header>

            {/* Main */}
            <main className="flex items-center justify-center px-4">
                <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl border border-border shadow-xl bg-background/60 backdrop-blur-xl">

                    {/* Left side */}
                    <div className="hidden md:flex w-1/2 flex-col justify-between p-10 bg-linear-to-br from-theme-dark via-theme-normal to-theme-light">
                        <div>
                            <h1 className="text-3xl font-semibold leading-tight">
                                Welcome back 👋
                            </h1>
                            <p className="mt-2 text-sm opacity-90">
                                Login to continue building something awesome.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            className="flex items-center font-light gap-2 text-sm"
                        >
                            <FaGoogle className="" />
                            Login with Google
                        </Button>
                    </div>

                    {/* Right side */}
                    <div className="w-full md:w-1/2 p-8 ">
                        <h2 className="text-2xl font-semibold text-foreground">
                            Login
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Enter your credentials below
                        </p>

                        <LoginField />
                        <div className="w-full flex flex-col gap-3 font-nunito text-center py-3 text-light-active">
                            <div>
                                <span className="text-sm underline hover:cursor-pointer hover:text-theme-dark">
                                    Forgot password
                                </span>
                            </div>
                            <div>
                                <span className="text-sm underline hover:cursor-pointer hover:text-theme-dark">
                                    Create an account?
                                </span>
                            </div>
                        </div>
                        {/* Mobile Google login */}
                        <Button
                            variant="outline"
                            className="w-full mt-4 flex gap-2 md:hidden"
                        >
                            <FaGoogle />
                            Continue with Google
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-muted-foreground">
                Crafted by —{" "}
                <span className="font-medium text-foreground">
                    Imagio Creations
                </span>
            </footer>
        </div>
    );
}
