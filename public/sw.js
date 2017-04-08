'use strict';

self.addEventListener('install', function(event) {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
	console.log('Received push');
	// let payload = JSON.parse(event.data.text());
	// let clickurl = payload.url;

	let title = 'GDG NIT Surat';  
  	let body = 'Welcome! You ll be notified about all the events by this medium.';  
  	let icon = './gg.png';  
  	let tag = 'simple-push-demo-notification-tag';

	event.waitUntil(
		self.registration.showNotification(title, {
			body : body,
			tag : tag,
			icon : icon
		})
	);
});