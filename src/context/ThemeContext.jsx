import React, { createContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const lightTheme = {
    background: '#f433',
    color: '#333',
    primary: '#3498db',
    gradient: 'linear-gradient(0deg, #f66 0, #6cf 50%, #FFCC33 100%)'
};

const darkTheme = {
    background: '#444555',
    color: '#fff',
    primary: '#ecf0f1',
    gradient: 'linear-gradient(0deg, #000 0, #f66 40%, #000 100%)'
};

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
});

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <StyledThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };