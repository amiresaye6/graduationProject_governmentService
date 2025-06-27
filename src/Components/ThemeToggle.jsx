import React from 'react';
import { useThemeContext } from '../theme/ThemeContext'; // تأكد إن المسار صحيح
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Tooltip } from '@mui/material';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <Tooltip title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}>
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
                }}
            >
                {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;

