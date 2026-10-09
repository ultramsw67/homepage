// 대표님 메일로 바로 보내는 알림 — 상담 폼과 같은 Web3Forms 키 (2026-10-09)
// 진단 완료 알림은 실제 사이트에서만 보낸다 (로컬·테스트에서 메일이 가지 않게). 체크표 받기·한 줄 질문은 방문자가 직접 누른 것이라 늘 보낸다.
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
