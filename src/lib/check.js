// 3분 창업 준비도 진단(/check)·체크표 받기(/free) — 문항·문구·점수 계산 (2026-10-09, 시안 2안 확정판)
// 답은 서버에 보내지 않는다. 쪽지를 봉인하면 '열쇠'(주소 # 뒤)와 이 기기(localStorage)에만 남는다.

export const Q = [
  ['고객', '내 고객이 누구인지 한 문장으로 말할 수 있나요?'],
  ['고객', '그 고객 5명 이상과 직접 이야기해 봤나요?'],
  ['문제', '고객이 지금 그 문제를 어떻게 해결하고 있는지 알고 있나요?'],
  ['문제', '고객이 그 문제에 이미 돈이나 시간을 쓰고 있나요?'],
  ['돈', '누가 얼마를 낼지 가격을 정해 봤나요?'],
  ['돈', '한 달에 나가는 돈과 버틸 수 있는 개월 수를 알고 있나요?'],
  ['실행', '고객이 직접 써 볼 수 있는 것(시제품·MVP·샘플)이 있나요?'],
  ['실행', '지난 4주 동안 매주 확인한 숫자가 하나라도 있나요?'],
  ['자금·팀', '함께할 사람(공동창업자·외주·AI 도구)을 정했나요?'],
  ['자금·팀', '넣을 정부지원사업이나 투자 경로를 1개 이상 정했나요?'],
];
export const SHORT = ['고객 한 문장', '고객 5명 대화', '고객의 지금 해결법', '고객이 쓰는 돈·시간', '가격', '버틸 개월 수', '써 볼 수 있는 것', '매주 보는 숫자', '함께할 사람', '지원사업·투자 경로'];
// 아이디어 단계에서 '아직 이릅니다'를 고를 수 있는 질문 (점수에서 뺌)
export const EARLY = [7, 8, 9];
export const TODO = [
  '지난 한 달 안에 이 문제로 돈을 쓴 사람 한 명을 떠올려 그 사람을 한 문장으로 적어 보세요.',
  '이번 주에 고객 후보 1명과 30분 이야기하세요. 내 아이디어 설명은 맨 마지막에 하세요.',
  '고객 3명에게 “지금은 이거 어떻게 하세요?” 하나만 물어보세요.',
  '고객이 이 문제에 쓰는 돈과 시간을 한 줄씩 적어 보세요.',
  '가격 하나를 정해 고객 1명에게 말해 보고 그때 반응을 적어 두세요.',
  '통장 잔고를 한 달 지출로 나눠 버틸 수 있는 개월 수를 적어 보세요.',
  '2주 안에 보여 줄 수 있는 가장 작은 것을 정하세요. 화면 그림 한 장도 됩니다.',
  '매주 볼 숫자 하나를 정하고 월요일마다 적으세요.',
  '내가 못 하는 일 하나와, 그 일을 맡길 사람이나 도구를 적어 보세요.',
  '올해 넣을 지원사업 1개를 골라 마감일을 달력에 적으세요.',
];
// '못 했어요'를 고른 사람에게 주는 더 작은 할 일
export const SMALL = [
  '고객을 ‘누가 · 언제 · 무엇 때문에’ 세 칸으로만 적어 보세요.',
  '만나 볼 사람 이름 3개만 적어 두세요.',
  '아는 사람 한 명에게 “요즘 이거 어떻게 해?” 문자 한 통만 보내 보세요.',
  '내가 이 문제에 쓴 돈과 시간부터 적어 보세요.',
  '비슷한 서비스 3개의 가격만 찾아 적어 보세요.',
  '지난달 카드 명세서 합계만 확인해 보세요.',
  '시제품 대신 A4 한 장짜리 설명서를 써 보세요.',
  '볼 숫자 후보 3개만 적어 두세요.',
  '맡기고 싶은 일 3개만 적어 두세요.',
  'K-Startup 공고 목록을 10분만 훑어보세요.',
];
// 수드의 빨간 펜 — 여백에 다는 손글씨 한 줄
export const PEN = [
  '‘모든 사람’은 고객이 아닙니다. 지난주에 이 일로 돈 쓴 사람 한 명이면 충분합니다.',
  '설문 100장보다 커피 다섯 잔이 낫습니다. 이번 주 한 잔부터요.',
  '고객이 지금 쓰는 엑셀과 단톡방이 진짜 경쟁자입니다.',
  '이미 돈을 쓰는 문제여야 팔립니다. 영수증이 있는 문제를 찾으세요.',
  '가격은 나중에 정하는 게 아니라 고객에게 물어보는 겁니다. 숫자 하나만 말해 보세요.',
  '잔고 ÷ 한 달 지출. 이 숫자가 모든 결정의 마감일입니다.',
  '만들기 전에 보여 줄 수 있는 것부터. 그림 한 장도 시제품입니다.',
  '숫자는 하나면 됩니다. 같은 요일에 적기만 하세요.',
  '혼자여도 괜찮습니다. 내가 못 하는 일 하나만 적어 두세요.',
  '마감일을 달력에 적는 순간 준비가 시작됩니다.',
];
export const AXES = ['고객', '문제', '돈', '실행', '자금·팀'];
// 단계마다 먼저 볼 갈래 — 아이디어 단계는 시제품보다 고객부터
const FOCUS = [['고객', '문제'], ['돈', '실행'], ['실행', '자금·팀']];
export const STAGES = ['아이디어만 있다 (회사 다니며 고민 중 포함)', '준비 중이다 (사업자 등록 전)', '출시했다 · 매출이 있다'];
export const STAGE_SHORT = ['아이디어', '준비 중', '출시·매출'];
export const LEVELS = [['씨앗', 0, 39], ['새싹', 40, 69], ['나무', 70, 89], ['열매', 90, 100]];
export const VERDICT = [
  ['지금이 방향을 가장 싸게 바꿀 수 있는 때입니다. 고객 한 명부터 만나 보세요.', '생각이 꽤 정리돼 있습니다. 이제 고객에게 직접 확인하세요.', '아이디어 단계치고 준비가 탄탄합니다. 작은 시제품으로 넘어가세요.', '이 정도면 바로 시작해도 됩니다. 남은 건 첫 고객입니다.'],
  ['만들기 전에 고객과 가격부터 확인하면 돈을 아낄 수 있습니다.', '방향은 있습니다. 숫자로 확인할 차례입니다.', '지원사업·투자 심사를 준비해도 되는 단계입니다.', '준비는 충분합니다. 출시 날짜를 정하세요.'],
  ['팔고 있다면 이미 큰 출발입니다. 이제 근거를 채우세요. 지금 고객부터 다시 만나 보세요.', '매출이 나기 시작했습니다. 매주 볼 숫자 하나를 정하세요.', '검증은 됐습니다. 이제 속도와 자금이 문제입니다.', '성장 준비가 됐습니다. 투자나 지원사업으로 속도를 내세요.'],
];
// 갈래별 같이 읽을 글 (홈페이지 글 id)
export const POSTS = {
  '고객': ['224421146030', '224426280106'],   // 9/24 고객 페르소나 · 9/30 MVP 순서
  '문제': ['224359662645', '224421146030'],   // 7/28 아이디어 검증 · 9/24 고객 페르소나
  '돈': ['224428611517', '224370434013'],     // 10/2 유닛 이코노믹스 · 8/7 팔리는 가격
  '실행': ['224426280106', '224432101035'],   // 9/30 MVP 순서 · 10/6 PoC
  '자금·팀': ['224414098949', '224425124722'], // 9/17 예비창업패키지 · 9/29 팁스 운영사
};
export const SHEETS = {
  talk: { name: '고객 5명 대화 노트', desc: '무엇을 묻고 무엇을 적을지 정해 둔 한 장. 다섯 명 만나면 다음 칸이 보입니다.', for: '아이디어~준비 단계', file: '/sheets/sood-customer-talk-note.pdf' },
  unit: { name: '주문 1건 계산서', desc: '한 건 팔면 얼마 남는지, 몇 건 팔아야 본전인지 계산합니다.', for: '가격을 정하려는 분·팔기 시작한 분', file: '/sheets/sood-unit-economics.pdf' },
  deck: { name: '피치덱 12항목 체크표', desc: '투자자가 보는 순서대로 내 덱에 빠진 항목을 찾습니다.', for: '지원사업·투자 준비', file: '/sheets/sood-pitch-deck-12.pdf' },
  poc: { name: 'PoC 착수 전 합의표', desc: '기업 고객과 시범 사업 전에 서면으로 정할 6가지입니다.', for: 'B2B 스타트업', file: '/sheets/sood-poc-agreement.pdf' },
};
export const MAIN_SHEETS = ['talk', 'unit'];
export const MORE_SHEETS = ['deck', 'poc'];
export const SEAL_DAYS = 14;

