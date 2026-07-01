export async function onRequestGet(context) {
    const { request, env } = context;
    const { searchParams } = new URL(request.url);
    const pwd = searchParams.get('pwd');

    // 비밀번호 체크 (기존 유지)
    if (pwd !== '1029qpwo') {
        return new Response('접근 권한이 없습니다.', { status: 403 });
    }

    let data = [];
    let errorMsg = "";

    // Supabase에서 데이터 조회
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            const response = await fetch(`${env.SUPABASE_URL}/rest/v1/quotations?select=*&order=created_at.desc`, {
                headers: {
                    "apikey": env.SUPABASE_KEY,
                    "Authorization": `Bearer ${env.SUPABASE_KEY}`
                }
            });
            if (response.ok) {
                data = await response.json();
            } else {
                errorMsg = "Supabase 데이터를 불러오지 못했습니다.";
            }
        } catch (e) {
            errorMsg = "Supabase 연결 중 오류가 발생했습니다.";
        }
    } else {
        errorMsg = "Supabase 환경 설정이 되어 있지 않습니다.";
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>카슐랭 관리자 페이지</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; background: #f4f7f6; }
            h1 { color: #1a2a6c; }
            table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
            th { background: #1a2a6c; color: #fff; }
            tr:nth-child(even) { background: #f9f9f9; }
            .error { color: red; font-weight: bold; margin-bottom: 10px; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; color: #fff; }
            .bg-header { background: #3498db; }
            .bg-popup { background: #e67e22; }
        </style>
    </head>
    <body>
        <h1>카슐랭 상담 신청 내역 (Supabase)</h1>
        ${errorMsg ? `<p class="error">${errorMsg}</p>` : ''}
        <table>
            <thead>
                <tr>
                    <th>신청시간</th>
                    <th>이름</th>
                    <th>연락처</th>
                    <th>희망모델</th>
                    <th>구분</th>
                    <th>경로</th>
                    <th>IP</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td>${new Date(item.created_at).toLocaleString('ko-KR')}</td>
                        <td>${item.name}</td>
                        <td>${item.phone}</td>
                        <td>${item.model}</td>
                        <td>${item.type}</td>
                        <td><span class="badge ${item.source === 'header' ? 'bg-header' : 'bg-popup'}">${item.source}</span></td>
                        <td>${item.ip}</td>
                    </tr>
                `).join('')}
                ${data.length === 0 ? '<tr><td colspan="7" style="text-align:center;">데이터가 없습니다.</td></tr>' : ''}
            </tbody>
        </table>
    </body>
    </html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}
