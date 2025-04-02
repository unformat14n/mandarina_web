import { User } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(0);

    return (
        <UserContext.Provider
            value={{ userId, setUserId}}>
            {children}
        </UserContext.Provider>
    );
};
