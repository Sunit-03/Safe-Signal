import { useEffect, useState } from "react";

export default function NetworkStatus() {
    const [connection, setConnection] = useState({
        online: navigator.onLine,
        effectiveType: navigator.connection.effectiveType,
    });

    useEffect(()=>{
        const updateStatus = () => {
            setConnection({
                online: navigator.onLine,
                effectiveType: navigator.connection.effectiveType || "unknown",
            })
        };

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);
        navigator.connection?.addEventListener("change", updateStatus);

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
            navigator.connection?.removeEventListener("change", updateStatus);
        };
    }, []);

    return (
        <div className="text-xs text-gray-500 mt-1">
            {connection.online ? "Online" : "Offline"} | Network: {connection.effectiveType}
        </div>
    );
}