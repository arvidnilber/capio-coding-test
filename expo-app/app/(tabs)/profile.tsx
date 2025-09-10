import React, { useState, useEffect, useMemo } from "react";
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
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/api";
import { apiClient } from "@/api/client";
import { Theme, useTheme } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import type { CustomTheme } from "../_layout";
import { router } from "expo-router";
import DismissKeyboard from "@/components/DismissKeyboard";

export default function ProfileScreen() {
    const { user, updateUser, logout } = useAuthStore();
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        if (user?.phone) {
            setPhone(user.phone);
        }
    }, [user]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const userData = await apiClient.getAccount();
            updateUser(userData);
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

    const handleLogout = () => {
        logout();
        router.replace("/login");
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
        <DismissKeyboard>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.content}>
                    <View style={styles.card}>
                        <ThemedText type="title" style={styles.cardTitle}>
                            Phone number
                        </ThemedText>
                        <ThemedText type="subtitle" style={styles.description}>
                            Update your phone number to keep your account
                            secure.
                        </ThemedText>

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
                                    {user?.phone ? "Update" : "Save"}
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
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>
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
            backgroundColor: "#f5f5f5",
        },
        loadingText: {
            marginTop: 16,
            fontSize: 16,
            color: "#666",
        },
        content: {
            flex: 1,
            padding: 24,
        },
        card: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 20,
            marginBottom: 15,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        cardTitle: {
            fontSize: 26,
            paddingBottom: 10,
        },
        description: {
            fontSize: 16,
            marginBottom: 20,
            fontWeight: "regular",
        },
        inputContainer: {
            marginBottom: 24,
        },
        label: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.secondaryText,
            marginBottom: 8,
        },
        input: {
            height: 52,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            paddingHorizontal: 16,
            fontSize: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
        },
        hint: {
            fontSize: 12,
            color: theme.colors.secondaryText,
            marginTop: 8,
        },
        saveButton: {
            height: 52,
            backgroundColor: theme.colors.primary,
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
            backgroundColor: theme.colors.card,
            height: 44,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.dark
                ? theme.colors.border
                : theme.colors.primary,
        },
        refreshButtonText: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: "500",
        },
        logoutButton: {
            backgroundColor: "#ff3b30",
            height: 44,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
        },
        logoutButtonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "500",
        },
    });
