import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App.jsx';
import { StorefrontProvider } from './context/StorefrontContext.jsx';
import './styles/chrome.css';
import './styles/destinations.css';
import './styles/home.css';
import './styles/blend-lab.css';
import './styles/account.css';
import './styles/cart.css';
import './styles/profile.css';
import './styles/shop.css';
import './styles/app.css';
import './styles/faq-bot.css';
import './styles/admin.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StorefrontProvider>
        <App />
      </StorefrontProvider>
    </BrowserRouter>
  </StrictMode>,
);
