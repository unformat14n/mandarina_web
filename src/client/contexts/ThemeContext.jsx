import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Load theme from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme : "light";
    });

    // Load palette from localStorage or default to 'mandarina'
    const [clrPalette, setPalette] = useState(() => {
        const savedPalette = localStorage.getItem("clrPalette");
        return savedPalette ? savedPalette : "mandarina";
    });

    // Save theme and palette to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("theme", theme);
        localStorage.setItem("clrPalette", clrPalette);
    }, [theme, clrPalette]);

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
