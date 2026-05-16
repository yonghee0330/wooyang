// 우양재단 휴가관리 시스템 v5 UI/업무 규칙 공통 모듈
// 화면 표시와 휴가 계산에 반복 사용되는 작은 유틸을 모았습니다.

const DEDUCTIBLE_LEAVE_TYPES = ['연차', '반차오전', '반차오후'];
const HALF_DAY_LEAVE_TYPES = ['반차오전', '반차오후'];

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `wy-toast wy-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

function showLoading(target, message = '불러오는 중입니다.') {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  el.innerHTML = `
    <div class="loading-box">
      <div class="loading-spinner" aria-hidden="true"></div>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}

function hideLoading(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) el.innerHTML = '';
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatDate(value) {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatDateTime(value) {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return `${formatDate(date)} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function todayString() {
  return formatDate(new Date());
}

function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function countBusinessDays(startDate, endDate) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end || end < start) return 0;

  let count = 0;
  const current = new Date(start);

  // 휴가 기간에서 토요일/일요일은 사용일수에 포함하지 않습니다.
  while (current <= end) {
    if (!isWeekend(current)) count += 1;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function isHalfDay(type) {
  return HALF_DAY_LEAVE_TYPES.includes(type);
}

function isDeductible(type) {
  return DEDUCTIBLE_LEAVE_TYPES.includes(type);
}

function calculateLeaveDays(type, startDate, endDate) {
  if (!type || !startDate) return 0;
  if (isHalfDay(type)) return 0.5;

  return countBusinessDays(startDate, endDate);
}

function formatDays(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function statusClass(status) {
  if (status === '승인') return 'badge-approved';
  if (status === '반려') return 'badge-rejected';
  if (status === '취소') return 'badge-cancelled';
  return 'badge-waiting';
}

function statusBadge(status = '대기') {
  return `<span class="badge ${statusClass(status)}">${escapeHTML(status)}</span>`;
}

function paidBadge(paid = '유급') {
  const className = paid === '무급' ? 'badge-unpaid' : 'badge-paid';
  return `<span class="badge ${className}">${escapeHTML(paid)}</span>`;
}

function canCancelLeave(leave, user) {
  const leaveEmpId = leave.empId || leave.employeeId || leave.신청자사번 || leave.사번;
  const userEmpId = user && (user.empId || user.employeeId || user.사번 || user.id);
  const status = leave.status || leave.상태;

  // 휴가 취소는 본인 신청이면서 아직 대기 상태일 때만 허용합니다.
  return Boolean(userEmpId && leaveEmpId && String(leaveEmpId) === String(userEmpId) && status === '대기');
}

function generateRequestNo(sequence = 1, date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const seq = String(sequence).padStart(3, '0');

  return `L${yyyy}${mm}${dd}${seq}`;
}

window.WYUI = {
  DEDUCTIBLE_LEAVE_TYPES,
  HALF_DAY_LEAVE_TYPES,
  showToast,
  showLoading,
  hideLoading,
  escapeHTML,
  formatDate,
  formatDateTime,
  todayString,
  parseLocalDate,
  isWeekend,
  countBusinessDays,
  isHalfDay,
  isDeductible,
  calculateLeaveDays,
  formatDays,
  statusClass,
  statusBadge,
  paidBadge,
  canCancelLeave,
  generateRequestNo
};
