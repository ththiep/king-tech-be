-- Supabase Schema for King Tech
-- Run this in the Supabase SQL Editor for a fresh project.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Admins Table (Custom Auth)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (tenant, email)
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  price NUMERIC NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'VND',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  unit TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES public.admins(id),
  updated_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
-- Runtime API is inactive by default. Enable only after transaction-safe stock handling is implemented.
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  note TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  currency TEXT DEFAULT 'VND',
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES public.admins(id),
  updated_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,
  address TEXT,
  note TEXT,
  type TEXT DEFAULT 'customer',
  created_by UUID REFERENCES public.admins(id),
  updated_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,
  tenant TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active',
  base_salary NUMERIC DEFAULT 0 CHECK (base_salary >= 0),
  allowance NUMERIC DEFAULT 0 CHECK (allowance >= 0),
  joined_at TEXT,
  avatar TEXT,
  national_id TEXT,
  date_of_birth TEXT,
  contract_code TEXT,
  created_by UUID REFERENCES public.admins(id),
  updated_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (tenant, code),
  UNIQUE (tenant, email)
);

-- 6. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
  tenant TEXT NOT NULL,
  date TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT DEFAULT 'present',
  hours NUMERIC DEFAULT 0 CHECK (hours >= 0),
  overtime_hours NUMERIC DEFAULT 0 CHECK (overtime_hours >= 0),
  note TEXT,
  created_by UUID REFERENCES public.admins(id),
  updated_by UUID REFERENCES public.admins(id),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (employee_id, date)
);

-- 7. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  tenant TEXT PRIMARY KEY,
  departments JSONB NOT NULL,
  work_statuses JSONB NOT NULL,
  attendance_statuses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON public.orders(tenant);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON public.contacts(tenant);
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON public.employees(tenant);
CREATE INDEX IF NOT EXISTS idx_attendance_records_tenant ON public.attendance_records(tenant);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON public.attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON public.audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
