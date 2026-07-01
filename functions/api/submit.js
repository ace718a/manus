export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. 데이터 파싱
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
    const code = env.REPLY_ALBA_CODE || 'T2KCXF94DF';
    const ip = request.headers.get('cf-connecting-ip') || '0.0.0.0';

    // 2. 비동기 작업을 위한 프로미스 배열 생성 (병렬 처리로 속도 개선)
    const tasks = [];

    // [Task A] Supabase 저장
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        tasks.push(
            fetch(`${env.SUPABASE_URL}/rest/v1/quotations`, {
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
            }).catch(e => console.error('Supabase Error:', e))
        );
    }

    // [Task B] 리플알바 전송
    const replyAlbaData = new URLSearchParams();
    replyAlbaData.append('adData', '_frm');
    replyAlbaData.append('name', name);
    replyAlbaData.append('hp1', hp1);
    replyAlbaData.append('hp2', hp2);
    replyAlbaData.append('hp3', hp3);
    replyAlbaData.append('item2', item2);
    replyAlbaData.append('agree1', 'on');
    replyAlbaData.append('code', code);

    tasks.push(
        fetch('https://replyalba.co.kr/proc/submit.frm.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://replyalba.co.kr/intros/_frm/index.php?code=' + code,
                'Origin': 'https://replyalba.co.kr'
            },
            body: replyAlbaData.toString()
        }).catch(e => console.error('ReplyAlba Error:', e))
    );

    // 3. 모든 작업을 동시에 실행하고 완료될 때까지 대기 (최대 3초 대기 후 응답)
    // 사용자 경험을 위해 작업이 완전히 끝나지 않아도 응답을 보낼 수 있도록 타임아웃을 걸 수도 있지만, 
    // 여기서는 안전하게 모든 프로미스를 처리합니다.
    await Promise.all(tasks);

    // 4. 즉시 응답 반환 (중복 신청 방지를 위해 빠른 응답이 중요)
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