export function sheetFor(axis, stage) {
  if (axis === '고객' || axis === '문제') return 'talk';
  if (axis === '돈') return 'unit';
  if (axis === '실행') return stage === 2 ? 'poc' : 'talk';
  return stage === 0 ? 'unit' : 'deck';
}

// 글 카테고리 → 글 끝에서 먼저 묻는 질문
export const CATEGORY_Q = { '사업모델·가격-전략': 4, 'MVP·PMF-실전-전술': 6, '투자유치·정부지원사업': 9, '1인-기업-AI-활용': 8, '창업자-멘탈·조직': 1 };
// 체크표가 있는 글 → /free?pick=
export const POST_SHEET = { '224428611517': 'unit', '224431635097': 'deck', '224432101035': 'poc' };

// 점수: '아직 이릅니다'(-1)는 빼고 100점으로 다시 계산
export function calc(ans) {
  const used = ans.filter((v) => v != null && v >= 0);
  const total = used.length ? Math.round((used.reduce((a, b) => a + b, 0) / (used.length * 10)) * 100) : 0;
  const axis = AXES.map((_, k) => {
    const p = [ans[k * 2], ans[k * 2 + 1]].filter((v) => v != null && v >= 0);
    return p.length ? Math.round((p.reduce((a, b) => a + b, 0) / p.length) * 2) : null;
  });
  return { total, axis };
}
export const level = (s) => LEVELS.findIndex(([, a, b]) => s >= a && s <= b);
export function weakAxis(axis) {
  let w = -1;
  axis.forEach((s, k) => { if (s != null && (w < 0 || s < axis[w])) w = k; });
  return AXES[Math.max(w, 0)];
}
// 다음 칸까지 한 걸음: 어떤 질문 하나가 '예'가 되면 다음 등급에 닿는지
export function nextStep(ans, stage) {
  const { total, axis } = calc(ans);
  const lv = level(total);
  const fo = FOCUS[stage || 0];
  const order = AXES.map((a, k) => [a, axis[k]]).filter((x) => x[1] != null)
    .sort((x, y) => (fo.includes(y[0]) - fo.includes(x[0])) || (x[1] - y[1])).map((x) => x[0]);
  const cands = [];
  ans.forEach((v, i) => {
    if (v != null && v >= 0 && v < 10) {
      const a2 = ans.slice(); a2[i] = 10;
      const t2 = calc(a2).total;
      cands.push({ i, t2, up: level(t2) > lv, rank: order.indexOf(Q[i][0]) });
    }
  });
  if (!cands.length) return null;
  cands.sort((a, b) => (b.up - a.up) || (a.rank - b.rank) || (b.t2 - a.t2) || (a.i - b.i));
  return { ...cands[0], lv, total, nextAt: lv < 3 ? LEVELS[lv + 1][1] : 100 };
}

