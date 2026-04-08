import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PostHogProvider } from "@posthog/react";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://eebe0858a148179a3c4f504ddccb7236@o4511184645914624.ingest.de.sentry.io/4511184655745104",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: "production",
  sendDefaultPii: true,
});
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN}
      options={options}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
);
