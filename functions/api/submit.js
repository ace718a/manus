export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. 데이터 파싱 (에러 방지용 try-catch)
    let data = {};
    try {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            data = await request.json();
        } else {
            const formData = await request.formData();
            data = Object.fromEntries(formData.entries());
        }
    } catch (e) {
        console.error("Data parsing error:", e);
    }

    const name = data.name || data.wr_name || "이름없음";
    const hp2 = data.hp2 || "";
    const hp3 = data.hp3 || "";
    const phone = `010-${hp2}-${hp3}`;
    const model = data.item2 || data.wr_content || "미지정";
    const source = data.source || "unknown";
    const type = data.wr_3 || "기본";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // [핵심 1] 중복 전송 방지 (KV 60초 규칙 준수 및 에러 무시)
    if (env.CAR_DB) {
        try {
            const lockKey = `lock:${phone}`;
            const isLocked = await env.CAR_DB.get(lockKey);
            if (isLocked) {
                return new Response(JSON.stringify({ res: true, msg: "이미 처리 중입니다." }), {
                    headers: { "Content-Type": "application/json" }
                });
            }
            // Cloudflare KV 규칙: expirationTtl은 최소 60초여야 함
            await env.CAR_DB.put(lockKey, "true", { expirationTtl: 60 });
        } catch (kvError) {
            console.error("KV Error (ignored):", kvError);
            // KV에 문제가 생겨도 전송은 계속 진행합니다.
        }
    }

    // [핵심 2] 리플알바 전송 (최우선)
    const replyAlbaData = new URLSearchParams();
    replyAlbaData.append("name", name);
    replyAlbaData.append("hp1", "010");
    replyAlbaData.append("hp2", hp2);
    replyAlbaData.append("hp3", hp3);
    replyAlbaData.append("item2", model);
    replyAlbaData.append("code", "T2KCXF94DF");

    try {
        await fetch("https://replyalba.co.kr/proc/submit.frm.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://replyalba.co.kr/"
            },
            body: replyAlbaData.toString()
        });
    } catch (albaError) {
        console.error("ReplyAlba Error:", albaError);
    }

    // [핵심 3] Supabase 저장
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            const sbUrl = env.SUPABASE_URL.replace(/\/$/, "");
            await fetch(`${sbUrl}/rest/v1/quotations`, {
                method: "POST",
                headers: {
                    "apikey": env.SUPABASE_KEY,
                    "Authorization": `Bearer ${env.SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    model: model,
                    type: type,
                    source: source,
                    ip: ip
                })
            });
        } catch (sbError) {
            console.error("Supabase Error:", sbError);
        }
    }

    return new Response(JSON.stringify({ res: true }), {
        headers: { "Content-Type": "application/json" }
    });
}
