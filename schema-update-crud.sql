-- Chạy đoạn mã này trong Supabase SQL Editor để cập nhật Schema
-- Bổ sung các tính năng Xóa mềm (Soft Delete) và Lưu vết (Audit Trails)

-- 1. Bảng products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

-- 2. Bảng orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

-- 3. Bảng contacts
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

-- 4. Bảng employees
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

-- 5. Bảng attendance_records
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);
