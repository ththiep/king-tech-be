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
  '["Kinh doanh", "Kỹ thuật", "Nhân sự", "Kế toán", "Marketing"]'::jsonb,
  '{
    "active": {"labelVi": "Đang làm", "labelEn": "Active", "tone": "success"},
    "on_leave": {"labelVi": "Nghỉ phép", "labelEn": "On Leave", "tone": "warning"},
    "inactive": {"labelVi": "Tạm nghỉ", "labelEn": "Inactive", "tone": "danger"}
  }'::jsonb,
  '{
    "present": {"labelVi": "Có mặt", "labelEn": "Present", "tone": "success"},
    "late": {"labelVi": "Đi trễ", "labelEn": "Late", "tone": "warning"},
    "leave": {"labelVi": "Nghỉ phép", "labelEn": "Leave", "tone": "info"},
    "absent": {"labelVi": "Vắng", "labelEn": "Absent", "tone": "danger"},
    "half_day": {"labelVi": "Nửa ngày", "labelEn": "Half Day", "tone": "warning"}
  }'::jsonb
)
ON CONFLICT (tenant) DO NOTHING;
