export async function onRequestPost(context) {
  const { request, env } = context;
  const contentType = request.headers.get("content-type") || "";

  try {
    let formData;
    if (contentType.includes("form-data") || contentType.includes("url-encoded")) {
      const rawFormData = await request.formData();
      formData = Object.fromEntries(rawFormData.entries());
    } else {
      formData = await request.json();
    }

    // 1. 데이터 추출 (모든 폼 필드 지원)
    const name = formData.name || formData.wr_name || "이름없음";
    const rawPhone = formData.hp1 ? `${formData.hp1}${formData.hp2}${formData.hp3}` : (formData.wr_subject || "");
    const model = formData.item2 || formData.wr_content || formData.hope_model || "미지정";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // 2. 연락처 정규화
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    let hp1 = "010", hp2 = "", hp3 = "";
    if (cleanPhone.length >= 10) {
      hp1 = cleanPhone.substring(0, 3);
      hp2 = cleanPhone.substring(3, cleanPhone.length - 4);
      hp3 = cleanPhone.substring(cleanPhone.length - 4);
    }

    // 3. Supabase 저장 (테이블명: quotations)
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/quotations`, {
          method: "POST",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({ name, phone: cleanPhone, model, ip })
        });
      } catch (e) { console.error("Supa Error:", e); }
    }

    // 4. 리플알바 전송
    const code = env.REPLY_ALBA_CODE || "T2KCXF94DF";
    const replyBody = new URLSearchParams();
    replyBody.append("adData", "_frm");
    replyBody.append("code", code);
    replyBody.append("name", name);
    replyBody.append("hp1", hp1);
    replyBody.append("hp2", hp2);
    replyBody.append("hp3", hp3);
    replyBody.append("item2", model);
    replyBody.append("agree1", "on");

    try {
      await fetch("https://replyalba.co.kr/proc/submit.frm.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Referer": `https://replyalba.co.kr/intros/_frm/index.php?code=${code}`,
          "Origin": "https://replyalba.co.kr"
        },
        body: replyBody.toString()
      });
    } catch (e) { console.error("Reply Error:", e); }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
