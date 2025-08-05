import { savedToQueue } from "../utils/sosQueue";

export default function useSOS(props) {
  const sendPayload = async () => {
    const isVeryPoorNetwork = navigator.connection?.effectiveType === "2g";
    const payload = {
      type: "EMERGENCY",
      timestamp: new Date().toISOString(),
      location: props.location,
      network: props.isPoorConnection ? "Poor" : "Good",
    };

    if (!navigator.onLine || props.isPoorConnection || isVeryPoorNetwork) {
      await savedToQueue(payload);
      props.setStatus(
        "Offline or poor network, SOS saved. Will retry automatically"
      );

      if ("serviceWorker" in navigator && "SyncManager" in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register("sos-sync");
          console.log("background sync registered");
        } catch (err) {
          console.log("background sync registration failed");
          props.setStatus("Failed to send SOS. Try again later.");
        }
      }
      return;
    }
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        props.setStatus("SOS Sent!");
      })
      .catch(() => props.setStatus("Failed to send SOS"));
  };
  return { sendPayload };
}
