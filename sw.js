const CACHE_NAME = 'almuraibit-v2';
// هنا أضفنا /Test/ قبل كل ملف ليعرف المتصفح مكانها الصحيح في GitHub
const urlsToCache = [
  '/Test/',
  '/Test/index.html',
  '/Test/manifest.json',
  '/Test/icon.svg'
];

// تثبيت الخدمة وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع طلبات الملفات
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
            cache.put(event.request, responseClone);
          }
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// نظام الإشعارات الفورية
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من تطبيق المريبيط',
    icon: '/Test/icon.svg',
    badge: '/Test/icon.svg',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
    actions: [
      { action: 'open', title: 'فتح التطبيق' },
      { action: 'close', title: 'إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('دعوات المريبيط', options)
  );
});

// فتح التطبيق عند الضغط على الإشعار
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/Test/')
  );
});
