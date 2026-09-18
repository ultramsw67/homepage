// 방문 분석. 기본은 구글 애널리틱스(GA4), 네이버 애널리틱스는 선택.
// profile.analytics 의 ID 가 비어 있으면 해당 도구는 불러오지 않는다.
// 실제 사이트(soodcoach.com)에서만 집계하고, 로컬·테스트 환경에서는 아무 요청도 보내지 않는다.
import { profile } from './site';

const GA = profile.analytics?.gaId;
const NAVER = profile.analytics?.naverId;
const HOSTS = ['soodcoach.com', 'www.soodcoach.com'];
const scripts = {};

function onSite() {
  return typeof window !== 'undefined' && HOSTS.includes(window.location.hostname);
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
let gaStarted = false;
function startGA() {
  if (gaStarted) return;
  gaStarted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // gtag 는 배열이 아니라 arguments 객체를 넣어야 동작한다
  window.gtag('js', new Date());
  window.gtag('config', GA);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA)}`);
}

// 네이버 애널리틱스: SPA 이므로 경로가 바뀔 때마다 wcs_do() 로 페이지뷰를 보낸다.
function withNaver(fn) {
  loadScript('https://wcs.naver.net/wcslog.js').then((ok) => {
    if (!ok || !window.wcs) return;
    try {
      if (!window.wcs_add) window.wcs_add = {};
      window.wcs_add.wa = NAVER;
      window.wcs.inflow(HOST);
      fn();
    } catch {
      // 분석 스크립트 오류가 사이트 동작을 막지 않게 한다
    }
  });
}

// App 의 경로 변경마다 호출
export function trackPageview() {
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
