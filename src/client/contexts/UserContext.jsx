import { createContext, useState, useEffect, useContext } from "react";

// Create context
export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    // Load user from sessionStorage if available
    const [userId, setUserId] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Whenever user changes, update sessionStorage
    useEffect(() => {
        if (userId) {
            sessionStorage.setItem("user", JSON.stringify(userId));
        } else {
            sessionStorage.removeItem("user");
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;