// 우양재단 휴가관리 시스템 v5 API 공통 모듈
// GitHub Pages 정적 페이지에서 Google Apps Script Web App을 호출합니다.

const API_URL = 'https://script.google.com/macros/s/AKfycbx2FdHWeI79gl-49Ow19FRjtLlr80EEQDeBENBOhUDdT9EtbW7sf5i3_6J54Qkp_NsYQA/exec';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

async function parseResponse(res) {
  const text = await res.text();

  if (!text) {
    return { success: false, message: 'API 응답이 비어 있습니다.' };
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('API 응답 파싱 실패:', err, text);
    return { success: false, message: 'API 응답을 해석하지 못했습니다.' };
  }
}

async function apiGet(action, params = {}) {
  try {
    const res = await fetch(`${API_URL}${buildQuery({ action, ...params })}`, {
      method: 'GET',
      redirect: 'follow'
    });

    return await parseResponse(res);
  } catch (err) {
    console.error('API GET 호출 실패:', err);
    return { success: false, message: `네트워크 오류: ${err.message}` };
  }
}

async function apiPost(action, payload = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      // Apps Script CORS preflight를 피하기 위해 text/plain으로 전송합니다.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });

    return await parseResponse(res);
  } catch (err) {
    console.error('API POST 호출 실패:', err);
    return { success: false, message: `네트워크 오류: ${err.message}` };
  }
}

window.WYApi = {
  API_URL,
  apiGet,
  apiPost
};
