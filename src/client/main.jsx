import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import { ThemeProvider } from './contexts/ThemeContext'; // Import the provider
import { UserProvider } from './contexts/UserContext'; // Import the provider
import './index.css';
import { User } from 'lucide-react';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <ThemeProvider>
                <AppRouter />
            </ThemeProvider>
        </UserProvider>
    </React.StrictMode>
);
