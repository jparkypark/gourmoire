import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AuthState, User, LoginRequest, AuthResponse, RefreshTokenResponse } from '../../../shared/types';

// Token storage keys
const ACCESS_TOKEN_KEY = 'gourmoire_access_token';
const REFRESH_TOKEN_KEY = 'gourmoire_refresh_token';
const USER_KEY = 'gourmoire_user';
const REMEMBER_ME_KEY = 'gourmoire_remember_me';

// Auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN_SUCCESS'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESTORE_SESSION'; payload: { user: User; accessToken: string; refreshToken: string } };

// Auth context type
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isTokenExpired: (token: string) => boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for existing session
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token utilities
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

const getStoredTokens = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

  // If rememberMe is false, try session storage first
  if (!rememberMe) {
    const sessionAccessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const sessionRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    const sessionUserStr = sessionStorage.getItem(USER_KEY);
    
    if (sessionAccessToken && sessionRefreshToken && sessionUserStr) {
      try {
        const user = JSON.parse(sessionUserStr);
        return { accessToken: sessionAccessToken, refreshToken: sessionRefreshToken, user };
      } catch {
        return { accessToken: null, refreshToken: null, user: null };
      }
    }
    
    // Fall back to localStorage for current session
    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { accessToken, refreshToken, user };
      } catch {
        return { accessToken: null, refreshToken: null, user: null };
      }
    }
    
    return { accessToken: null, refreshToken: null, user: null };
  }

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { accessToken, refreshToken, user };
    } catch {
      return { accessToken: null, refreshToken: null, user: null };
    }
  }

  return { accessToken: null, refreshToken: null, user: null };
};

const clearStoredTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const storeTokens = (accessToken: string, refreshToken: string, user: User, rememberMe: boolean) => {
  if (rememberMe) {
    // Store in localStorage for persistence across browser sessions
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
  } else {
    // Store in sessionStorage for current session only
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    // Also store in localStorage temporarily for immediate access
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(REMEMBER_ME_KEY, 'false');
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // API base URL - this would typically come from environment variables
  const API_BASE_URL = 'http://localhost:8787'; // Cloudflare Workers dev server

  // Logout function
  const logout = useCallback(() => {
    clearStoredTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Refresh token function
  const refreshTokenFunction = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!storedRefreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data: RefreshTokenResponse = await response.json();

      if (data.success && data.accessToken && data.refreshToken) {
        const { user } = getStoredTokens();
        if (user) {
          storeTokens(data.accessToken, data.refreshToken, user, true);
          dispatch({
            type: 'REFRESH_TOKEN_SUCCESS',
            payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            },
          });
          return true;
        }
      }
      
      // Refresh failed, logout
      logout();
      return false;
    } catch {
      logout();
      return false;
    }
  }, [API_BASE_URL, logout]);

  // Login function
  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user && data.accessToken && data.refreshToken) {
        // Store tokens and user data
        storeTokens(data.accessToken, data.refreshToken, data.user, credentials.rememberMe || false);
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
        });

        return data;
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        return data;
      }
    } catch {
      dispatch({ type: 'LOGIN_FAILURE' });
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }, [API_BASE_URL]);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      const { accessToken, refreshToken, user } = getStoredTokens();
      
      if (accessToken && refreshToken && user) {
        if (isTokenExpired(accessToken)) {
          // Try to refresh the token
          const refreshed = await refreshTokenFunction();
          if (!refreshed) {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          // Token is still valid
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, accessToken, refreshToken }
          });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreSession();
  }, [refreshTokenFunction]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (state.accessToken && state.isAuthenticated) {
      const checkTokenExpiration = () => {
        if (isTokenExpired(state.accessToken!)) {
          refreshTokenFunction();
        }
      };

      // Check every 5 minutes
      const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [state.accessToken, state.isAuthenticated, refreshTokenFunction]);

  const value: AuthContextType = {
    state,
    login,
    logout,
    refreshToken: refreshTokenFunction,
    isTokenExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the AuthProvider as default to satisfy fast refresh requirements
export default AuthProvider;