-- Chạy đoạn mã này trong Supabase SQL Editor để cấu hình Multi-Tenant
-- Bổ sung cột tenant vào tất cả các bảng dữ liệu

-- 1. Bảng products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tenant TEXT;
UPDATE public.products SET tenant = 'kingtech' WHERE tenant IS NULL;
ALTER TABLE public.products ALTER COLUMN tenant SET NOT NULL;

-- 2. Bảng orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tenant TEXT;
UPDATE public.orders SET tenant = 'kingtech' WHERE tenant IS NULL;
ALTER TABLE public.orders ALTER COLUMN tenant SET NOT NULL;

-- 3. Bảng contacts
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS tenant TEXT;
UPDATE public.contacts SET tenant = 'kingtech' WHERE tenant IS NULL;
ALTER TABLE public.contacts ALTER COLUMN tenant SET NOT NULL;

-- 4. Bảng employees
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS tenant TEXT;
UPDATE public.employees SET tenant = 'kingtech' WHERE tenant IS NULL;
ALTER TABLE public.employees ALTER COLUMN tenant SET NOT NULL;

-- 5. Bảng attendance_records
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS tenant TEXT;
UPDATE public.attendance_records SET tenant = 'kingtech' WHERE tenant IS NULL;
ALTER TABLE public.attendance_records ALTER COLUMN tenant SET NOT NULL;
