# أسر قريبة - دليل آمن للتشغيل والإطلاق

هذا المستند محدث بصيغة Security-First لتشغيل المشروع بأمان في بيئة حقيقية.

## نظرة سريعة
- التطبيق يعمل في وضعين:
   - Demo mode بدون Supabase (بيانات محلية).
   - Production mode مع Supabase (Auth + DB + Storage + Realtime).
- المزايا الحالية تشمل: الطلبات، الإعجابات، التقييمات، الإشعارات، مشاركة رابط البروفايل، وPWA.

## التشغيل المحلي
```bash
python3 -m http.server 8080
```

افتح المتصفح على:
```text
http://localhost:8080
```

## إعداد Supabase بشكل آمن
1. أنشئ مشروع Supabase جديد.
2. نفذ محتوى `supabase-setup.sql` من SQL Editor.
3. عدل القيم في `src/pages/app.js`:

```js
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY';
```

4. استخدم فقط `anon public key` في الواجهة الأمامية.
5. لا تضع أبداً `service_role` في أي ملف داخل المشروع.

## متطلبات الأمان قبل الإطلاق

### 1) مفاتيح وأسرار
- ممنوع نشر `service_role` أو أي Secret داخل الكود.
- إذا انكشف مفتاح بالخطأ: أنشئ مفتاحاً جديداً فوراً وألغِ القديم.

### 2) قاعدة البيانات (Supabase)
- فعّل RLS على كل الجداول الحساسة.
- اكتب سياسات تمنع أي مستخدم من قراءة/تعديل بيانات غيره.
- اختبر السياسات بحسابين مختلفين قبل الإطلاق.

### 3) المصادقة
- فعّل Email Confirmation في الإنتاج.
- فعّل حماية إضافية مثل Rate Limits (إن توفرت في الخطة).
- استخدم كلمات مرور قوية وحد أدنى للطول.

### 4) التخزين والملفات
- اسمح فقط بأنواع ملفات الصور المطلوبة (مثل jpg/png/webp).
- ضع حد أقصى لحجم الملفات.
- استخدم مسارات تخزين خاصة بالمستخدم/المشروع لمنع التداخل.

### 5) حماية الواجهة
- لا تستخدم `innerHTML` مع مدخلات المستخدم بدون تنظيف.
- طبّق sanitization على أي نص يظهر في الواجهة.
- تجنب حقن روابط غير موثوقة مباشرة في `href`.

### 6) النشر والرؤوس الأمنية
- فعّل HTTPS فقط.
- أضف Security Headers عبر المنصة (Vercel/Netlify) مثل:
   - `Content-Security-Policy`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`

### 7) المراقبة والاستجابة
- راقب أخطاء المصادقة والطلبات غير الطبيعية.
- احتفظ بخطة دوران مفاتيح (Key rotation) شهرية أو ربع سنوية.
- جهّز قناة إبلاغ أمنية للثغرات (security contact).

## قائمة فحص سريعة (Go-Live Security Checklist)
- [ ] لا يوجد أي Secret داخل المستودع.
- [ ] RLS مفعّل وسياسات الجداول مختبرة.
- [ ] Email confirmation مفعّل للإنتاج.
- [ ] قيود upload مفعلة (نوع/حجم).
- [ ] روابط خارجية آمنة (`rel="noopener"` عند `target="_blank"`).
- [ ] HTTPS + Security Headers مفعلة.
- [ ] نسخ احتياطي وقابلية استرجاع للبيانات.

## هيكل المشروع
```text
.
├── index.html
├── manifest.json
├── sw.js
├── supabase-setup.sql
├── README.md
└── src
      ├── main.js
      ├── pages/app.js
      └── styles/global.css
```

## النشر
يمكن النشر على GitHub Pages أو Vercel أو Netlify.

رابط GitHub Pages بعد التفعيل:
```text
https://afafalthobiani.github.io/Near-families/
```

## تنبيه مهم
هذا README يركز على تقليل المخاطر، لكنه لا يغني عن مراجعة أمنية دورية للكود وقاعدة البيانات قبل أي إطلاق تجاري واسع.
