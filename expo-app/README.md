# Capio React Native App

A React Native application built with Expo Router for user authentication and profile management. This app demonstrates secure authentication flows, persistent login state, and API integration with automatic token refresh.

## 🚀 Features

- **Secure Authentication**: JWT-based login with automatic token refresh
- **Persistent Sessions**: Users stay logged in across app launches (with configurable timeout)
- **Profile Management**: Users can view and update their phone numbers
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Background State Management**: Intelligent session handling when app goes to background
- **TypeScript**: Full type safety throughout the application
- **Modern Architecture**: Built with Expo Router (file-based routing like Next.js for React Native)

## 📋 Requirements

- Node.js 18+ 
- npm or yarn
- iOS Simulator / Android Emulator / Physical device
- Backend API running on `http://localhost:3000` (see backend folder)

## 🛠 Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the backend API** (from the backend folder):
   ```bash
   cd ../backend
   npm install
   npm run build
   npm start
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**:
   - **iOS**: `npx expo run:ios` or press `i` in the terminal
   - **Android**: `npx expo run:android` or press `a` in the terminal  
   - **Web**: `npx expo start --web` or press `w` in the terminal

## 🏗 Project Structure

```
expo-app/
├── app/                    # File-based routing (Expo Router)
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.tsx      # Home screen
│   │   └── profile.tsx    # Profile screen
│   ├── _layout.tsx        # Root layout with theme provider
│   ├── index.tsx          # Authentication checker/router
│   └── login.tsx          # Login screen
├── api/                   # API client and utilities
│   └── client.ts          # HTTP client with auth handling
├── components/            # Reusable UI components
│   ├── ThemedText.tsx     # Theme-aware text component
│   └── ThemedView.tsx     # Theme-aware view component
├── hooks/                 # Custom React hooks
│   ├── useAppState.ts     # App state monitoring
│   └── useThemeColor.ts   # Theme color utilities
├── store/                 # State management
│   └── authStore.ts       # Zustand store for authentication
└── types/                 # TypeScript type definitions
    └── api.ts             # API response types
```

## 🔐 Authentication Flow

### Login Process
1. User enters credentials on login screen
2. App sends POST request to `/login` endpoint
3. Backend returns access token (5min) and refresh token (24h)
4. Tokens are stored securely using MMKV
5. User is redirected to the main app

### Session Management
- **Active App**: Tokens are automatically refreshed when needed
- **Background < 10min**: Session is maintained, user stays logged in
- **Background > 10min**: User is logged out for security
- **App Termination**: Session expires, user must log in again

### Automatic Token Refresh
- Access tokens are checked before each API call
- If token expires within 1 minute, it's automatically refreshed
- Failed refresh attempts result in automatic logout

## 📱 App Screens

### Login Screen (`/login`)
- Username and password input fields
- "Fill test credentials" button for quick testing
- Error handling and loading states
- Credentials: `testuser` / `secret`

### Home Screen (`/(tabs)/index`)
- Welcome message with username
- Navigation to profile screen
- Automatic user data fetching

### Profile Screen (`/(tabs)/profile`) 
- View and edit phone number
- Input validation (10-15 characters)
- "Refresh Profile" to sync latest data
- Logout functionality

## 🔧 Technical Implementation

### State Management
- **Zustand**: Lightweight state management for authentication
- **MMKV**: Fast, secure storage for tokens and user data
- **Persistent State**: Authentication persists across app launches

### API Integration
- **Automatic Token Refresh**: Handles expired tokens seamlessly
- **Error Handling**: Graceful error handling with user feedback
- **TypeScript**: Full type safety for API responses

### Theme System
- **React Navigation**: Built-in theme provider
- **Dark Mode**: Automatic system theme detection
- **Custom Colors**: Extended theme with additional color properties

### Background State Handling
- **App State Monitoring**: Tracks when app goes to background
- **Timeout Logic**: 10-minute background timeout for security
- **Automatic Cleanup**: Clears sensitive data when appropriate

## 🎨 Styling & UI

- **Modern Design**: Clean, iOS/Android native-feeling interface
- **Responsive**: Works on phones and tablets
- **Accessibility**: Proper labels and contrast ratios
- **Loading States**: Smooth loading indicators and disabled states
- **Error States**: Clear error messaging and validation feedback

## 🧪 Testing Credentials

For development and testing, use these credentials:
- **Username**: `testuser`
- **Password**: `secret`

The login screen includes a "Fill test credentials" button for convenience.

## 🔒 Security Features

- **JWT Token Security**: Short-lived access tokens with refresh mechanism
- **Secure Storage**: MMKV for encrypted local storage
- **Background Timeout**: Automatic logout after 10 minutes in background
- **API Error Handling**: Proper error responses and user feedback
- **Input Validation**: Client-side validation for user inputs

## 🚧 Development Notes

### State Persistence
The app uses MMKV for fast, encrypted storage of:
- Access and refresh tokens
- User profile data
- Last background timestamp
- Authentication state

### Error Handling
- Network errors are caught and displayed to users
- Invalid tokens trigger automatic logout
- API errors show appropriate user messages
- Form validation prevents invalid submissions

### Performance
- Automatic token refresh prevents unnecessary re-authentication
- Efficient state management with Zustand
- Optimized re-renders with proper React patterns

## 📦 Dependencies

### Core Dependencies
- **Expo**: React Native platform and tooling
- **Expo Router**: File-based navigation
- **React Native**: Core mobile framework
- **TypeScript**: Type safety and developer experience

### State & Storage
- **Zustand**: State management
- **react-native-mmkv**: Fast, secure storage

### UI & Navigation
- **@react-navigation/native**: Navigation system
- **@react-navigation/bottom-tabs**: Tab navigation
- **expo-status-bar**: Status bar management


