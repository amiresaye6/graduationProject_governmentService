/**
 * Utility functions for working with the theme
 */

/**
 * Get theme-aware styles for a card component
 * @param {object} theme - The theme object
 * @returns {object} Card styles
 */
export const getCardStyles = (theme) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)'
  }
});

/**
 * Get theme-aware styles for a button component
 * @param {object} theme - The theme object
 * @param {string} [color='primary'] - The color variant
 * @returns {object} Button styles
 */
export const getButtonStyles = (theme, color = 'primary') => {
  const colorPalette = theme.palette[color] || theme.palette.primary;
  
  return {
    backgroundColor: colorPalette.main,
    color: colorPalette.contrastText,
    padding: '8px 16px',
    borderRadius: theme.shape.borderRadius,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: colorPalette.dark,
      boxShadow: theme.shadows[2]
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      cursor: 'not-allowed'
    }
  };
};

/**
 * Get theme-aware text styles
 * @param {object} theme - The theme object
 * @param {string} [variant='body1'] - The typography variant
 * @param {string} [color='textPrimary'] - The text color variant
 * @returns {object} Text styles
 */
export const getTextStyles = (theme, variant = 'body1', color = 'text.primary') => ({
  ...theme.typography[variant],
  color: theme.palette.text[color] || color,
  margin: 0
});

/**
 * Get theme-aware container styles
 * @param {object} theme - The theme object
 * @param {string} [bgColor='background.default'] - The background color
 * @returns {object} Container styles
 */
export const getContainerStyles = (theme, bgColor = 'background.default') => ({
  backgroundColor: theme.palette.background[bgColor] || bgColor,
  minHeight: '100vh',
  padding: theme.spacing(3)
});

/**
 * Get theme-aware form field styles
 * @param {object} theme - The theme object
 * @returns {object} Form field styles
 */
export const getFormFieldStyles = (theme) => ({
  marginBottom: theme.spacing(2),
  '& .MuiFormLabel-root': {
    color: theme.palette.text.secondary
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.divider
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main
    }
  }
});
