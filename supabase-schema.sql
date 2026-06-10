-- Supabase Schema for King Tech
-- Run this in the Supabase SQL Editor

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'VND',
  inventory INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  note TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'VND',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active',
  base_salary NUMERIC DEFAULT 0,
  allowance NUMERIC DEFAULT 0,
  joined_at TEXT,
  avatar TEXT,
  national_id TEXT,
  date_of_birth TEXT,
  contract_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'present',
  hours NUMERIC DEFAULT 0,
  overtime_hours NUMERIC DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (employee_id, date)
);

-- 6. Admins Table (Custom Auth)
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
