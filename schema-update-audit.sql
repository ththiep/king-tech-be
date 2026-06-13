-- ==========================================
-- BẢNG: audit_logs (Nhật ký hệ thống)
-- ==========================================
CREATE TABLE public.audit_logs (
    id VARCHAR PRIMARY KEY,
    tenant VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL, -- Người thực hiện thao tác
    action VARCHAR NOT NULL, -- CREATE, UPDATE, DELETE
    resource VARCHAR NOT NULL, -- EMPLOYEE, PRODUCT, ORDER, etc.
    resource_id VARCHAR NOT NULL, -- ID của bản ghi bị tác động
    old_values JSONB, -- Dữ liệu cũ trước khi thay đổi (null nếu là CREATE)
    new_values JSONB, -- Dữ liệu mới sau khi thay đổi (null nếu là DELETE)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin chỉ được quyền ĐỌC (SELECT) audit_logs của doanh nghiệp mình, không được phép SỬA/XÓA.
-- (Bởi vì log phải là immutable từ phía client. Server sẽ dùng Service Role để insert log)
CREATE POLICY "Enable read access for authenticated users in same tenant" ON public.audit_logs
    FOR SELECT
    USING (auth.uid() IS NOT NULL AND tenant = current_setting('request.jwt.claims', true)::json->>'tenant');

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_audit_logs_tenant ON public.audit_logs(tenant);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_id ON public.audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
