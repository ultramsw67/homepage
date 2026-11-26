// 방문 분석. 기본은 구글 애널리틱스(GA4), 네이버 애널리틱스는 선택.
// profile.analytics 의 ID 가 비어 있으면 해당 도구는 불러오지 않는다.
// 실제 사이트(soodcoach.com)에서만 집계하고, 로컬·테스트 환경에서는 아무 요청도 보내지 않는다.
import { profile } from './site';

const GA = profile.analytics?.gaId;
const NAVER = profile.analytics?.naverId;
const HOSTS = ['soodcoach.com', 'www.soodcoach.com'];
const scripts = {};

// 내 방문 빼기: 주소 끝에 ?internal=1 을 붙여 한 번 열면 그 브라우저는 집계하지 않는다 (?internal=0 으로 해제)
// 이 노트북은 휴대폰 데이터로 접속해 IP 가 자주 바뀌므로 IP 제외 대신 브라우저 표시를 쓴다 (2026-10-02)
const INTERNAL_KEY = 'sood-internal';
function isInternal() {
  try {
    const flag = new URLSearchParams(window.location.search).get('internal');
    if (flag === '1') window.localStorage.setItem(INTERNAL_KEY, '1');
    if (flag === '0') window.localStorage.removeItem(INTERNAL_KEY);
    return window.localStorage.getItem(INTERNAL_KEY) === '1';
  } catch {
    return false;
  }
}

function onSite() {
  return typeof window !== 'undefined' && HOSTS.includes(window.location.hostname) && !isInternal();
}

function loadScript(src) {
  if (!scripts[src]) {
    scripts[src] = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }
  return scripts[src];
}

// GA4: 첫 페이지뷰는 config 가 보내고, 이후 화면 전환은 GA4 '향상된 측정'(브라우저 기록 기반 페이지 변경, 기본 켜짐)이 자동 집계한다.
// 여기서 page_view 를 따로 보내면 두 번 집계되므로 보내지 않는다.
// 옛 주소(sood-page.web.app·soodcoach.co.kr 등)로 온 손님 보정 (2026-11-26)
// index.html 이 옛 주소를 soodcoach.com 으로 넘길 때 old_host(옛 주소)·old_ref(원래 들어온 곳)를 붙인다.
// 그대로 두면 GA 가 출처를 '옛 주소 / referral' 로 잡아 원래 출처(네이버·구글 등)를 잃는다.
// → 주소에서 두 값을 지우고, 원래 출처가 있으면 그것을 referrer 로, 없으면 referrer 를 무시(직접 방문)로 보낸다.
let oldAddress;
export function takeOldAddress() {
  if (oldAddress !== undefined) return oldAddress;
  oldAddress = null;
  try {
    const url = new URL(window.location.href);
    const host = url.searchParams.get('old_host');
    if (host) {
      oldAddress = { host, ref: url.searchParams.get('old_ref') || '' };
      url.searchParams.delete('old_host');
      url.searchParams.delete('old_ref');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
  } catch {
    // 주소 정리에 실패해도 사이트 동작은 그대로
  }
  return oldAddress;
}

let gaStarted = false;
function startGA() {
  if (gaStarted) return;
  gaStarted = true;
  const old = takeOldAddress(); // gtag 를 불러오기 전에 주소를 정리해야 GA 가 깨끗한 주소로 첫 페이지뷰를 잡는다
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // gtag 는 배열이 아니라 arguments 객체를 넣어야 동작한다
  window.gtag('js', new Date());
  const cfg = {};
  if (old) {
    cfg.page_location = window.location.href;
    if (old.ref) cfg.page_referrer = old.ref;
    else cfg.ignore_referrer = true;
  }
  window.gtag('config', GA, cfg);
  if (old) window.gtag('event', 'old_address_arrival', { old_host: old.host, had_referrer: old.ref ? 'yes' : 'no' });
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA)}`);
}

// 네이버 애널리틱스: SPA 이므로 경로가 바뀔 때마다 wcs_do() 로 페이지뷰를 보낸다.
function withNaver(fn) {
  loadScript('https://wcs.naver.net/wcslog.js').then((ok) => {
    if (!ok || !window.wcs) return;
    try {
      if (!window.wcs_add) window.wcs_add = {};
      window.wcs_add.wa = NAVER;
      window.wcs.inflow(window.location.hostname);
      fn();
    } catch {
      // 분석 스크립트 오류가 사이트 동작을 막지 않게 한다
    }
  });
}

// App 의 경로 변경마다 호출
export function trackPageview() {
  if (typeof window !== 'undefined') takeOldAddress(); // 내 브라우저(집계 제외)에서도 주소의 old_host 표시는 지운다
  if (!onSite()) return;
  if (GA) startGA();
  if (NAVER) withNaver(() => window.wcs_do());
}

// 상담 폼 접수 성공 시. GA4 권장 이벤트 generate_lead (GA 관리 화면에서 '주요 이벤트'로 표시하면 전환으로 집계)
export function trackLead() {
  if (!onSite()) return;
  if (GA && window.gtag) window.gtag('event', 'generate_lead', { form_name: 'consulting' });
  if (NAVER) withNaver(() => window.wcs.trans({ type: 'lead' }));
}

// 진단·체크표 같은 화면 안 행동 (check_start·check_complete·free_submit …). 실제 사이트에서만 보낸다.
export function trackEvent(name, params = {}) {
  if (!onSite()) return;
  if (GA && window.gtag) window.gtag('event', name, params);
}
