export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const pwd = url.searchParams.get('pwd');

    // 간단한 비밀번호 확인
    if (pwd !== '1029qpwo') {
        return new Response('Forbidden', { status: 403 });
    }

    let submissions = [];

    // Supabase에서 데이터 조회 (KV 대신 DB 우선)
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            const sbUrl = env.SUPABASE_URL.replace(/\/$/, "");
            const response = await fetch(`${sbUrl}/rest/v1/quotations?select=*&order=created_at.desc`, {
                method: "GET",
                headers: {
                    "apikey": env.SUPABASE_KEY,
                    "Authorization": `Bearer ${env.SUPABASE_KEY}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                submissions = await response.json();
            }
        } catch (error) {
            console.error("Supabase Fetch Error:", error);
        }
    }

    // 만약 Supabase에 데이터가 없고 KV에 있다면 (백업용)
    if (submissions.length === 0 && env.CAR_DB) {
        try {
            const list = await env.CAR_DB.list();
            for (const key of list.keys) {
                if (key.name.startsWith('lock:')) continue;
                const val = await env.CAR_DB.get(key.name);
                if (val) submissions.push(JSON.parse(val));
            }
            submissions.sort((a, b) => new Date(b.created_at || b.time) - new Date(a.created_at || a.time));
        } catch (kvError) {
            console.error("KV Fetch Error:", kvError);
        }
    }

    const rows = submissions.map(s => `
        <tr>
            <td style="padding:10px; border:1px solid #ccc;">${s.created_at || s.time || '-'}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.name}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.phone}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.model}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.ip || '-'}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.source || '-'}</td>
        </tr>
    `).join('');

    const html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>카슐랭 관리자 페이지</title>
            <style>
                body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; background: #f4f7f6; }
                .container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #1a2a6c; border-bottom: 2px solid #1a2a6c; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #1a2a6c; color: #fff; padding: 12px; text-align: left; }
                td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
                tr:hover { background: #f9f9f9; }
                .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; background: #eee; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 신청 내역 실시간 현황 (${submissions.length}건)</h1>
                <table>
                    <thead>
                        <tr>
                            <th>시간 (KST)</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>모델</th>
                            <th>IP</th>
                            <th>유입</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="6" style="text-align:center;">내역이 없습니다.</td></tr>'}</tbody>
                </table>
                <p style="color:gray; font-size:12px; margin-top:20px;">* 본 페이지는 Supabase 실시간 데이터를 표시합니다.</p>
            </div>
        </body>
        </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
