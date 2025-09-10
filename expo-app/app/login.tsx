import React, { useMemo, useState } from "react";
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
import { router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { Theme, useTheme } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error, clearError } = useAuthStore();
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter both username and password");
            return;
        }

        clearError();
        const success = await login(username.trim(), password);

        if (success) {
            router.replace("/(tabs)");
        }
    };

    const fillTestCredentials = () => {
        setUsername("testuser");
        setPassword("secret");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <ThemedText style={styles.title} type="title">
                        Welcome to Capio Test
                    </ThemedText>
                    <ThemedText style={styles.subtitle} type="subtitle">
                        Sign in to your account
                    </ThemedText>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter your username"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            isLoading && styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.testButton}
                        onPress={fillTestCredentials}
                        disabled={isLoading}
                    >
                        <Text style={styles.testButtonText}>
                            Fill in test credentials
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        content: {
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
        },
        header: {
            alignItems: "center",
            marginBottom: 48,
        },
        title: {
            fontSize: 32,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
        },
        form: {
            width: "100%",
        },
        inputContainer: {
            marginBottom: 24,
        },
        label: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: 8,
        },
        input: {
            height: 52,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: theme.colors.text,
            fontSize: 16,
            backgroundColor: theme.colors.card,
        },
        errorContainer: {
            backgroundColor: "#fee",
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
            borderLeftWidth: 4,
            borderLeftColor: "#f56565",
        },
        errorText: {
            color: "#c53030",
            fontSize: 14,
            fontWeight: "500",
        },
        loginButton: {
            height: 52,
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
        },
        loginButtonDisabled: {
            backgroundColor: "#ccc",
        },
        loginButtonText: {
            color: "white",
            fontSize: 18,
            fontWeight: "600",
        },
        testButton: {
            height: 44,
            justifyContent: "center",
            alignItems: "center",
        },
        testButtonText: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: "500",
        },
    });
