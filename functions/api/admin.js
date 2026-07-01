export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const pwd = url.searchParams.get('pwd');

    // 간단한 비밀번호 확인
    if (pwd !== '1029qpwo') {
        return new Response('Forbidden', { status: 403 });
    }

    let submissions = [];

    // Supabase에서 데이터 조회
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

    const rows = submissions.map(s => {
        const albaResult = s.alba_result || "N/A";
        const albaColor = albaResult === "success" ? "#2ecc71" : (albaResult === "N/A" ? "#95a5a6" : "#e74c3c");
        
        return `
        <tr>
            <td style="padding:10px; border:1px solid #ccc;">${s.created_at || '-'}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.name}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.phone}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.model}</td>
            <td style="padding:10px; border:1px solid #ccc; text-align:center;">
                <span style="background:${albaColor}; color:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">${albaResult}</span>
            </td>
            <td style="padding:10px; border:1px solid #ccc;">${s.ip || '-'}</td>
            <td style="padding:10px; border:1px solid #ccc;">${s.source || '-'}</td>
        </tr>
    `}).join('');

    const html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>카슐랭 관리자 페이지</title>
            <style>
                body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; background: #f4f7f6; }
                .container { max-width: 1100px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #1a2a6c; border-bottom: 2px solid #1a2a6c; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
                .refresh-btn { font-size: 14px; background: #1a2a6c; color: #fff; padding: 8px 15px; border-radius: 5px; text-decoration: none; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #1a2a6c; color: #fff; padding: 12px; text-align: left; font-size: 14px; }
                td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
                tr:hover { background: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>
                    📊 신청 내역 실시간 현황 (${submissions.length}건)
                    <a href="javascript:location.reload()" class="refresh-btn">새로고침</a>
                </h1>
                <table>
                    <thead>
                        <tr>
                            <th>시간 (KST)</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>모델</th>
                            <th>리플알바</th>
                            <th>IP</th>
                            <th>유입</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;">내역이 없습니다.</td></tr>'}</tbody>
                </table>
                <div style="margin-top:20px; padding:15px; background:#f9f9f9; border-radius:5px; font-size:12px; color:#666;">
                    <strong>[안내]</strong> 리플알바 상태가 <span style="color:#e74c3c; font-weight:bold;">failed</span> 또는 <span style="color:#e74c3c; font-weight:bold;">error</span>인 경우, 3회 재시도 후에도 실패한 건입니다. 이 경우 수동 접수가 필요할 수 있습니다.
                </div>
            </div>
        </body>
        </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
