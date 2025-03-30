import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import { ThemeProvider } from './contexts/ThemeContext'; // Import the provider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AppRouter />
        </ThemeProvider>
    </React.StrictMode>
);
