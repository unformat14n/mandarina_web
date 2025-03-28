import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found");
        return <Navigate to="/" replace />;
    }

    try {
        // Optionally, you can verify the token's validity here
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
            // Token is expired, redirect to login
            localStorage.removeItem("token"); // Optionally remove the token
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        console.log("Token verification failed:", error);
        // If token verification fails, redirect to login
        return <Navigate to="/" replace />;
    }

    console.log("Token is valid"); // Log for debugging purposes
    return children;
}

export default ProtectedRoute;