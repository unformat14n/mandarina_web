import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        // Optionally, you can verify the token's validity here
        // e.g., decoding the token with jwt-decode or checking expiration
    } catch (error) {
        // If token verification fails, redirect to login
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;