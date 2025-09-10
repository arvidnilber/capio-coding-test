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
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/api";
import { apiClient } from "@/api/client";
import { Theme, useTheme } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
    const { user, updateUser, isAuthenticated } = useAuthStore();
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
        content: {
            flex: 1,
            paddingHorizontal: 24,
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
    });
