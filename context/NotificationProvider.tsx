"use client";

import { onMessage } from "firebase/messaging";
import React, { createContext, useContext, useEffect } from "react";
import { generateToken, getFirebaseMessaging } from "@/firebase";

type NotificationContextType = {};

const NotificationContext =
    createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    useEffect(() => {
        const init = async () => {
            await generateToken();

            const messaging = await getFirebaseMessaging();
            if (!messaging) return;

            onMessage(messaging, (payload) => {
                console.log("FCM foreground message ✅", payload);
            });
        };
        init();
    }, []);

    return (
        <NotificationContext.Provider value={{}}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error("useNotification must be used within NotificationProvider");
    return context;
};
