-- Align existing Supabase tables with the current backend API contract.
-- Safe to run more than once.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Products: backend uses stock/status/unit, not inventory/active.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS unit TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'VND',
ADD COLUMN IF NOT EXISTS tenant TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'inventory'
  ) THEN
    UPDATE public.products
    SET stock = inventory
    WHERE stock IS NULL AND inventory IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'active'
  ) THEN
    UPDATE public.products
    SET status = CASE WHEN active IS FALSE THEN 'inactive' ELSE 'active' END
    WHERE status IS NULL AND active IS NOT NULL;
  END IF;
END $$;

UPDATE public.products
SET stock = 0
WHERE stock IS NULL;

UPDATE public.products
SET status = 'active'
WHERE status IS NULL;

ALTER TABLE public.products
ALTER COLUMN sku DROP NOT NULL,
ALTER COLUMN stock SET DEFAULT 0,
ALTER COLUMN stock SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'active',
ALTER COLUMN status SET NOT NULL;

-- Orders: module is inactive by default, but schema should match the current repository contract.
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tenant TEXT,
ADD COLUMN IF NOT EXISTS customer_id TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

ALTER TABLE public.orders
ALTER COLUMN customer_phone DROP NOT NULL;

-- Contacts: backend accepts optional email and stores company/address/note/type.
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS tenant TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS note TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

ALTER TABLE public.contacts
ALTER COLUMN email DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contacts'
      AND column_name = 'message'
  ) THEN
    ALTER TABLE public.contacts ALTER COLUMN message DROP NOT NULL;
  END IF;
END $$;

-- Employees: backend relies on tenant, audit fields and soft delete.
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS tenant TEXT,
ADD COLUMN IF NOT EXISTS allowance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS national_id TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth TEXT,
ADD COLUMN IF NOT EXISTS contract_code TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

-- Attendance: backend accepts checkIn/checkOut and BaseRepository filters deleted_at.
ALTER TABLE public.attendance_records
ADD COLUMN IF NOT EXISTS tenant TEXT,
ADD COLUMN IF NOT EXISTS check_in TEXT,
ADD COLUMN IF NOT EXISTS check_out TEXT,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admins(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.admins(id);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs: BaseRepository query helpers expect deleted_at.
ALTER TABLE IF EXISTS public.audit_logs
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Assets: keep soft-delete shape consistent for future repository use.
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.assets
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON public.orders(tenant);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON public.contacts(tenant);
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON public.employees(tenant);
CREATE INDEX IF NOT EXISTS idx_attendance_records_tenant ON public.attendance_records(tenant);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON public.attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant);