// 열쇠: 답·쪽지를 주소(# 뒤)에만 담는다. # 뒤는 서버로 보내지지 않는다.
export const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export function dec(s) {
  try {
    const k = JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
    return k && Array.isArray(k.a) && k.a.length === 10 && k.d ? k : null;
  } catch { return null; }
}
export const keyUrl = (k) => `https://soodcoach.com/check#k=${enc(k)}`;

const STORE = 'sood-check-key';
export function saveKey(k) { try { window.localStorage.setItem(STORE, enc(k)); window.dispatchEvent(new Event('sood-check-key')); } catch { /* 저장 못 해도 열쇠 링크는 남는다 */ } }
export function loadKey() { try { const s = window.localStorage.getItem(STORE); return s ? dec(s) : null; } catch { return null; } }

export const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d; };
export const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const md = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
export function daysPassed(k) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((t - new Date(k.d + 'T00:00:00')) / 864e5);
}
export const daysLeft = (k) => SEAL_DAYS - daysPassed(k);

// 달력 파일 (.ics) — 쪽지 열리는 날 아침 9시 알림
export function icsText(k) {
  const ymd = isoDate(addDays(k.d, SEAL_DAYS)).replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const fold = (l) => { const out = []; while (l.length > 24) { out.push(l.slice(0, 24)); l = l.slice(24); } out.push(l); return out.join('\r\n '); };
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SOOD//check//KO', 'BEGIN:VEVENT',
    `UID:${Date.now()}@soodcoach.com`, `DTSTAMP:${now}`, `DTSTART;VALUE=DATE:${ymd}`,
    fold('SUMMARY:2주 전 나에게 쓴 쪽지가 열렸습니다'), fold(`DESCRIPTION:열쇠 링크 ${keyUrl(k)}`), fold(`URL:${keyUrl(k)}`),
    'BEGIN:VALARM', 'TRIGGER:PT9H', 'ACTION:DISPLAY', 'DESCRIPTION:쪽지 열기', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

export function download(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

// 식물 그림 (씨앗·새싹·나무·열매) — SVG 문자열 (잠금화면 그림에도 쓴다)
export function plantSvg(lv, size = 100) {
  const soil = '<path d="M10 82 Q50 74 90 82 L90 92 L10 92Z" fill="#c9b79c"/>';
  const g = [
    '<ellipse cx="50" cy="76" rx="9" ry="6" fill="#8a5a2b"/><path d="M50 70 q2 -6 6 -8" stroke="#6aa84f" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '<path d="M50 80 V52" stroke="#4f8a3a" stroke-width="3.5" stroke-linecap="round"/><path d="M50 60 C38 58 32 48 34 42 C44 42 50 50 50 60Z" fill="#6aa84f"/><path d="M50 56 C60 52 68 44 66 38 C56 38 50 46 50 56Z" fill="#7cbf5e"/>',
    '<rect x="46" y="50" width="8" height="32" fill="#8a5a2b"/><circle cx="50" cy="38" r="24" fill="#5c9c45"/><circle cx="36" cy="44" r="13" fill="#6aa84f"/><circle cx="64" cy="44" r="13" fill="#6aa84f"/>',
    '<rect x="46" y="50" width="8" height="32" fill="#8a5a2b"/><circle cx="50" cy="38" r="24" fill="#5c9c45"/><circle cx="36" cy="44" r="13" fill="#6aa84f"/><circle cx="64" cy="44" r="13" fill="#6aa84f"/><circle cx="42" cy="30" r="4.5" fill="#e0433a"/><circle cx="58" cy="36" r="4.5" fill="#e0433a"/><circle cx="48" cy="48" r="4.5" fill="#e0433a"/><circle cx="66" cy="50" r="4" fill="#e0433a"/>',
  ][lv];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${soil}${g}</svg>`;
}

// 잠금화면 한 장 (1080×2340 PNG). 위쪽은 시계 자리라 비운다.
export async function wallpaperBlob(k) {
  try { await document.fonts.ready; } catch { /* 글꼴을 못 기다려도 그린다 */ }
  const W = 1080, H = 2340;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#1f2a44'); gr.addColorStop(0.45, '#24365f'); gr.addColorStop(1, '#f5f4f1');
  x.fillStyle = gr; x.fillRect(0, 0, W, H);
  const font = (w, s) => { x.font = `${w} ${s}px 'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`; };
  const start = new Date(k.d + 'T00:00:00'), end = addDays(k.d, 6), open = addDays(k.d, SEAL_DAYS);
  x.textAlign = 'center';
  x.fillStyle = 'rgba(255,255,255,.75)'; font(600, 40);
  x.fillText(`이번 주 할 일 · ${md(start)} ~ ${md(end)}`, W / 2, 930);
  x.fillStyle = '#fff'; font(800, 74);
  const lines = []; let cur = '';
  TODO[k.q >= 0 ? k.q : 0].split(' ').forEach((wd) => {
    const t = cur ? cur + ' ' + wd : wd;
    if (x.measureText(t).width > 880) { lines.push(cur); cur = wd; } else cur = t;
  });
  lines.push(cur);
  lines.forEach((l, i) => x.fillText(l, W / 2, 1060 + i * 104));
  const lv = level(calc(k.a).total);
  await new Promise((res) => {
    const im = new Image();
    im.onload = () => { x.drawImage(im, W / 2 - 150, 1120 + lines.length * 104, 300, 300); res(); };
    im.onerror = res;
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(plantSvg(lv, 300));
  });
  x.fillStyle = '#1f2a44'; font(700, 44);
  x.fillText(`${open.getMonth() + 1}월 ${open.getDate()}일, 2주 전 쪽지가 열립니다`, W / 2, H - 330);
  x.fillStyle = '#5f5f5f'; font(500, 34);
  x.fillText('soodcoach.com/check · 할 일을 끝내면 먼저 열 수 있습니다', W / 2, H - 266);
  x.fillStyle = '#111'; font(800, 40);
  x.fillText('SOOD', W / 2, H - 170);
  const url = c.toDataURL('image/png');
  const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
  return { url, blob };
}
