import React, { useEffect, useState } from 'react'

const useNetworkInfo = () => {
    const [isPoorConnection, setIsPoorConnection] = useState(false);
    useEffect(()=>{
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        const updateConnectionStatus = () => {
            if(!connection) return;

            const isSlow = connection.effectType === '2g' || connection.rtt > 300 || connection.downlink < 0.5;
            setIsPoorConnection(isSlow);
        };
        updateConnectionStatus();
        connection?.addEventListener('change', updateConnectionStatus);

        return () => connection?.removeEventListener('change', updateConnectionStatus);
    }, []);
  return {isPoorConnection};
}

export default useNetworkInfo;