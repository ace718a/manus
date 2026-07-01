export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 폼 데이터 파싱
    let data;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        data = await request.json();
    } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
    }

    const name = data.name || '';
    const phone = `010-${data.hp2 || ''}-${data.hp3 || ''}`;
    const model = data.item2 || data.hope_model || '미지정';
    const ip = request.headers.get('cf-connecting-ip') || '0.0.0.0';

    // 1. Supabase 저장 로직 추가
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            const supabaseResponse = await fetch(`${env.SUPABASE_URL}/rest/v1/quotations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': env.SUPABASE_KEY,
                    'Authorization': `Bearer ${env.SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    model: model,
                    ip: ip
                })
            });

            if (!supabaseResponse.ok) {
                const errorText = await supabaseResponse.text();
                console.error('Supabase Error Details:', errorText);
            }
        } catch (e) {
            console.error('Supabase Connection Error:', e);
        }
    } else {
        console.error('Supabase Environment Variables Missing');
    }

    // 2. 리플알바 서버로 전송 (기존 로직 유지)
    const replyAlbaData = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
        replyAlbaData.append(key, value);
    }
    const albaCode = env.REPLY_ALBA_CODE || 'T2KCXF94DF';
    if (!data.code) replyAlbaData.append('code', albaCode);

    try {
        await fetch('https://replyalba.co.kr/proc/submit.frm.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': request.url
            },
            body: replyAlbaData.toString()
        });
    } catch (e) {
        console.error('ReplyAlba error:', e);
    }

    // 3. 응답 반환
    return new Response(JSON.stringify({ success: true, res: true, msg: "상담신청이 완료되었습니다." }), {
        headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

// CORS 처리를 위한 OPTIONS 메서드 지원
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
