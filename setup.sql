-- 1. 상담 신청 내역을 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS quotations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip VARCHAR(45),           -- 신청자 IP 주소
    name VARCHAR(100),        -- 신청자 이름
    phone VARCHAR(20),       -- 연락처 (010-XXXX-XXXX 형식)
    model VARCHAR(100),      -- 희망 모델
    type VARCHAR(50),        -- 상품 유형 (장기렌트/리스) - 팝업 폼용
    source VARCHAR(50)       -- 신청 경로 (header / popup)
);

-- 2. 보안 정책 설정 (Cloudflare Workers에서 직접 접근할 수 있도록 설정)
-- 참고: Anon Key를 사용하는 경우 모든 사용자가 insert 할 수 있도록 허용합니다.
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for everyone" ON quotations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users only" ON quotations
FOR SELECT USING (auth.role() = 'authenticated');

-- 3. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
