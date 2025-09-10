import { create } from "zustand";
import { MMKV } from "react-native-mmkv";
import type { User, AuthTokens, AuthResponse } from "@/types/api";
import { router } from "expo-router";

// MMKV storage instance
const storage = new MMKV();

// API base URL
const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
const BACKGROUND_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

// Auth API helper functions (no circular dependency)
const authApi = {
    async login(username: string, password: string) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
        }

        return (await response.json()) as AuthResponse;
    },

    async refreshToken(refreshToken: string) {
        const response = await fetch(`${API_BASE_URL}/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Token refresh failed");
        }

        return (await response.json()) as AuthResponse;
    },
};

// Storage keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    ACCESS_TOKEN_EXP: "access_token_exp",
    REFRESH_TOKEN_EXP: "refresh_token_exp",
    USER_DATA: "user_data",
    LAST_BACKGROUND_TIME: "last_background_time",
} as const;

interface AuthState {
    // State
    isAuthenticated: boolean;
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    error: string | null;
    lastBackgroundTime: number | null;

    // Actions
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshTokens: () => Promise<boolean>;
    updateUser: (userData: User) => void;
    clearError: () => void;
    setBackgroundTime: (time: number) => void;
    checkAuthStatus: () => boolean;

    // Persistence helpers
    clearStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    isAuthenticated: false,
    user: null,
    tokens: null,
    isLoading: false,
    error: null,
    lastBackgroundTime: null,

    // Actions
    login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const tokens = await authApi.login(username, password);

            // Store tokens
            storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
            storage.set(STORAGE_KEYS.ACCESS_TOKEN_EXP, tokens.accessTokenExp);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN_EXP, tokens.refreshTokenExp);

            set({
                isAuthenticated: true,
                tokens,
                isLoading: false,
                error: null,
            });

            return true;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Login failed";

            set({
                isLoading: false,
                error: errorMessage,
            });
            return false;
        }
    },

    logout: () => {
        // Clear storage
        get().clearStorage();

        set({
            isAuthenticated: false,
            user: null,
            tokens: null,
            error: null,
            lastBackgroundTime: null,
        });

        router.replace("/login");
    },

    refreshTokens: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
            get().logout();
            return false;
        }

        try {
            const newTokens = await authApi.refreshToken(tokens.refreshToken);

            // Store new tokens
            storage.set(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
            storage.set(
                STORAGE_KEYS.ACCESS_TOKEN_EXP,
                newTokens.accessTokenExp
            );
            storage.set(
                STORAGE_KEYS.REFRESH_TOKEN_EXP,
                newTokens.refreshTokenExp
            );

            set({ tokens: newTokens });
            return true;
        } catch {
            get().logout();
            return false;
        }
    },

    updateUser: (userData: User) => {
        storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        set({ user: userData });
    },

    clearError: () => set({ error: null }),

    setBackgroundTime: (time: number) => {
        storage.set(STORAGE_KEYS.LAST_BACKGROUND_TIME, time);
        set({ lastBackgroundTime: time });
    },

    checkAuthStatus: () => {
        const { tokens, lastBackgroundTime } = get();

        if (!tokens) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);

        // Check if refresh token is expired
        if (now >= tokens.refreshTokenExp) {
            get().logout();
            return false;
        }

        // Check background time (10 minutes = 600 seconds)
        if (
            lastBackgroundTime &&
            Date.now() - lastBackgroundTime > BACKGROUND_TIMEOUT
        ) {
            get().logout();
            return false;
        }

        return true;
    },

    clearStorage: () => {
        storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
        storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
        storage.delete(STORAGE_KEYS.ACCESS_TOKEN_EXP);
        storage.delete(STORAGE_KEYS.REFRESH_TOKEN_EXP);
        storage.delete(STORAGE_KEYS.USER_DATA);
        storage.delete(STORAGE_KEYS.LAST_BACKGROUND_TIME);
    },
}));
