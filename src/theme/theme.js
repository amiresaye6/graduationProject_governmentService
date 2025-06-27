import { createTheme } from '@mui/material/styles';
import { themeSettings, componentOverrides } from './themeConfig';

// Define color palettes for light and dark themes
const lightPalette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
  status: {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
  },
};

const darkPalette = {
  primary: {
    main: '#90caf9',
    light: '#e3f2fd',
    dark: '#42a5f5',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: '#fff',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
  status: {
    success: '#66bb6a',
    error: '#f44336',
    warning: '#ffa726',
    info: '#29b6f6',
  },
};

// Create theme with custom variables
const createCustomTheme = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  
  // Create base theme with common settings
  const baseTheme = createTheme({
    palette: {
      mode,
      ...palette,
    },
    ...themeSettings,
  });
  
  // Create the theme with component overrides
  const theme = createTheme({
    ...baseTheme,
    components: {
      ...componentOverrides(baseTheme),
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          ':root': {
            '--primary-main': palette.primary.main,
            '--primary-light': palette.primary.light,
            '--primary-dark': palette.primary.dark,
            '--secondary-main': palette.secondary.main,
            '--secondary-light': palette.secondary.light,
            '--secondary-dark': palette.secondary.dark,
            '--background-default': palette.background.default,
            '--background-paper': palette.background.paper,
            '--text-primary': palette.text.primary,
            '--text-secondary': palette.text.secondary,
            '--text-disabled': palette.text.disabled,
            '--divider': palette.divider,
            '--success-main': palette.status.success,
            '--error-main': palette.status.error,
            '--warning-main': palette.status.warning,
            '--info-main': palette.status.info,
          },
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        }),
      },
    },
  });
  
  return theme;
};

export { createCustomTheme, lightPalette, darkPalette };
