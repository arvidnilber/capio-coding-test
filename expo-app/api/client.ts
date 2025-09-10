const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface ApiError {
    error: string;
    status: number;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {},
        requiresAuth: boolean = false
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Add authorization header if required
        if (requiresAuth) {
            // Import here to avoid circular dependency
            const { useAuthStore } = await import("@/store/authStore");
            const { tokens, refreshTokens, logout } = useAuthStore.getState();

            if (!tokens) {
                logout();
                throw new ApiError("No authentication tokens available", 401);
            }

            // Check if access token is expired (with 1 minute buffer)
            const now = Math.floor(Date.now() / 1000);
            const tokenExpiresSoon = tokens.accessTokenExp - now < 60;

            if (tokenExpiresSoon) {
                const refreshSuccess = await refreshTokens();
                if (!refreshSuccess) {
                    throw new ApiError("Failed to refresh token", 401);
                }

                // Get the updated tokens after refresh
                const updatedTokens = useAuthStore.getState().tokens;
                if (updatedTokens) {
                    Object.assign(headers, {
                        Authorization: `Bearer ${updatedTokens.accessToken}`,
                    });
                }
            } else {
                Object.assign(headers, {
                    Authorization: `Bearer ${tokens.accessToken}`,
                });
            }
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({ error: "Network error" }));
                throw new ApiError(
                    errorData.error || `HTTP ${response.status}`,
                    response.status
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError("Network request failed", 0);
        }
    }

    // Auth endpoints
    async login(username: string, password: string) {
        return this.makeRequest("/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });
    }

    async refreshToken(refreshToken: string) {
        return this.makeRequest("/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        });
    }

    // Account endpoints
    async getAccount() {
        return this.makeRequest(
            "/account",
            {
                method: "GET",
            },
            true
        );
    }

    async updateAccount(phone: string) {
        return this.makeRequest(
            "/account",
            {
                method: "PATCH",
                body: JSON.stringify({ phone }),
            },
            true
        );
    }
}

// Custom error class
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
