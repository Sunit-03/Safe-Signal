import {set, get, del} from 'idb-keyval';

const QUEUE_KEY = 'sos-queue';
const STORAGE_KEY = 'queued-sos-reports';

export const savedToQueue = async (payload) => {
  const key = `sos-${Date.now()}`;
  await set(key, payload);
};


export function getQueue(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function clearQueue(){
    localStorage.removeItem(STORAGE_KEY);
}

// export const addToQueue = async (sosData) => {
//     const currentQueue = (await get(QUEUE_KEY)) || [];
//     currentQueue.push(sosData);
//     await set(QUEUE_KEY, currentQueue);
// };

// export const getQueue = () =>  get(QUEUE_KEY) || [];

// export const clearQueue = async () => {
//     await del(QUEUE_KEY);
// }