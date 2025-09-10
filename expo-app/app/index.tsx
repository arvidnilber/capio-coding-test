import { useEffect } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function Index() {
    const { isAuthenticated, checkAuthStatus } = useAuthStore();
    const theme = useTheme();

    useEffect(() => {
        // Check authentication status and navigate accordingly
        const isStillAuthenticated = checkAuthStatus();

        if (isStillAuthenticated) {
            router.replace("/(tabs)");
        } else {
            router.replace("/login");
        }
    }, [isAuthenticated, checkAuthStatus]);

    // Show loading spinner while determining auth status
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
});
