# 카슐랭 (Carchelin) v10

신차 장기렌트/리스 프로모션 사이트 - Cloudflare Workers 버전

## 📋 설정 가이드

### 1. Cloudflare KV 네임스페이스 생성

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 접속
2. **Workers & Pages** → **KV** 클릭
3. **네임스페이스 생성** 버튼 클릭
4. 이름: `CAR_DB` 입력
5. 생성된 ID 복사

### 2. wrangler.toml 수정

`wrangler.toml` 파일에서 다음 부분을 수정:

```toml
[[kv_namespaces]]
binding = "CAR_DB"
id = "YOUR_KV_NAMESPACE_ID"  # ← 위에서 복사한 ID 입력
preview_id = "YOUR_KV_NAMESPACE_PREVIEW_ID"  # ← 미리보기 ID 입력
```

### 3. GitHub에 업로드

```bash
git add .
git commit -m "v10: Add Cloudflare Workers configuration"
git push origin main
```

### 4. Cloudflare Pages 연동

1. Cloudflare 대시보드 → **Workers & Pages**
2. 기존 프로젝트 선택
3. **설정** → **빌드 및 배포**
4. 빌드 명령어: (비워두기)
5. 빌드 출력 디렉토리: `/`
6. 저장 후 자동 배포

## 📁 파일 구조

```
carchelin-v10/
├── index.html              # 메인 HTML 파일
├── assets_rent/            # 이미지, CSS, JS 등
│   ├── style.css
│   ├── jquery-1.11.0.min.js
│   └── ... (기타 에셋)
├── functions/
│   └── api/
│       ├── submit.js       # 폼 제출 처리
│       └── admin.js        # 관리자 페이지
├── wrangler.toml           # Cloudflare Workers 설정
├── package.json            # 프로젝트 메타데이터
└── README.md               # 이 파일
```

## 🚀 기능

### 1. 상담 신청 폼
- 이름, 연락처, 희망모델 입력
- 개인정보 동의 체크박스
- 자동 제출 및 응답

### 2. 데이터 저장
- Cloudflare KV에 자동 저장
- 저장 정보: 신청시간, 이름, 연락처, 희망모델

### 3. 리플알바 연동
- 폼 제출 시 리플알바로 자동 전송
- 고객 관리 시스템 연동

### 4. 관리자 페이지
- URL: `/api/admin?pwd=1029qpwo`
- 모든 신청 내역 조회
- 시간순 정렬

## 🔧 API 엔드포인트

### POST /api/submit
폼 데이터 제출

**요청:**
```javascript
{
  name: "홍길동",
  hp2: "1234",
  hp3: "5678",
  item2: "쏘렌토",
  agree1: "on"
}
```

**응답:**
```json
{
  "res": true,
  "msg": "성공"
}
```

### GET /api/admin?pwd=PASSWORD
관리자 페이지 조회

## 📝 주의사항

1. **KV 네임스페이스 필수**: 반드시 생성하고 ID를 wrangler.toml에 입력
2. **비밀번호 변경 권장**: admin.js의 비밀번호 `1029qpwo` 변경 추천
3. **CORS 설정**: 필요시 wrangler.toml에서 추가 설정

## 🐛 문제 해결

### 폼 제출이 안 될 때
1. 브라우저 콘솔에서 에러 확인
2. KV 네임스페이스 ID가 올바른지 확인
3. Cloudflare 배포 상태 확인

### 관리자 페이지가 안 보일 때
1. 비밀번호 확인 (기본값: `1029qpwo`)
2. URL이 정확한지 확인: `/api/admin?pwd=1029qpwo`

## 📞 지원

문제가 발생하면 Cloudflare 대시보드의 로그를 확인하세요.

---

**Version**: 10.0.0  
**Last Updated**: 2026-06-30
