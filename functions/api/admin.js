export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const pwd = url.searchParams.get('pwd');

    if (pwd !== '1029qpwo') {
        return new Response('Forbidden', { status: 403 });
    }

    let submissions = [];
    if (env.CAR_DB) {
        const list = await env.CAR_DB.list();
        for (const key of list.keys) {
            const val = await env.CAR_DB.get(key.name);
            submissions.push(JSON.parse(val));
        }
    }

    // 시간순 정렬
    submissions.sort((a, b) => new Date(b.time) - new Date(a.time));

    const rows = submissions.map(s => `
        <tr>
            <td style="padding:10px; border:1px solid #ccc;">${s.time}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.name}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.phone}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.model}</td>
        </tr>
    `).join('');

    const html = `
        <html>
        <head><meta charset="UTF-8"><title>관리자</title></head>
        <body style="font-family:sans-serif; padding:20px;">
            <h1>📊 신청 내역 (${submissions.length}건)</h1>
            <table style="width:100%; border-collapse:collapse;">
                <thead style="background:#eee;">
                    <tr><th>시간</th><th>이름</th><th>연락처</th><th>모델</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <p style="color:gray; font-size:12px;">* Cloudflare KV 설정이 필요합니다.</p>
        </body>
        </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
