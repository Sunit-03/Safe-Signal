// --- Mini IDB KeyVal Shim ---
const dbPromise = (function () {
  const dbName = "keyval-store";
  const storeName = "keyval";
  let db;

  return new Promise((resolve, reject) => {
    const openreq = indexedDB.open(dbName, 1);
    openreq.onerror = () => reject(openreq.error);
    openreq.onsuccess = () => resolve(openreq.result);
    openreq.onupgradeneeded = () => {
      openreq.result.createObjectStore(storeName);
    };
  });
})();

function get(key) {
  return dbPromise.then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("keyval", "readonly");
        const store = tx.objectStore("keyval");
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function keys() {
  return dbPromise.then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("keyval", "readonly");
        const store = tx.objectStore("keyval");
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function del(key) {
  return dbPromise.then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("keyval", "readwrite");
        const store = tx.objectStore("keyval");
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      })
  );
}
// --- End of Shim ---

self.addEventListener("sync", (event) => {
    if (event.tag === "sendQueuedSOS") {
      event.waitUntil(
        sendQueuedSOS().then(() => {
          console.log("[SW] SOS sync completed. Sending message to client...");
  
          // Send confirmation back to client
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: "SOS_SYNC_SUCCESS" });
            });
          });
        })
      );
    }
  });
  

  async function sendQueuedSOS() {
    try {
      const allKeys = await keys();
      let sentAny = false;
  
      for (const key of allKeys) {
        const payload = await get(key);
        try {
          const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
          if (res.ok) {
            await del(key);
            sentAny = true;
            console.log("✅ Sent SOS and deleted from queue:", key);
          } else {
            console.error("❌ Server error, retrying later:", key);
          }
        } catch (err) {
          console.error("❌ Network error, will retry:", key);
        }
      }
  
      if (sentAny) {
        const allClients = await self.clients.matchAll();
        for (const client of allClients) {
          client.postMessage({
            type: "SOS_SYNC_SUCCESS",
          });
        }
      }
  
    } catch (e) {
      console.error("Error reading from IndexedDB:", e);
    }
  }
  