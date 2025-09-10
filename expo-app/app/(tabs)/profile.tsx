import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useAuthStore, type User } from "@/store/authStore";
import { apiClient } from "@/api/client";

export default function ProfileScreen() {
    const { user, updateUser } = useAuthStore();
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.phone) {
            setPhone(user.phone);
        }
    }, [user]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const userData = await apiClient.getAccount();
            updateUser(userData as User);
            setPhone(userData.phone || "");
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            Alert.alert("Error", "Failed to load user information");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSavePhone = async () => {
        if (!phone.trim()) {
            Alert.alert("Error", "Please enter a phone number");
            return;
        }

        if (phone.length < 10 || phone.length > 15) {
            Alert.alert(
                "Error",
                "Phone number must be between 10 and 15 characters"
            );
            return;
        }

        setIsSaving(true);
        try {
            const updatedUser = await apiClient.updateAccount(phone.trim());
            updateUser(updatedUser as User);
            Alert.alert("Success", "Phone number updated successfully");
        } catch (error) {
            console.error("Failed to update phone:", error);
            Alert.alert("Error", "Failed to update phone number");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.subtitle}>
                    Manage your account information
                </Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>User Information</Text>
                    {user ? (
                        <View style={styles.userInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Username:</Text>
                                <Text style={styles.infoValue}>
                                    {user.username}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>User ID:</Text>
                                <Text style={styles.infoValue}>
                                    {user.userId}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.noData}>
                            No user data available
                        </Text>
                    )}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Phone Number</Text>
                    <Text style={styles.description}>
                        Update your phone number to keep your account secure.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            editable={!isSaving}
                            maxLength={15}
                        />
                        <Text style={styles.hint}>
                            Must be between 10-15 characters
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            isSaving && styles.saveButtonDisabled,
                        ]}
                        onPress={handleSavePhone}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                Save Phone Number
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchUserData}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#007AFF" />
                    ) : (
                        <Text style={styles.refreshButtonText}>
                            Refresh Profile
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
        fontSize: 16,
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
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
    },
    userInfo: {
        gap: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
    },
    noData: {
        fontSize: 16,
        color: "#666",
        fontStyle: "italic",
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "white",
    },
    hint: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    saveButton: {
        height: 52,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    saveButtonDisabled: {
        backgroundColor: "#ccc",
    },
    saveButtonText: {
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
});
