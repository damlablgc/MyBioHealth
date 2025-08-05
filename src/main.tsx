import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/ThemeProvider';
import './style.css';

const container = document.getElementById('app');
if (container) {
  createRoot(container).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
