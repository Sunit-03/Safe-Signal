import { get, set } from "idb-keyval";
import { createContext, useEffect, useState } from "react";

const EmergencyContext = createContext();

export function EmergencyProvider({children}){
    const [queue, setQueue] = useState([]);

    useEffect(()=>{
        const loadQueue = async () => setQueue(await get('sosQueue') || []);
        loadQueue();
    }, []);

    const addToQueue = async (emergency) => {
        const newQueue = [...queue, emergency];
        await set('sosQueue', newQueue);
        setQueue(newQueue);
    }

    const removeFromQueue = async (id) => {
        const newQueue = queue.filter((emergency) => emergency.id !== id);
        await set('sosQueue', newQueue);
        setQueue(newQueue);
    }
    return (
        <EmergencyContext.Provider value={{queue, addToQueue, removeFromQueue}}>
            {children}
        </EmergencyContext.Provider>
    )
}