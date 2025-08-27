import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key from CRA env
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key in .env.local");
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
