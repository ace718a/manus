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

    // 1. 데이터 통합 추출 (다양한 폼 필드명 대응)
    const name = formData.name || formData.wr_name || "";
    const rawPhone = formData.hp1 ? `${formData.hp1}${formData.hp2}${formData.hp3}` : (formData.wr_subject || "");
    const model = formData.item2 || formData.wr_content || formData.hope_model || "";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    // 2. 연락처 정규화 (hp1, hp2, hp3 분리)
    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    let hp1 = "010", hp2 = "", hp3 = "";
    if (cleanPhone.length === 11) {
      hp1 = cleanPhone.substring(0, 3);
      hp2 = cleanPhone.substring(3, 7);
      hp3 = cleanPhone.substring(7, 11);
    } else if (cleanPhone.length === 10) {
      hp1 = cleanPhone.substring(0, 3);
      hp2 = cleanPhone.substring(3, 6);
      hp3 = cleanPhone.substring(6, 10);
    }

    // 3. Supabase 저장 (테이블명: quotation)
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_KEY;
    let supaResult = { success: false };

    if (supabaseUrl && supabaseKey) {
      const supaResponse = await fetch(`${supabaseUrl}/rest/v1/quotation`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name,
          phone: cleanPhone || rawPhone,
          model: model,
          ip: ip
        })
      });
      supaResult.success = supaResponse.ok;
    }

    // 4. 리플알바 전송
    const replyAlbaCode = env.REPLY_ALBA_CODE || "T2KCXF94DF";
    let replyResult = { success: false };

    const replyBody = new URLSearchParams();
    replyBody.append("adData", "_frm");
    replyBody.append("code", replyAlbaCode);
    replyBody.append("name", name);
    replyBody.append("hp1", hp1);
    replyBody.append("hp2", hp2);
    replyBody.append("hp3", hp3);
    replyBody.append("item2", model);
    replyBody.append("agree1", "on");

    const replyResponse = await fetch("https://replyalba.co.kr/proc/submit.frm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": "https://replyalba.co.kr/intros/_frm/index.php?code=" + replyAlbaCode,
        "Origin": "https://replyalba.co.kr"
      },
      body: replyBody.toString()
    });
    replyResult.success = replyResponse.ok;

    return new Response(JSON.stringify({ 
      success: true, 
      supa: supaResult.success, 
      reply: replyResult.success 
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
