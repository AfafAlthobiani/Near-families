-- ══════════════════════════════════════════════════════════
--  أسر قريبة — Supabase Database Setup
--  انسخ هذا الملف كاملاً في Supabase SQL Editor وشغّله
--  الرابط: https://supabase.com/dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════

-- تفعيل امتدادات مطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════
-- 1. جدول الأسر المنتجة
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS families (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE,
  cat           TEXT NOT NULL CHECK (cat IN ('sweets','cooking','bakery','coffee','matcha','handmade')),
  emoji         TEXT NOT NULL DEFAULT '🏡',
  desc          TEXT,
  phone         TEXT NOT NULL,
  instagram     TEXT,
  snap          TEXT,
  tiktok        TEXT,
  website       TEXT,
  image_url     TEXT,
  lat           DECIMAL(10,7) NOT NULL DEFAULT 24.467,
  lng           DECIMAL(10,7) NOT NULL DEFAULT 39.614,
  is_active     BOOLEAN DEFAULT true,
  is_verified   BOOLEAN DEFAULT false,
  working_hours JSONB DEFAULT '[]',
  avg_rating    DECIMAL(3,2),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS للأسر
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
CREATE POLICY "families_public_read"   ON families FOR SELECT USING (is_active = true);
CREATE POLICY "families_owner_insert"  ON families FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "families_owner_update"  ON families FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "families_owner_delete"  ON families FOR DELETE USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════
-- 2. جدول المنتجات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  desc        TEXT,
  price       DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  emoji       TEXT DEFAULT '🍽️',
  image_url   TEXT,
  in_stock    BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (true);
CREATE POLICY "products_owner_write"  ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM families WHERE id = family_id AND user_id = auth.uid()));

-- ══════════════════════════════════════════════════════════
-- 3. جدول الطلبات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id        UUID NOT NULL REFERENCES families(id),
  customer_id      UUID REFERENCES auth.users(id),
  items            JSONB NOT NULL DEFAULT '[]',
  total            DECIMAL(10,2) NOT NULL DEFAULT 0,
  status           TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','preparing','ready','done','cancelled')),
  note             TEXT,
  delivery_address TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- الزبون يرى طلباته + صاحب الأسرة يرى طلباتها
CREATE POLICY "orders_customer_select" ON orders FOR SELECT
  USING (
    customer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM families WHERE id = family_id AND user_id = auth.uid())
  );
CREATE POLICY "orders_customer_insert" ON orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "orders_owner_update" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM families WHERE id = family_id AND user_id = auth.uid()));

-- ══════════════════════════════════════════════════════════
-- 4. جدول الإعجابات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS likes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (family_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "likes_public_read"   ON likes FOR SELECT USING (true);
CREATE POLICY "likes_auth_insert"   ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_auth_delete"   ON likes FOR DELETE USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════
-- 5. جدول التقييمات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id),
  customer_id UUID REFERENCES auth.users(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read"     ON reviews FOR SELECT USING (true);
-- فقط المستخدمين المسجلين يقيّمون (لا يشترط إتمام طلب في هذا الإصدار)
CREATE POLICY "reviews_auth_insert"     ON reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id AND auth.uid() IS NOT NULL);

-- ══════════════════════════════════════════════════════════
-- 6. جدول الإشعارات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  data       JSONB DEFAULT '{}',
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifs_owner_all" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════
-- 7. جدول العروض والكوبونات
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS offers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id     UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  desc          TEXT,
  discount_type TEXT DEFAULT 'percent' CHECK (discount_type IN ('percent','fixed')),
  discount_val  DECIMAL(10,2) NOT NULL,
  code          TEXT,
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_public_read"  ON offers FOR SELECT USING (is_active = true);
CREATE POLICY "offers_owner_write"  ON offers FOR ALL
  USING (EXISTS (SELECT 1 FROM families WHERE id = family_id AND user_id = auth.uid()));

-- ══════════════════════════════════════════════════════════
-- 8. Realtime — تفعيل البث المباشر
-- ══════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE families;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE likes;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ══════════════════════════════════════════════════════════
-- 9. Trigger — تحديث updated_at تلقائياً
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_families_updated BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated   BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════
-- 10. Trigger — حساب متوسط التقييم تلقائياً
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION refresh_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE families
  SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE family_id = NEW.family_id)
  WHERE id = NEW.family_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_rating AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_avg_rating();

-- ══════════════════════════════════════════════════════════
-- 11. Supabase Storage — إنشاء bucket للصور
--     شغّل هذا في Storage → Policies
-- ══════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) VALUES ('family-images', 'family-images', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "family_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'family-images');
CREATE POLICY "family_images_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'family-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "family_images_owner_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'family-images' AND owner = auth.uid());

CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "product_images_owner_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND owner = auth.uid());

-- ══════════════════════════════════════════════════════════
-- 12. Seed Data — بيانات تجريبية (اختياري)
-- ══════════════════════════════════════════════════════════
-- أضف هذه البيانات بعد إنشاء مستخدم تجريبي وأضف user_id
-- مثال:
-- INSERT INTO families (user_id, name, slug, cat, emoji, desc, phone, lat, lng)
-- VALUES ('YOUR_USER_ID', 'حلويات أم سارة', 'halawiyat-om-sara', 'sweets', '🍰',
--         'تخصصنا في الحلويات المنزلية الشرقية والغربية', '+966501234567', 24.470, 39.613);
