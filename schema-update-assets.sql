-- SQL Migration: Create assets table for tracked uploads
-- Run this script in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Optional, depending on your project needs)
-- ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
