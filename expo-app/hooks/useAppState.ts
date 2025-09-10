import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuthStore } from "@/store/authStore";

export const useAppState = () => {
    const appState = useRef(AppState.currentState);
    const { setBackgroundTime, checkAuthStatus, logout, isAuthenticated } =
        useAuthStore();

    useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            (nextAppState: AppStateStatus) => {
                const previousState = appState.current;
                appState.current = nextAppState;

                if (!isAuthenticated) {
                    return;
                }

                // App is going to background
                if (
                    previousState === "active" &&
                    nextAppState.match(/inactive|background/)
                ) {
                    const backgroundTime = Date.now();
                    setBackgroundTime(backgroundTime);
                    console.log(
                        "App went to background at:",
                        new Date(backgroundTime).toISOString()
                    );
                }

                // App is coming to foreground
                if (
                    previousState.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    console.log("App came to foreground");

                    // Check if user should still be authenticated
                    checkAuthStatus();

                    // Clear background time when returning to foreground
                    setBackgroundTime(0);
                }
            }
        );

        // Initial check when hook mounts
        if (isAuthenticated) {
            checkAuthStatus();
        }

        return () => {
            subscription?.remove();
        };
    }, [isAuthenticated, setBackgroundTime, checkAuthStatus, logout]);

    return {
        currentAppState: appState.current,
    };
};
