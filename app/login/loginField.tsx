"use client"

import TextField from "@/components/TextField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const LoginField = () => {
    const router = useRouter()
    const { useMutateLogin } = useAuth()
    const { mutate: handleLogin, isPending } = useMutateLogin()

    const [username, setUsername] = useState('superadmin@system.co');
    const [password, setPassword] = useState('Apple123%');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            username,
            password,
        };

        try {
            const res = await handleLogin(formData);
            console.log(res)
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full mt-6">
                Sign In
            </Button>
        </form>
    );
}