import React from 'react';
import { useThemeContext } from './ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Tooltip } from '@mui/material';

const ThemeToggle = () => {
    const { theme, toggleTheme, isDark } = useThemeContext();

    return (
        <Tooltip title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}>
            <IconButton
                onClick={toggleTheme}
                color="inherit"
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 1000,
                    backgroundColor: 'var(--primary-main)',
                    color: 'var(--primary-contrast-text)',
                    '&:hover': {
                        backgroundColor: 'var(--primary-dark)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px var(--shadow-medium)',
                }}
            >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;

