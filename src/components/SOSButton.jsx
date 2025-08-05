import React, { useEffect, useState } from "react";
import useGeoLocation from "../hooks/useGeoLocation";
import useNetworkInfo from "../hooks/useNetworkInfo";
import useSOS from "./useSOS";

// import useSOS from "../hooks/useSOS";

const SOSButton = () => {
  const { location, error: locationError } = useGeoLocation();
  const { isPoorConnection } = useNetworkInfo();
  const [status, setStatus] = useState("");
  const sos = useSOS({ isPoorConnection, location, setStatus });

  useEffect(() => {
    if (!location) {
        setStatus("Fetching Location...");
      }
    if (!isPoorConnection) {
      sos.sendPayload();
    }
  }, [isPoorConnection]);

  //   const handleSendSOS = async () => {
  //     if (!location) {
  //       setStatus("Fetching Location...");
  //       return;
  //     }

  //     const payload = {
  //       type: "EMERGENCY",
  //       timestamp: new Date().toISOString(),
  //       location,
  //       network: isPoorConnection ? "Poor" : "Good",
  //     };

  //     const isVeryPoorNetwork = navigator.connection?.effectiveType === "2g";

  //     if (!navigator.onLine || isPoorConnection || isVeryPoorNetwork) {
  //       await savedToQueue(payload);
  //       setStatus("Offline or poor network, SOS saved. Will retry automatically");

  //       if ("serviceWorker" in navigator && "SyncManager" in window) {
  //         try {
  //           const registration = await navigator.serviceWorker.ready;
  //           await registration.sync.register("sos-sync");
  //           console.log("background sync registered");
  //         } catch (err) {
  //           console.log("background sync registration failed");
  //           setStatus("Failed to send SOS. Try again later.");
  //         }
  //       }
  //       return;
  //     }
  //     fetch("https://jsonplaceholder.typicode.com/posts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     })
  //       .then(() => setStatus("SOS Sent!"))
  //       .catch(() => setStatus("Failed to send SOS"));
  //   };
  console.log("location", location);
  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-2xl shadow-xl bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold text-red-600">Emergency SOS</h2>
      <button
        onClick={sos.sendPayload}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl text-lg"
      >
        Send SOS 🚨
      </button>
      <div className="text-sm text-gray-700">
        {status}
        {location ? (
        <p>
          Your location: Latitude {location.latitude}, Longitude {location.longitude}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
      </div>
      <div className="text-xs text-gray-500 italic">
        Network: {isPoorConnection ? "Poor" : "Good"}
      </div>
    </div>
  );
};

export default SOSButton;

// export default function SOSButton() {
//     const {triggerSOS} = useSOS();
//     return (
//         <button
//             onClick={() => triggerSOS('medical')}
//             className="fixed bottom-10 right-10 bg-red-600 text-white p-6 rounded-full shadow-lg"
//         >
//             EMERGENCY SOS! 🚨
//         </button>
//     )
// }
