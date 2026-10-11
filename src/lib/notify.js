// 대표님 메일로 바로 보내는 알림 — 상담 폼과 같은 Web3Forms 키 (2026-10-09)
// 체크표 받기·한 줄 질문은 방문자가 직접 누른 것이라 바로 보낸다. 3분 진단 결과는 2026-10-11 부터 메일 대신 checklog.js 로 쌓아 11시·23시에 모아 보낸다.
import { profile } from './site';

const ENDPOINT = 'https://api.web3forms.com/submit';
const onSite = () => typeof window !== 'undefined' && ['soodcoach.com', 'www.soodcoach.com'].includes(window.location.hostname);

export async function sendForm(subject, fields, { siteOnly = false } = {}) {
  if (!profile.formKey || (siteOnly && !onSite())) return { ok: false, skipped: true };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: profile.formKey, subject, from_name: 'SOOD 홈페이지', ...fields }),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok && json.success !== false };
  } catch {
    return { ok: false };
  }
}
