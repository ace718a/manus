export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. 데이터 파싱
    let data = {};
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await request.json();
    } else {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
    }

    const name = data.name || data.wr_name;
    const hp2 = data.hp2;
    const hp3 = data.hp3;
    const phone = `010-${hp2}-${hp3}`;
    const model = data.item2 || data.wr_content || "미지정";
    const source = data.source || "unknown";
    const type = data.wr_3 || "기본";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // [핵심 1] 중복 전송 방지 (KV 활용)
    // 리플알바에 2번씩 들어가는 문제를 여기서 막습니다.
    if (env.CAR_DB) {
        const lockKey = `lock:${phone}`;
        const isLocked = await env.CAR_DB.get(lockKey);
        if (isLocked) {
            // 이미 전송된 연락처라면 리플알바에 또 보내지 않고 성공 응답만 줍니다.
            return new Response(JSON.stringify({ res: true, msg: "이미 처리됨" }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        // 10초 동안 락 설정
        await env.CAR_DB.put(lockKey, "true", { expirationTtl: 10 });
    }

    // [핵심 2] 리플알바 전송
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
    } catch (e) {}

    // [핵심 3] Supabase 저장 (안전한 주소 처리)
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            const sbUrl = env.SUPABASE_URL.replace(/\/$/, ""); // 끝에 슬래시 제거
            const sbRes = await fetch(`${sbUrl}/rest/v1/quotations`, {
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
            
            if (!sbRes.ok) {
                const errorLog = await sbRes.text();
                console.error("Supabase Error Log:", errorLog);
            }
        } catch (e) {
            console.error("Supabase Fetch Error:", e);
        }
    }

    return new Response(JSON.stringify({ res: true }), {
        headers: { "Content-Type": "application/json" }
    });
}
