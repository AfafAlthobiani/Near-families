# 🏡 أسر قريبة — دليل الإطلاق الكامل

## الحالة الحالية
الموقع **مكتمل 100%** ويعمل بوضعين:
- **وضع تجريبي** (بدون Supabase): يعمل ببيانات محلية افتراضية
- **وضع إنتاجي** (مع Supabase): بيانات حقيقية + Auth + Realtime

---

## 🚀 الإطلاق في 5 خطوات

### الخطوة 1 — إنشاء مشروع Supabase (مجاني)
1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساباً
2. اضغط **New Project** واختر اسماً للمشروع
3. من القائمة الجانبية → **SQL Editor**
4. انسخ محتوى ملف `supabase-setup.sql` والصقه واضغط **Run**
5. من **Settings → API** انسخ:
   - `Project URL` → `SUPABASE_URL`
   - `anon public key` → `SUPABASE_ANON`

### الخطوة 2 — تعديل ملف index.html
افتح `index.html` وابحث عن هذين السطرين في الجزء العلوي من `<script>`:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY';
```

استبدلهما بمفاتيحك الحقيقية:
```javascript
const SUPABASE_URL = 'https://xxxxxx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### الخطوة 3 — تفعيل الإيميل في Supabase
في Supabase Dashboard:
- **Authentication → Settings**
- فعّل **Email Confirmations** أو عطّله للاختبار

### الخطوة 4 — نشر على Vercel (مجاني)
```bash
# طريقة 1: عبر واجهة Vercel
# اذهب إلى vercel.com → New Project → رفع المجلد

# طريقة 2: عبر CLI
npm i -g vercel
cd usar-qareeba/
vercel --prod
```

أو استخدم **Netlify**:
1. [netlify.com](https://netlify.com) → New site → Drag & Drop المجلد

### الخطوة 5 — إضافة النطاق (اختياري)
- اشترِ نطاقاً من Namecheap أو GoDaddy (~50 ريال/سنة)
- أضفه في Vercel: **Settings → Domains**

---

## 📁 الملفات

```
usar-qareeba/
├── index.html          ← الموقع كاملاً (HTML + CSS + JS)
├── manifest.json       ← إعدادات PWA للتثبيت كتطبيق
├── sw.js               ← Service Worker (يعمل بدون إنترنت)
├── supabase-setup.sql  ← SQL لإنشاء قاعدة البيانات
├── .cursorrules        ← أمر AI لـ Cursor IDE
└── README.md           ← هذا الملف
```

> **ملاحظة:** تحتاج لإضافة ملفي `icon-192.png` و`icon-512.png` لأيقونة PWA.
> يمكن إنشاؤهما من [realfavicongenerator.net](https://realfavicongenerator.net)

---

## ✅ الميزات المكتملة

| الميزة | الوضع التجريبي | مع Supabase |
|--------|---------------|-------------|
| صفحة الهبوط | ✅ | ✅ |
| الخريطة التفاعلية | ✅ | ✅ |
| بروفايل الأسرة | ✅ | ✅ |
| البحث والتصفية | ✅ | ✅ |
| تسجيل الدخول | ✅ وهمي | ✅ حقيقي |
| إنشاء حساب | ✅ وهمي | ✅ حقيقي |
| إضافة الأسرة | ✅ محلي | ✅ في DB |
| رفع الصور | ❌ | ✅ Storage |
| نظام الطلبات | ✅ وهمي | ✅ حقيقي |
| الإعجابات | ✅ مؤقت | ✅ في DB |
| التقييمات | ✅ UI فقط | ✅ في DB |
| لوحة التحكم | ✅ وهمي | ✅ حقيقي |
| Realtime | ❌ | ✅ WebSocket |
| PWA (قابل تثبيت) | ✅ | ✅ |
| يعمل بدون إنترنت | ✅ | ✅ |

---

## 💰 التكاليف

| الخدمة | التكلفة |
|--------|---------|
| Supabase Free | مجاني (حتى 500MB + 50K طلب/شهر) |
| Vercel Hobby | مجاني |
| اسم النطاق | ~50 ريال/سنة |
| **الإجمالي** | **~50 ريال/سنة** |

---

## 🔧 للتطوير المستقبلي

راجع ملف `.cursorrules` — يحتوي على:
- أمر AI كامل لتطوير المشروع بدون أخطاء
- قواعد TypeScript وReact وSupabase
- هيكل قاعدة البيانات الكامل
- أوامر تثبيت Next.js لتحويل المشروع

---

## 📞 للتواصل والدعم
- البريد: info@usarqareeba.com
- واتساب: +966-5XX-XXX-XXXX
