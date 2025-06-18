import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check if user has a theme preference stored in localStorage
    const storedTheme = localStorage.getItem('theme') || 'dark';
    const [theme, setTheme] = useState(storedTheme);

    // Light theme variables
    const lightTheme = {
        primaryColor: '#0066cc',
        secondaryColor: '#666',
        accentColor: 'gold',
        textColor: '#333',
        textLight: '#555',
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        hoverColor: '#004d99',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        white: '#ffffff',
        bulletColor: '#0066cc',
    };

    // Dark theme variables
    const darkTheme = {
        primaryColor: '#4d94ff',
        secondaryColor: '#999',
        accentColor: '#ffc400',
        textColor: '#f0f0f0',
        textLight: '#cccccc',
        backgroundColor: '#232323',
        borderColor: '#444444',
        hoverColor: '#3385ff',
        modalOverlay: 'rgba(0, 0, 0, 0.5)',
        white: '#1e1e1e',
        bulletColor: '#4d94ff',
    };

    // Toggle theme function
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Apply theme variables to CSS root
    useEffect(() => {
        const root = document.documentElement;
        const themeVars = theme === 'light' ? lightTheme : darkTheme;

        Object.entries(themeVars).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });
    }, [theme, lightTheme, darkTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
