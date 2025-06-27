import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { createCustomTheme } from './theme';

// Constants
const THEME_STORAGE_KEY = 'themeMode';
const DEFAULT_THEME = 'light';

// Create context with default values
const ThemeContext = createContext({
  mode: DEFAULT_THEME,
  toggleColorMode: () => {},
  setMode: () => {},
  theme: createCustomTheme(DEFAULT_THEME),
});

// Helper function to get initial theme mode
const getInitialMode = () => {
  try {
    // Check for saved theme preference
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Check for system preference if no saved preference
    if (!savedMode && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return savedMode === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return DEFAULT_THEME;
  }
};

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(getInitialMode);

  // Update the theme when mode changes
  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  // Set mode and save to localStorage
  const setMode = useCallback((newMode) => {
    try {
      setModeState(newMode);
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  // Toggle between light and dark mode using functional update to avoid mode dependency
  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, [setMode]); // setMode is stable due to useCallback with empty deps

  // Apply theme to document
  useEffect(() => {
    // Update body class for theme-specific styles
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${mode}-theme`);
    
    // Update meta theme color
    const themeColor = theme.palette.background.default;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    
    // Update CSS variables for non-MUI components
    document.documentElement.style.setProperty('--background-default', theme.palette.background.default);
    document.documentElement.style.setProperty('--background-paper', theme.palette.background.paper);
    document.documentElement.style.setProperty('--text-primary', theme.palette.text.primary);
    document.documentElement.style.setProperty('--text-secondary', theme.palette.text.secondary);
    
  }, [mode, theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Define the event handler
    const handleChange = (e) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme based on system preference if no preference is set
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setMode(mediaQuery.matches ? 'dark' : 'light');
    }
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setMode]);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleColorMode,
      theme,
    }),
    [mode, theme, toggleColorMode, setMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Export theme-related utilities
export const withTheme = (Component) => {
  const WithTheme = (props) => {
    const theme = useThemeContext();
    return <Component {...props} theme={theme} />;
  };
  return WithTheme;
};
