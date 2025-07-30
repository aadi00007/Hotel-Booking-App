import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppProvider } from './context/AppContext.jsx';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error('Clerk Publishable Key is missing. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
  throw new Error('Clerk Publishable Key is required.');
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element with ID "root" not found in the document.');
  throw new Error('Root element is missing.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/" // Original
      signInUrl="/sign-in" // Ensures client-side sign-in
      afterSignInUrl="/" // Prevents full reload after login
      telemetry={false} // Original
    >
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);