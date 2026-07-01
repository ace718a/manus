export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 데이터 파싱
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

    // 1. 중복 방지 (KV)
    if (env.CAR_DB) {
        const lockKey = `lock:${phone}`;
        const isLocked = await env.CAR_DB.get(lockKey);
        if (isLocked) {
            return new Response(JSON.stringify({ res: false, msg: "이미 처리 중" }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        await env.CAR_DB.put(lockKey, "true", { expirationTtl: 20 });
    }

    // 2. 리플알바 전송 (최우선)
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
    } catch (e) {
        console.error("ReplyAlba error");
    }

    // 3. Supabase 저장 (강화된 로직)
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        const supabaseUrl = env.SUPABASE_URL.endsWith('/') ? env.SUPABASE_URL : env.SUPABASE_URL + '/';
        try {
            const sbRes = await fetch(`${supabaseUrl}rest/v1/quotations`, {
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
                const errText = await sbRes.text();
                console.error("Supabase Error:", errText);
            }
        } catch (e) {
            console.error("Supabase fetch error");
        }
    }

    return new Response(JSON.stringify({ res: true }), {
        headers: { "Content-Type": "application/json" }
    });
}
