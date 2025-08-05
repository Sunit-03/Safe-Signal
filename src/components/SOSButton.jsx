import React, { useEffect, useState } from "react";
import useGeoLocation from "../hooks/useGeoLocation";
import useNetworkInfo from "../hooks/useNetworkInfo";
import useSOS from "./useSOS";

const SOSButton = () => {
  const { location, error: locationError } = useGeoLocation();
  const { isPoorConnection } = useNetworkInfo();
  const [status, setStatus] = useState("");
  const sos = useSOS({ isPoorConnection, location, setStatus });

  useEffect(() => {
    if (!location) {
        setStatus("Fetching Location...");
      }
    //if (!isPoorConnection) {
      sos.sendPayload();
    //}
  }, [isPoorConnection]);

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