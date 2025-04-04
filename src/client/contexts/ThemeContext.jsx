import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light"); // Default theme
    const [clrPalette, setPalette] = useState("mandarina"); // Default palette

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider
            value={{ theme, toggleTheme, clrPalette, setPalette }}>
            {children}
        </ThemeContext.Provider>
    );
};
