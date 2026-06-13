-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  tenant TEXT PRIMARY KEY,
  departments JSONB NOT NULL,
  work_statuses JSONB NOT NULL,
  attendance_statuses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings for kingtech tenant
INSERT INTO public.settings (tenant, departments, work_statuses, attendance_statuses)
VALUES (
  'kingtech',
  '[
    {"id": "d1000000-0000-0000-0000-000000000000", "labelVi": "Kinh doanh", "labelEn": "Sales", "tone": "neutral"},
    {"id": "d2000000-0000-0000-0000-000000000000", "labelVi": "Kỹ thuật", "labelEn": "Engineering", "tone": "neutral"},
    {"id": "d3000000-0000-0000-0000-000000000000", "labelVi": "Nhân sự", "labelEn": "HR", "tone": "neutral"},
    {"id": "d4000000-0000-0000-0000-000000000000", "labelVi": "Kế toán", "labelEn": "Accounting", "tone": "neutral"},
    {"id": "d5000000-0000-0000-0000-000000000000", "labelVi": "Marketing", "labelEn": "Marketing", "tone": "neutral"}
  ]'::jsonb,
  '[
    {"id": "w1000000-0000-0000-0000-000000000000", "labelVi": "Đang làm", "labelEn": "Working", "tone": "success"},
    {"id": "w2000000-0000-0000-0000-000000000000", "labelVi": "Thử việc", "labelEn": "Probation", "tone": "info"},
    {"id": "w3000000-0000-0000-0000-000000000000", "labelVi": "Bán thời gian", "labelEn": "Part-time", "tone": "warning"},
    {"id": "w4000000-0000-0000-0000-000000000000", "labelVi": "Đã nghỉ", "labelEn": "Resigned", "tone": "danger"}
  ]'::jsonb,
  '[
    {"id": "a1000000-0000-0000-0000-000000000000", "labelVi": "Có mặt", "labelEn": "Present", "tone": "success"},
    {"id": "a2000000-0000-0000-0000-000000000000", "labelVi": "Đi trễ", "labelEn": "Late", "tone": "warning"},
    {"id": "a3000000-0000-0000-0000-000000000000", "labelVi": "Nghỉ phép", "labelEn": "Leave", "tone": "info"},
    {"id": "a4000000-0000-0000-0000-000000000000", "labelVi": "Vắng", "labelEn": "Absent", "tone": "danger"},
    {"id": "a5000000-0000-0000-0000-000000000000", "labelVi": "Nửa ngày", "labelEn": "Half Day", "tone": "warning"}
  ]'::jsonb
)
ON CONFLICT (tenant) DO NOTHING;
