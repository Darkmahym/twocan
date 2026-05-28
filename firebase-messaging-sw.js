// firebase-messaging-sw.js
// Place this at the ROOT of your GitHub repo (same level as index.html)
// URL will be: https://darkmahym.github.io/twocan/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:           "AIzaSyAExzqIwlAH1ntffdei_4izYws54_TIRMI",
  authDomain:       "tracker-1f84b.firebaseapp.com",
  projectId:        "tracker-1f84b",
  storageBucket:    "tracker-1f84b.firebasestorage.app",
  messagingSenderId:"781054078792",
  appId:            "1:781054078792:web:b54b734c095a8e06480d7d"
});

const messaging = firebase.messaging();

// Handle background push messages (tab hidden or browser minimised)
messaging.onBackgroundMessage(function(payload) {
  var title = (payload.notification && payload.notification.title) || 'Twocan Africa';
  var body  = (payload.notification && payload.notification.body)  || '';
  self.registration.showNotification(title, {
    body: body,
    icon: 'https://darkmahym.github.io/twocan/favicon.ico',
    badge: 'https://darkmahym.github.io/twocan/favicon.ico',
    tag: 'twocan-' + Date.now(),
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

// Clicking the notification opens / focuses the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow('https://darkmahym.github.io/twocan/');
    })
  );
});

// Handle postMessage from the main page (background tab scenario)
self.addEventListener('message', function(event) {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return;
  self.registration.showNotification(event.data.title || 'Twocan Africa', {
    body:  event.data.body  || '',
    icon:  'https://darkmahym.github.io/twocan/favicon.ico',
    badge: 'https://darkmahym.github.io/twocan/favicon.ico',
    tag:   'twocan-' + Date.now(),
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: 'https://darkmahym.github.io/twocan/' }
  });
});
