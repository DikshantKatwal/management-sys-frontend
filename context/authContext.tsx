'use client'
import apiService from '@/lib/api';
import { parseAuthCookie } from '@/lib/cookieCutter';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LoginPayload = {
    username: string;
    password: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    refreshAuth: () => void;
    useMutateLogin: () => UseMutationResult<any, Error, LoginPayload, unknown>;
    useMutateLogout: () => UseMutationResult<any, Error, void, unknown>
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const queryClient = useQueryClient();

    const useMutateLogin = () => {
        return useMutation({
            mutationFn: (formData: LoginPayload) => apiService.post('/user/login/', formData),
            onSuccess: async () => {
                await refreshAuth()
                router.push("/admin")
                await queryClient.invalidateQueries({ queryKey: ['user'] });
            },
        })
    }

    const useMutateLogout = () => {
        return useMutation({
            mutationFn: () => apiService.post('/api/auth/logout/', undefined),
            onSuccess: async () => {
                await refreshAuth()
                queryClient.removeQueries({ queryKey: ['user'] });
            },
        })
    }
    const refreshAuth = async () => {
        const result = await parseAuthCookie();
        setIsAuthenticated(result);
        setIsLoading(false);
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    if (isLoading) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, refreshAuth, useMutateLogin, useMutateLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
