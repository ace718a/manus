// 웹트로킹
function sendConversionTracking() {
    const funcs = [
        'meta_conversion',
        'google_conversion',
        'gtag_report_conversion',
        'naver_conversion',
        'kakao_conversion',
        'daangn_conversion'
    ];

    funcs.forEach(fn => {
        try {
          if (typeof window[fn] === 'function') {
            window[fn]();
          }
        } catch (e) {
          console.error(`[Tracking Error] ${fn}:`, e);
        }
    });
}