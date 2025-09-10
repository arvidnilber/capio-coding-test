import React, { useEffect } from "react";
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

export default function HomeScreen() {
    const { user, updateUser, logout, isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchUserData = async () => {
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
    };

    useEffect(() => {
        if (isAuthenticated && !user) {
            fetchUserData();
        }
    }, [isAuthenticated, user]);

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
                <Text style={styles.title}>Welcome Back!</Text>
                {user && (
                    <Text style={styles.subtitle}>Hello, {user.username}</Text>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>User Information</Text>
                    {user ? (
                        <View style={styles.userInfo}>
                            <Text style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Username: </Text>
                                {user.username}
                            </Text>
                            <Text style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Phone: </Text>
                                {user.phone || "Not set"}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.noData}>
                            No user data available
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={navigateToProfile}
                >
                    <Text style={styles.profileButtonText}>Go to Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchUserData}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#007AFF" />
                    ) : (
                        <Text style={styles.refreshButtonText}>
                            Refresh Data
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    header: {
        backgroundColor: "white",
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: "#666",
    },
    content: {
        flex: 1,
        padding: 24,
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
        backgroundColor: "#007AFF",
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
        margin: 24,
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
