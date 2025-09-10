import {
    DarkTheme,
    DefaultTheme,
    Theme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import { useAppState } from "@/hooks/useAppState";
export type CustomTheme = Theme & {
    colors: {
        secondaryText: string;
    };
};
export default function RootLayout() {
    const colorScheme = useColorScheme();

    // Initialize app state monitoring
    useAppState();

    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    const darkTheme: CustomTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: "#0d3050",
            border: "#737373",
            secondaryText: "#bbbbbb",
        },
    };

    const defaultTheme: CustomTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: "#0d3050",
            border: "#f0f0f0",
            secondaryText: "#666",
        },
    };

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? darkTheme : defaultTheme}
        >
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
