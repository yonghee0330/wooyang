// 우양재단 휴가관리 시스템 v5 인증/세션 공통 모듈
// 이메일이 아닌 사번 기반 로그인 정보를 sessionStorage에 보관합니다.

const SESSION_KEY = 'wy_user_v5';

function getUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('세션 정보 파싱 실패:', err);
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function setUser(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearUser() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getEmpId(user = getUser()) {
  return user && (user.empId || user.employeeId || user.사번 || user.id);
}

function getUserName(user = getUser()) {
  return (user && (user.name || user.userName || user.이름)) || '사용자';
}

function getDepartment(user = getUser()) {
  return (user && (user.department || user.dept || user.부서)) || '-';
}

function getPosition(user = getUser()) {
  return (user && (user.position || user.rank || user.직급)) || '-';
}

function getRole(user = getUser()) {
  return (user && (user.role || user.authority || user.권한)) || '직원';
}

function isAdmin(user = getUser()) {
  return getRole(user) === '관리자';
}

function requireLogin() {
  const user = getUser();

  if (!user) {
    location.href = 'login.html';
    return null;
  }

  return user;
}

function requireAdmin() {
  const user = requireLogin();

  if (!user) return null;

  if (!isAdmin(user)) {
    if (window.WYUI && typeof window.WYUI.showToast === 'function') {
      window.WYUI.showToast('관리자만 접근 가능합니다.', 'warning');
      setTimeout(() => {
        location.href = 'dashboard.html';
      }, 700);
    } else {
      alert('관리자만 접근 가능합니다.');
      location.href = 'dashboard.html';
    }
    return null;
  }

  return user;
}

function logout() {
  clearUser();
  location.href = 'login.html';
}

window.WYAuth = {
  SESSION_KEY,
  getUser,
  setUser,
  clearUser,
  getEmpId,
  getUserName,
  getDepartment,
  getPosition,
  getRole,
  isAdmin,
  requireLogin,
  requireAdmin,
  logout
};
