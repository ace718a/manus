# 카슐랭 자동차 렌트/리스 프로모션 사이트 - 프로젝트 인수인계 가이드

## 📋 프로젝트 개요

**프로젝트명**: Carchelin (카슐랭) 자동차 렌트/리스 프로모션 사이트

**목표**: GitHub + Cloudflare Workers + Supabase를 이용한 풀스택 웹 애플리케이션 구현

---

## 🎯 요구사항

### 1. 프로모션 페이지
- 원본 HTML 디자인 완벽 유지
- 모든 이미지, CSS, JavaScript 정상 작동
- 반응형 디자인 유지

### 2. 상담 신청 폼 (2개 위치)
**위치:**
- 헤더 네비게이션 (폼 ID: `reqFrm`)
- 메인 섹션 (폼 ID: `reqFrm2`)

**입력 필드:**
- 이름 (name)
- 연락처 (hp2, hp3 - 010-XXXX-XXXX 형식)
- 희망모델 (item2)
- 개인정보 동의 체크박스 (agree1)

### 3. 폼 제출 처리
**데이터 흐름:**
```
사용자 폼 입력
    ↓
Cloudflare Workers API
    ↓
1️⃣ Supabase DB에 저장
2️⃣ 리플알바로 POST 전송
    ↓
성공 응답 + 모달 팝업
```

**저장할 정보:**
- 신청시간 (자동 수집)
- IP 주소 (자동 수집)
- 이름 (사용자 입력)
- 연락처 (사용자 입력)
- 희망모델 (사용자 입력)

### 4. 리플알바 연동
- **URL**: https://replyalba.co.kr/proc/submit.frm.php
- **방식**: POST (application/x-www-form-urlencoded)
- **전송 데이터**: name, hp2, hp3, item2, code (T2KCXF94DF)

### 5. 관리자 페이지
- 모든 신청 내역 조회
- 신청시간 기준 시간순 정렬
- 신청자 정보 표시 (시간, 이름, 연락처, 희망모델, IP)

---

## 📁 파일 구조

### 다운로드 파일
1. **carchelin_final_v10.zip** - 원본 HTML 및 정적 에셋
   - index.html (메인 프로모션 페이지)
   - assets_rent/ (이미지, CSS, JS 파일 104개)

