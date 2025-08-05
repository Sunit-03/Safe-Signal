import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const useSOSSyncListener = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker API not available");
      return;
    }
    
    // Verify service worker registration
    const checkRegistration = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        console.log("Service Worker registration:", registration);
        console.log("Active worker:", registration.active);
        return true;
      } catch (err) {
        console.error("Service Worker registration error:", err);
        return false;
      }
    };
    
    const handleSync = async (event) => {
      console.log("Sync event received:", event);
      if (event.tag === "sos-sync") {
        const isRegistered = await checkRegistration();
        if (isRegistered) {
          toast.success("📡 All queued SOS requests sent successfully!");
        }
      }
    };
    
    const handleMessage = (event) => {
      console.log("Message event received:", event);
      if (event.data?.type === "SOS_SYNC_SUCCESS") {
        toast.success("📡 SOS synced successfully when back online!");
      }
    };
    
    const handleError = (error) => {
      console.error("Service Worker error:", error);
      toast.error("⚠️ Failed to sync SOS requests");
    };
    
    // Initialize with registration check
    checkRegistration().then(isRegistered => {
      if (isRegistered) {
        navigator.serviceWorker.addEventListener("sync", handleSync);
        navigator.serviceWorker.addEventListener("message", handleMessage);
        navigator.serviceWorker.addEventListener("error", handleError);
        console.log("Event listeners registered");
      }
    });
    
    return () => {
      navigator.serviceWorker.removeEventListener("sync", handleSync);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      navigator.serviceWorker.removeEventListener("error", handleError);
    };
  }, []);
};