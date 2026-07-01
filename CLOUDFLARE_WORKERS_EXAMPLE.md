# Cloudflare Workers 구현 예제

## 1. wrangler.toml 설정

```toml
name = "carchelin-workers"
type = "javascript"
account_id = "your-account-id"
workers_dev = true
route = "api.example.com/api/*"
zone_id = "your-zone-id"

[env.production]
route = "api.example.com/api/*"

[build]
command = "npm install"

[[env.production.routes]]
pattern = "api.example.com/api/*"
zone_name = "example.com"

[env.production.vars]
SUPABASE_URL = "https://xxxxx.supabase.co"
SUPABASE_KEY = "xxxxx"
REPLY_ALBA_CODE = "T2KCXF94DF"
```

---

## 2. 폼 제출 API (src/submit.js)

```javascript
export async function handleSubmit(request) {
  // CORS 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const { name, hp2, hp3, item2, agree1 } = data;

    // 입력 검증
    if (!name || !hp2 || !hp3 || !item2 || !agree1) {
      return new Response(
        JSON.stringify({ error: '필수 필드를 입력해주세요' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // IP 주소 수집
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';

    // 연락처 조합
    const phone = `010-${hp2}-${hp3}`;

    // 1. Supabase에 저장
    const supabaseResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/quotations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'apikey': SUPABASE_KEY,
        },
        body: JSON.stringify({
          name,
          phone,
          model: item2,
          ip,
        }),
      }
    );

    if (!supabaseResponse.ok) {
      throw new Error('DB 저장 실패');
    }

    const dbData = await supabaseResponse.json();

    // 2. 리플알바로 전송 (재시도 로직 포함)
    let replyAlbaSuccess = false;
    for (let i = 0; i < 3; i++) {
      try {
        const replyAlbaResponse = await fetch(
          'https://replyalba.co.kr/proc/submit.frm.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              name,
              hp2,
              hp3,
              item2,
              code: REPLY_ALBA_CODE,
            }).toString(),
          }
        );

        if (replyAlbaResponse.ok) {
          replyAlbaSuccess = true;
          break;
        }
      } catch (error) {
        if (i === 2) throw error;
        // 지수 백오프: 1초, 2초, 4초
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '신청이 완료되었습니다',
        data: {
          id: dbData[0]?.id,
          created_at: dbData[0]?.created_at,
          ip,
          name,
          phone,
          model: item2,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: '처리 중 오류가 발생했습니다',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
```

---

## 3. 신청 내역 조회 API (src/quotations.js)

```javascript
export async function handleQuotations(request) {
  // CORS 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Supabase에서 조회 (최신순 정렬)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/quotations?order=created_at.desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'apikey': SUPABASE_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('데이터 조회 실패');
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: '조회 중 오류가 발생했습니다',
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
```

---

## 4. 메인 Worker 파일 (src/index.js)

```javascript
import { handleSubmit } from './submit';
import { handleQuotations } from './quotations';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 라우팅
    if (url.pathname === '/api/submit') {
      return handleSubmit(request, env);
    } else if (url.pathname === '/api/quotations') {
      return handleQuotations(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};
```

---

## 5. 프론트엔드 폼 처리 (form-handler.js)

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // 두 개의 폼 처리
  const forms = document.querySelectorAll('#reqFrm, #reqFrm2');

  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // 폼 데이터 수집
      const name = form.querySelector('input[name="name"]')?.value;
      const hp2 = form.querySelector('input[name="hp2"]')?.value;
      const hp3 = form.querySelector('input[name="hp3"]')?.value;
      const item2 = form.querySelector('select[name="item2"]')?.value;
      const agree1 = form.querySelector('input[name="agree1"]')?.checked;

      // 검증
      if (!name) {
        alert('이름을 입력해주세요');
        return;
      }

      if (!hp2 || !hp3) {
        alert('연락처를 입력해주세요');
        return;
      }

      if (!item2) {
        alert('희망모델을 선택해주세요');
        return;
      }

      if (!agree1) {
        alert('개인정보 수집 및 이용에 동의해주세요');
        return;
      }

      try {
        // API 호출
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            hp2,
            hp3,
            item2,
            agree1: true,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // 성공 모달
          alert('상담신청이 완료되었습니다.\n빠른 시일 내에 연락드리겠습니다.');
          form.reset();
        } else {
          alert(`오류: ${result.error}`);
        }
      } catch (error) {
        alert('상담신청 처리 중 오류가 발생했습니다');
        console.error('Error:', error);
      }
    });
  });
});
```

---

## 6. 배포 명령어

```bash
# 1. Wrangler 설치
npm install -g wrangler

# 2. 프로젝트 초기화
wrangler init carchelin-workers

# 3. 환경 변수 설정
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_KEY
wrangler secret put REPLY_ALBA_CODE

# 4. 배포
wrangler publish

# 5. 개발 서버 실행
wrangler dev
```

---

## 7. 테스트 예제

```bash
# 폼 제출 테스트
curl -X POST http://localhost:8787/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "hp2": "1234",
    "hp3": "5678",
    "item2": "쏘렌토",
    "agree1": true
  }'

# 신청 내역 조회 테스트
curl -X GET http://localhost:8787/api/quotations
```

---

## 주의사항

1. **환경 변수**: Cloudflare Workers 대시보드에서 설정
2. **CORS**: 모든 엔드포인트에서 CORS 헤더 포함
3. **에러 처리**: 3회 재시도 로직 포함
4. **IP 수집**: `cf-connecting-ip` 헤더 사용
5. **리플알바 연동**: 폼 인코딩 형식 사용

---

**참고**: 이 코드는 예제입니다. 실제 구현 시 보안, 에러 처리, 로깅 등을 추가로 고려해야 합니다.
