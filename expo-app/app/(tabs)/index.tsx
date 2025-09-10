import React, { useCallback, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore, type User } from "@/store/authStore";
import { apiClient } from "@/api/client";
import { Theme, useTheme } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
    const { user, updateUser, logout, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const theme = useTheme();

    const styles = useMemo(() => createStyles(theme), [theme]);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const userData = await apiClient.getAccount();
            updateUser(userData as User);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            Alert.alert("Error", "Failed to load user information");
        } finally {
            setIsLoading(false);
        }
    }, [updateUser]);

    useEffect(() => {
        if (isAuthenticated && !user) {
            fetchUserData();
        }
    }, [fetchUserData, isAuthenticated, user]);

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                    logout();
                    router.replace("/login");
                },
            },
        ]);
    };

    const navigateToProfile = () => {
        router.push("/(tabs)/profile");
    };

    if (isLoading && !user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>
                    Loading user information...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {user && (
                    <ThemedText type="title">Hello, {user.username}</ThemedText>
                )}
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={navigateToProfile}
                >
                    <Text style={styles.profileButtonText}>Go to Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
        },
        loadingText: {
            marginTop: 16,
            fontSize: 16,
            color: "#666",
        },
        header: {
            paddingTop: 80,
            paddingBottom: 24,
            paddingHorizontal: 24,
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 4,
            color: theme.colors.text,
        },
        subtitle: {
            fontSize: 18,
            color: "#666",
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
        },
        card: {
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: "#333",
            marginBottom: 16,
        },
        userInfo: {
            gap: 12,
        },
        infoItem: {
            fontSize: 16,
            color: "#333",
        },
        infoLabel: {
            fontWeight: "600",
            color: "#666",
        },
        noData: {
            fontSize: 16,
            color: "#666",
            fontStyle: "italic",
        },
        profileButton: {
            backgroundColor: theme.colors.primary,
            height: 52,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
        },
        profileButtonText: {
            color: "white",
            fontSize: 18,
            fontWeight: "600",
        },
        refreshButton: {
            backgroundColor: "white",
            height: 44,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#007AFF",
        },
        refreshButtonText: {
            color: "#007AFF",
            fontSize: 16,
            fontWeight: "500",
        },
        logoutButton: {
            backgroundColor: "#ff3b30",
            height: 52,

            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
        },
        logoutButtonText: {
            color: "white",
            fontSize: 18,
            fontWeight: "600",
        },
    });
