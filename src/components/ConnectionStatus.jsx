import { useState } from "react";

export default function ConnectionStatus() {
    const [status, setStatus] = useState("good");
    return (
        <div className={`p-2 text-center ${status === 'offline' ? 'bg-red-500' : status === 'poor' ? 'bg-yellow-500' : 'bg-green-500'}`}>
            {status === 'offline'? 'Offline' : status === 'poor'? 'Poor Connection' : 'ONLINE'}
        </div>
    )
}