const API_URL = 'https://script.google.com/macros/s/AKfycbw_y8DGoro28HUdZeICMMr6tu1jXdzoUByMby4y0buT9RiqxTkh9EJ8ZH9aC3AXB8CDcA/exec';

async function callAPI(action, payload = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action, ...payload })
    });
    return await res.json();
  } catch (err) {
    console.error('API 호출 실패:', err);
    return { success: false, message: '네트워크 오류: ' + err.message };
  }
}

// sessionStorage는 브라우저를 닫으면 사라져 업무용 공용 PC에서 안전합니다.
function setUser(user) {
  sessionStorage.setItem('wy_user', JSON.stringify(user));
}

function getUser() {
  const v = sessionStorage.getItem('wy_user');
  return v ? JSON.parse(v) : null;
}

function clearUser() {
  sessionStorage.removeItem('wy_user');
}

function requireLogin() {
  const user = getUser();
  if (!user) {
    location.href = 'index.html';
    return null;
  }
  return user;
}

function logout() {
  clearUser();
  location.href = 'index.html';
}

function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = 'wy-toast wy-toast-' + type;
  el.textContent = msg;
  document.body.appendChild(el);

  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

function getEmpId(user = getUser()) {
  return user && (user.empId || user.employeeId || user.id || user.사번);
}

function getDisplayName(user = getUser()) {
  return (user && (user.name || user.userName || user.이름)) || '사용자';
}

function getDepartment(user = getUser()) {
  return (user && (user.department || user.dept || user.부서)) || '-';
}

function getPosition(user = getUser()) {
  return (user && (user.position || user.rank || user.title || user.직급)) || '-';
}

function normalizeSuccess(data) {
  // Apps Script 응답 키가 success 또는 ok로 올 수 있어 화면 로직에서 공통 처리합니다.
  return Boolean(data && (data.success || data.ok));
}

function getErrorMessage(data, fallback = '요청을 처리하지 못했습니다.') {
  return (data && (data.message || data.error)) || fallback;
}

function escapeHTML(value) {
  // API에서 받은 텍스트를 표에 넣기 전에 HTML로 해석되지 않도록 처리합니다.
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
