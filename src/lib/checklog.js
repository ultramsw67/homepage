// 3분 진단 결과를 대표님 Firebase(sood-db)에 쌓는다 — 2026-10-11 「즉시 메일」 대신 11시·23시 집계 메일
// 이름·연락처·쪽지는 받지도 보내지도 않는다. 사이트는 새로 쓰기만 할 수 있고(firestore.rules), 읽기는 노트북 집계 작업만 한다.
// 실제 사이트에서만, 내 방문(?internal=1 표시가 있는 브라우저)은 빼고 쓴다.
const COMMIT = 'https://firestore.googleapis.com/v1/projects/sood-db/databases/(default)/documents:commit';
const DOC = 'projects/sood-db/databases/(default)/documents/checks/';

function counted() {
  if (typeof window === 'undefined' || !['soodcoach.com', 'www.soodcoach.com'].includes(window.location.hostname)) return false;
  try { return window.localStorage.getItem('sood-internal') !== '1'; } catch { return true; }
}

const int = (n) => ({ integerValue: String(Math.round(n)) });
const val = (x) => (x == null ? { nullValue: null } : int(x));

export async function saveCheck({ total, lv, stage, axis, ans, next, from, prev }) {
  if (!counted()) return { ok: false, skipped: true };
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const fields = {
    v: int(1), total: int(total), lv: int(lv), stage: int(stage ?? 0),
    axis: { arrayValue: { values: axis.map(val) } },
    ans: { arrayValue: { values: ans.map(val) } },
    next: int(next ?? -1), from: { stringValue: String(from || '').slice(0, 40) }, prev: int(prev ?? -1),
  };
  try {
    const res = await fetch(COMMIT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: [{ update: { name: DOC + id, fields }, currentDocument: { exists: false }, updateTransforms: [{ fieldPath: 'at', setToServerValue: 'REQUEST_TIME' }] }] }),
      keepalive: true,
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
