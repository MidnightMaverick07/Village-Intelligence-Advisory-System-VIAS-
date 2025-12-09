"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: string;
    name: string;
    phone: string;
    village: string;
    role: "farmer" | "officer" | "admin";
    registeredOn: Date;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    requestOTP: (phone: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database
const MOCK_USERS: Record<string, User> = {
    "9832XXXX01": {
        id: "1",
        name: "Ramesh Mondal",
        phone: "9832XXXX01",
        village: "Bhatar",
        role: "farmer",
        registeredOn: new Date("2023-01-15"),
    },
    "9832XXXX06": {
        id: "6",
        name: "Subhas Bose",
        phone: "9832XXXX06",
        village: "Bhatar",
        role: "farmer",
        registeredOn: new Date("2021-04-15"),
    },
    "1234567890": {
        id: "admin",
        name: "Agriculture Officer",
        phone: "1234567890",
        village: "Bhatar",
        role: "officer",
        registeredOn: new Date("2020-01-01"),
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("riceadvisor_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                parsed.registeredOn = new Date(parsed.registeredOn);
                setUser(parsed);
            } catch {
                localStorage.removeItem("riceadvisor_user");
            }
        }
        setIsLoading(false);
    }, []);

    const requestOTP = async (phone: string): Promise<{ success: boolean; error?: string }> => {
        // Simulate OTP request (in production, this would call an SMS API)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (MOCK_USERS[phone]) {
            console.log(`[MOCK] OTP sent to ${phone}: 123456`);
            return { success: true };
        }

        return { success: false, error: "Phone number not registered" };
    };

    const login = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock OTP verification (in production, verify with backend)
        if (otp !== "123456") {
            setIsLoading(false);
            return { success: false, error: "Invalid OTP" };
        }

        const foundUser = MOCK_USERS[phone];
        if (!foundUser) {
            setIsLoading(false);
            return { success: false, error: "User not found" };
        }

        setUser(foundUser);
        localStorage.setItem("riceadvisor_user", JSON.stringify(foundUser));
        setIsLoading(false);

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("riceadvisor_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                requestOTP,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
