/*window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker registered successfully.'))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  };
*/
  window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('Service Worker registered successfully.');
  
          askNotificationPermission().then(() => {
            subscribeUserToPush(registration);
          });
        })
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  };
  
  function askNotificationPermission() {
    return Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
      }
    });
  }
 
  function subscribeUserToPush(registration) {
    const vapidPublicKey = 'BLSirykAvybJ-FUyEEKKwePL09f7dvd9tupui8s0DNxdNPAGATi44VqNecwsvb0OQPqTgozfqMO88kiTpXx2Oi4';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
  
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    })
    .then(subscription => {
      console.log('User is subscribed:', subscription);
  
      return fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  