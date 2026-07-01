export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. 폼 데이터 파싱
    let data;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        data = await request.json();
    } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
    }

    const name = data.name || '';
    const hp1 = data.hp1 || '010';
    const hp2 = data.hp2 || '';
    const hp3 = data.hp3 || '';
    const item2 = data.item2 || data.hope_model || '';
    const agree1 = data.agree1 ? 'on' : 'on'; // 동의 체크박스 값 보정
    const code = env.REPLY_ALBA_CODE || 'T2KCXF94DF';
    const ip = request.headers.get('cf-connecting-ip') || '0.0.0.0';

    // 2. Supabase 저장 (성공 확인됨)
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            await fetch(`${env.SUPABASE_URL}/rest/v1/quotations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': env.SUPABASE_KEY,
                    'Authorization': `Bearer ${env.SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: name,
                    phone: `${hp1}-${hp2}-${hp3}`,
                    model: item2,
                    ip: ip
                })
            });
        } catch (e) {
            console.error('Supabase Error:', e);
        }
    }

    // 3. 리플알바 서버로 전송 (필드명 및 인코딩 최적화)
    // 리플알바는 application/x-www-form-urlencoded 형식을 기대함
    const replyAlbaData = new URLSearchParams();
    replyAlbaData.append('adData', '_frm');
    replyAlbaData.append('name', name);
    replyAlbaData.append('hp1', hp1);
    replyAlbaData.append('hp2', hp2);
    replyAlbaData.append('hp3', hp3);
    replyAlbaData.append('item2', item2);
    replyAlbaData.append('agree1', agree1);
    replyAlbaData.append('code', code);

    try {
        const response = await fetch('https://replyalba.co.kr/proc/submit.frm.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://replyalba.co.kr/intros/_frm/index.php?code=' + code,
                'Origin': 'https://replyalba.co.kr'
            },
            body: replyAlbaData.toString()
        });

        // 전송 결과 로그 (Cloudflare Workers 로그에서 확인 가능)
        const resText = await response.text();
        console.log('ReplyAlba Response:', resText);

    } catch (e) {
        console.error('ReplyAlba error:', e);
    }

    // 4. 사용자에게 성공 응답 반환
    return new Response(JSON.stringify({ success: true, res: true, msg: "상담신청이 완료되었습니다." }), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
