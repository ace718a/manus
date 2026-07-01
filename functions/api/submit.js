export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 1. 데이터 파싱
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

    const name = data.name || data.wr_name || "";
    const hp2 = data.hp2 || "";
    const hp3 = data.hp3 || "";
    const phone = hp2 && hp3 ? `010-${hp2}-${hp3}` : "";
    const model = data.item2 || data.wr_content || "미지정";
    const source = data.source || "unknown";
    const type = data.wr_3 || "기본";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // [핵심 1] 중복 전송 방지
    if (env.CAR_DB && phone && name) {
        try {
            const lockKey = `lock:${name}:${phone}`;
            const isLocked = await env.CAR_DB.get(lockKey);
            if (isLocked) {
                return new Response(JSON.stringify({ res: true, msg: "이미 처리 중입니다." }), {
                    headers: { "Content-Type": "application/json" }
                });
            }
            await env.CAR_DB.put(lockKey, "true", { expirationTtl: 30 });
        } catch (kvError) {
            console.error("KV Error:", kvError);
        }
    }

    // [핵심 2] 리플알바 전송 (스마트 재시도 로직 추가)
    let albaStatus = "pending";
    const replyAlbaData = new URLSearchParams();
    replyAlbaData.append("name", name || "이름없음");
    replyAlbaData.append("hp1", "010");
    replyAlbaData.append("hp2", hp2);
    replyAlbaData.append("hp3", hp3);
    replyAlbaData.append("item2", model);
    replyAlbaData.append("code", "T2KCXF94DF");

    for (let i = 0; i < 3; i++) {
        try {
            const albaResponse = await fetch("https://replyalba.co.kr/proc/submit.frm.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": "https://replyalba.co.kr/"
                },
                body: replyAlbaData.toString()
            });

            if (albaResponse.ok) {
                albaStatus = "success";
                break; // 성공 시 재시도 중단
            } else {
                albaStatus = `failed(HTTP:${albaResponse.status})`;
            }
        } catch (albaError) {
            albaStatus = `error(${albaError.message})`;
            // 마지막 시도가 아니면 1초 대기 후 재시도
            if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // [시간 처리] 한국 시간(KST) 생성
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const formattedTime = kstDate.toISOString().replace('T', ' ').substring(0, 19);

    // [핵심 3] Supabase 저장 (리플알바 전송 결과 포함)
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
                    name: name || "이름없음",
                    phone: phone || "010-0000-0000",
                    model: model,
                    type: type,
                    source: source,
                    ip: ip,
                    created_at: formattedTime,
                    alba_result: albaStatus // 전송 결과 기록 (success/error 등)
                })
            });
        } catch (sbError) {
            console.error("Supabase Error:", sbError);
        }
    }

    return new Response(JSON.stringify({ res: true, alba: albaStatus }), {
        headers: { "Content-Type": "application/json" }
    });
}
