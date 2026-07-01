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
    const type = data.wr_3 || "기본"; // 장기렌트/리스
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // [중복 방지 로직] 
    // 동일 IP와 연락처로 30초 이내에 다시 신청이 들어오면 차단 (KV 저장소 활용)
    if (env.CAR_DB) {
        const lockKey = `lock:${phone}:${ip}`;
        const isLocked = await env.CAR_DB.get(lockKey);
        if (isLocked) {
            return new Response(JSON.stringify({ res: false, msg: "이미 신청이 처리 중입니다. 잠시만 기다려주세요." }), {
                headers: { "Content-Type": "application/json" }
            });
        }
        // 30초 동안 락(Lock) 설정
        await env.CAR_DB.put(lockKey, "true", { expirationTtl: 30 });
    }

    // [최우선 순위] 2. 리플알바 서버로 전송
    const replyAlbaData = new URLSearchParams();
    replyAlbaData.append("name", name);
    replyAlbaData.append("hp1", "010");
    replyAlbaData.append("hp2", hp2);
    replyAlbaData.append("hp3", hp3);
    replyAlbaData.append("item2", model);
    replyAlbaData.append("code", "T2KCXF94DF");

    let replyAlbaSuccess = false;
    try {
        const response = await fetch("https://replyalba.co.kr/proc/submit.frm.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://replyalba.co.kr/"
            },
            body: replyAlbaData.toString()
        });
        if (response.ok) replyAlbaSuccess = true;
    } catch (e) {
        console.error("ReplyAlba 전송 실패:", e);
    }

    // 3. Supabase DB 저장 (백업)
    // 환경변수 체크 (SUPABASE_URL, SUPABASE_KEY)
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
        try {
            await fetch(`${env.SUPABASE_URL}/rest/v1/quotations`, {
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
        } catch (e) {
            console.error("Supabase 저장 실패:", e);
        }
    }

    // 4. 결과 응답
    return new Response(JSON.stringify({ 
        res: true, 
        msg: "성공", 
        replyAlba: replyAlbaSuccess 
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
