// Shared API and Auth types

// User and Account types
export interface User {
    userId: number;
    username: string;
    phone: string;
}

export interface Account {
    userId: number;
    username: string;
    phone: string;
}

// Auth token types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExp: number;
    refreshTokenExp: number;
}

export interface AuthResponse {
    refreshToken: string;
    accessToken: string;
    refreshTokenExp: number;
    accessTokenExp: number;
}

// Error types
export interface ErrorResponse {
    error: string;
}