2. **carchelin-v10/** - 추출된 디렉토리
   - 원본 HTML 파일
   - 정적 에셋 디렉토리

### 생성해야 할 파일 구조
```
github-repo/
├── index.html (원본 HTML)
├── assets_rent/ (정적 에셋)
│   ├── img/
│   ├── css/
│   ├── js/
│   └── ...
├── functions/
│   ├── form-submit.js (Cloudflare Worker 함수)
│   └── admin-api.js (관리자 API)
├── form-handler.js (프론트엔드 폼 처리)
├── wrangler.toml (Cloudflare Workers 설정)
└── README.md (프로젝트 설명)
```

---

## 🚀 구현 단계

### Phase 1: 준비 단계
1. GitHub 저장소 생성
2. Supabase 계정 생성 및 DB 설정
3. Cloudflare 계정 설정

### Phase 2: 데이터베이스 설정 (Supabase)
1. quotations 테이블 생성
   ```sql
   CREATE TABLE quotations (
     id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
     created_at TIMESTAMP DEFAULT NOW(),
     ip VARCHAR(45),
     name VARCHAR(100),
     phone VARCHAR(20),
     model VARCHAR(100)
   );
   ```
2. API 키 발급

### Phase 3: Cloudflare Workers 구현
1. `wrangler.toml` 설정
2. 폼 제출 API 엔드포인트 작성
   - `/api/submit` - 폼 데이터 수신
   - DB에 저장
   - 리플알바로 전송
3. 관리자 API 엔드포인트 작성
   - `/api/quotations` - 신청 내역 조회

### Phase 4: 프론트엔드 구현
1. 원본 HTML 통합
2. form-handler.js 작성
   - 폼 제출 이벤트 가로채기
   - API 호출
   - 성공/실패 모달 표시

### Phase 5: Cloudflare Pages 배포
1. GitHub 저장소 연동
2. 자동 배포 설정
3. 커스텀 도메인 설정

### Phase 6: 테스트 및 배포
1. 개발 환경에서 테스트
2. 폼 제출 테스트
3. DB 저장 확인
4. 리플알바 전송 확인
5. 프로덕션 배포

---

## 🔧 기술 스택

| 계층 | 기술 |
|------|------|
| **프론트엔드** | HTML, CSS, JavaScript (원본 유지) |
| **백엔드** | Cloudflare Workers (서버리스) |
| **데이터베이스** | Supabase (PostgreSQL) |
| **호스팅** | Cloudflare Pages |
| **버전 관리** | GitHub |

---

## 📊 API 명세

### 1. 폼 제출 API
**엔드포인트**: `POST /api/submit`

**요청 데이터:**
```json
{
  "name": "홍길동",
  "hp2": "1234",
  "hp3": "5678",
  "item2": "쏘렌토",
  "agree1": true
}
```

**응답:**
```json
{
  "success": true,
  "message": "신청이 완료되었습니다",
  "data": {
    "id": 1,
    "created_at": "2026-06-30T10:00:00Z",
    "ip": "192.168.1.1",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "model": "쏘렌토"
  }
}
```

### 2. 신청 내역 조회 API
**엔드포인트**: `GET /api/quotations`

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "created_at": "2026-06-30T10:00:00Z",
      "ip": "192.168.1.1",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "model": "쏘렌토"
    }
  ]
}
```

---

## 🔐 환경 변수

### Cloudflare Workers
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx
REPLY_ALBA_CODE=T2KCXF94DF
```

### Supabase
```
DB_URL=postgresql://user:password@host/database
```

---

## 📝 주의사항

1. **폼 필드 ID 유지**
   - reqFrm (헤더 폼)
   - reqFrm2 (메인 폼)
   - 이 ID들은 원본 HTML에서 정의됨

2. **연락처 형식**
   - 010-XXXX-XXXX 형식 검증 필수
   - hp2, hp3로 분리 저장

3. **리플알바 연동**
   - code 파라미터: T2KCXF94DF (고정)
   - CORS 처리 필요 (Cloudflare Workers에서 프록시)

4. **IP 수집**
   - Cloudflare Workers에서 `request.headers.get('cf-connecting-ip')` 사용

5. **에러 처리**
   - 3회 재시도 로직 구현 권장
   - 사용자에게 명확한 에러 메시지 표시

---

## 🧪 테스트 체크리스트

- [ ] 원본 HTML 모든 이미지 표시 확인
- [ ] 헤더 폼 (reqFrm) 제출 테스트
- [ ] 메인 폼 (reqFrm2) 제출 테스트
- [ ] 입력 검증 (이름, 연락처, 모델, 동의)
- [ ] DB 저장 확인
- [ ] 리플알바 전송 확인
- [ ] 성공/실패 모달 표시
- [ ] 관리자 페이지 조회 테스트
- [ ] 반응형 디자인 테스트 (모바일, 태블릿, 데스크톱)

---

## 📞 연락처 및 참고

- **원본 사이트**: https://replyalba.co.kr/intros/carchelin3/
- **리플알바 API**: https://replyalba.co.kr/proc/submit.frm.php
- **Supabase 문서**: https://supabase.com/docs
- **Cloudflare Workers 문서**: https://developers.cloudflare.com/workers/

---

## 🎓 추가 기능 (선택사항)

1. **폼 제출 후 자동 스크롤** - 성공 모달 표시 후 페이지 상단으로 자동 스크롤
2. **관리자 페이지 데이터 내보내기** - CSV 다운로드 기능
3. **실시간 알림** - 새로운 신청 시 관리자에게 이메일/푸시 알림
4. **중복 제출 방지** - 동일 연락처 중복 신청 체크

---

**작성일**: 2026-06-30
**상태**: 프로젝트 인수인계 준비 완료
