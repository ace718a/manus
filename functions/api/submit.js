export async function onRequestPost(context) {
    const { request, env } = context;
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    // 1. 리플알바 서버로 전송
    const replyAlbaData = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
        replyAlbaData.append(key, value);
    }
    if (!data.code) replyAlbaData.append('code', 'T2KCXF94DF');

    try {
        await fetch('https://replyalba.co.kr/proc/submit.frm.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://replyalba.co.kr/'
            },
            body: replyAlbaData.toString()
        });
    } catch (e) {
        console.error('ReplyAlba error:', e);
    }

    // 2. 관리자용 KV 저장 (Cloudflare KV 네임스페이스 'CAR_DB' 필요)
    if (env.CAR_DB) {
        const id = Date.now().toString();
        const submission = {
            time: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
            name: data.name,
            phone: `010-${data.hp2}-${data.hp3}`,
            model: data.item2 || data.hope_model || '미지정'
        };
        await env.CAR_DB.put(id, JSON.stringify(submission));
    }

    return new Response(JSON.stringify({ res: true, msg: "성공" }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
