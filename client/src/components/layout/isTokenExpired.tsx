import { jwtDecode } from "jwt-decode"; // Correct named import

interface TokenPayload {
    exp: number; // Expiration time in seconds
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<TokenPayload>(token); // Use jwtDecode here
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp < currentTime;
    } catch (error) {
        // If decoding fails, consider the token invalid
        return true;
    }
}
