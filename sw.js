/* ══════════════════════════════════════════════
   أسر قريبة — Service Worker v1.2
   يتيح: تشغيل بدون إنترنت + تخزين مؤقت ذكي
══════════════════════════════════════════════ */
const CACHE = 'usar-qareeba-v1.2';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&family=Cairo:wght@600;700;900&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
];

// تثبيت: تخزين الملفات الأساسية
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// تفعيل: حذف الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// طلبات الشبكة: استراتيجية Network-first مع fallback للكاش
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // تجاهل Supabase وأي API خارجي
  if (url.hostname.includes('supabase.co') ||
      url.hostname.includes('googleapis.com') ||
      e.request.method !== 'GET') {
    return;
  }

  // الملفات الثابتة: Cache-first
  if (url.pathname.match(/\.(css|js|woff2?|png|jpg|svg|ico)$/)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // HTML + Navigation: Network-first, fallback للكاش
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  );
});

// Push Notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'أسر قريبة';
  const options = {
    body: data.body || 'لديك إشعار جديد',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    dir: 'rtl',
    lang: 'ar',
    data: data.url || '/',
    actions: [
      { action: 'view', title: 'عرض' },
      { action: 'close', title: 'إغلاق' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action !== 'close') {
    e.waitUntil(clients.openWindow(e.notification.data || '/'));
  }
});
