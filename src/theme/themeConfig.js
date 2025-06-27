/**
 * Theme configuration file
 * Contains all theme-related settings and customizations
 */

export const themeSettings = {
  // Typography
  typography: {
    fontFamily: [
      'Tajawal', // Arabic font
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    // Arabic font settings
    fontFamilyArabic: [
      'Tajawal',
      '-apple-system',
      'sans-serif',
    ].join(','),
    // Responsive typography
    htmlFontSize: 16,
    fontSize: 14,
    // Headings
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width: 600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width: 600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width: 600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width: 600px)': {
        fontSize: '1.3rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width: 600px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    // Body text
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.01071em',
    },
    // Buttons
    button: {
      textTransform: 'none', // Prevent uppercase transformation
      fontWeight: 600,
      letterSpacing: '0.02857em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  
  // Shape
  shape: {
    borderRadius: 8,
  },
  
  // Spacing
  spacing: 8,
  
  // Transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  // Z-index
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

/**
 * Custom theme overrides for components
 */
export const componentOverrides = (theme) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        padding: '8px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: theme.shadows[2],
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: theme.shadows[1],
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        marginBottom: theme.spacing(2),
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: theme.palette.divider,
      },
    },
  },
});
