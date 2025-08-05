import { useContext } from "react";
import { EmergencyProvider } from "../context/EmergencyContext";

const compressEmergency = (data) => ({
    t: data.type.chatAt(0),
    c: [data.coords.latitude, data.coords.longitude],
    a: Math.round(data.coords.accuracy),
    ts: Math.round(Date.now() / 1000),
})

export default function useSOS() {
    const {addToQueue} = useContext(EmergencyProvider);

    const triggerSOS = async (type) => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject,{
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });
            const emergency = {
                id: Date.now(),
                type,
                coords:{
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                },
                timeStamp: new Date().toISOString(),
            }
            const connection = navigator.connection
            const isPoor = !navigator.onLine || connection?.effectiveType === '2g' || connection?.rtt > 1000;
            if(!isPoor){
                await sendToServer(emergency);
            } else {
                addToQueue(emergency);
                registerBackgroundSync();
            }
        } catch (error) {
            console.log('SOS Error: ', error);
        }
    }
    const registerBackgroundSync = async() => {
        if('serviceWorker' in navigator){
            const sw = await navigator.serviceWorker.ready;
            sw.sync.register('sos-sync');
        }
    }
    const sendToServer = async(data) => {
        //API logic
    }

    return {triggerSOS};
}