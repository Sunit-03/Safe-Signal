import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import toast, { Toaster } from "react-hot-toast";
import { EmergencyProvider } from "./context/EmergencyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EmergencyProvider>
      <App />
    </EmergencyProvider>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("✅ SW registered", reg);
  
          // 🔥 Listen for messages from SW
          navigator.serviceWorker.addEventListener("message", (event) => {
            const { type, message } = event.data;
            if (type === 'SOS_SENT') {
              toast.success(message || "SOS sent successfully from background!");
            }
          });
  
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });
    });
  }
  
