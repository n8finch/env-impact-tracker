import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// PostHog analytics - only initializes when VITE_POSTHOG_KEY is set
const posthogKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
if (posthogKey) {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'never', // no PII - privacy-first
    });
  });
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
