// Authentication utility functions

const API_BASE_URL = 'https://ebookapi-1xjq.onrender.com/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

/**
 * Login user and get access token
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(
      typeof error.detail === 'string' 
        ? error.detail 
        : 'Authentication failed'
    );
  }

  return response.json();
}

/**
 * Store authentication token in localStorage
 */
export function setAuthToken(token: string, tokenType: string = 'bearer'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_type', tokenType);
  }
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

/**
 * Get token type (usually 'bearer')
 */
export function getTokenType(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token_type') || 'bearer';
  }
  return 'bearer';
}

/**
 * Get authorization header value
 */
export function getAuthHeader(): string | null {
  const token = getAuthToken();
  const tokenType = getTokenType();
  
  if (token) {
    return `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`;
  }
  
  return null;
}

/**
 * Remove authentication token (logout)
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const authHeader = getAuthHeader();
  
  if (!authHeader) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': authHeader,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
