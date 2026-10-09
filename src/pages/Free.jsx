import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SHEETS, MAIN_SHEETS, MORE_SHEETS, STAGE_SHORT, LEVELS } from '../lib/check';
import { trackEvent } from '../lib/analytics';
import { sendForm } from '../lib/notify';
import '../check.css';

function Mini({ k }) {
  if (k === 'unit') return <div className="mini"><i className="h" /><div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 4 }}><div style={{ display: 'grid', gap: 2 }}>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div><div style={{ display: 'grid', gap: 2 }}><i className="a" /><i className="a" /><i className="a" /></div></div></div>;
  const n = { talk: 5, deck: 12, poc: 6 }[k];
  return <div className="mini"><i className="h" />{Array.from({ length: n }, (_, i) => <i key={i} className={k === 'talk' || i === 0 ? 'a' : ''} />)}{k === 'talk' && Array.from({ length: 5 }, (_, i) => <i key={'r' + i} style={{ height: 8 }} />)}</div>;
}

export default function Free() {
  const { search, state } = useLocation();
  const pick = useMemo(() => { const p = new URLSearchParams(search).get('pick'); return SHEETS[p] ? p : null; }, [search]);
  const fromCheck = state && Number.isInteger(state.stage) ? state : null;
  const [sel, setSel] = useState(() => new Set(pick ? [pick] : MAIN_SHEETS));
  const [stage, setStage] = useState(fromCheck ? fromCheck.stage : null);
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [news, setNews] = useState(false);
  const [err, setErr] = useState({});
  const [phase, setPhase] = useState('idle');

  const late = stage === 2;
  let main = late ? [...MAIN_SHEETS, ...MORE_SHEETS] : MAIN_SHEETS.slice();
  if (pick && !main.includes(pick)) main.unshift(pick);
  main = main.sort((a, b) => (b === pick) - (a === pick));
  const more = [...MAIN_SHEETS, ...MORE_SHEETS].filter((k) => !main.includes(k));
  const toggle = (k) => setSel((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const picked = [...MAIN_SHEETS, ...MORE_SHEETS].filter((k) => sel.has(k));

  async function submit(e) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setErr({ email: !ok, agree: !agree });
    if (!ok || !agree || !picked.length) return;
    setPhase('sending');
    const names = picked.map((k) => SHEETS[k].name);
    await sendForm(`[체크표 받기] ${names.join(', ')} · ${stage == null ? '단계 안 고름' : STAGE_SHORT[stage]}`, {
      email: email.trim(), replyto: email.trim(),
      message: `고른 체크표: ${names.join(' · ')}\n단계: ${stage == null ? '—' : STAGE_SHORT[stage]}\n새 자료 알림: ${news ? '받겠다고 함' : '받지 않음'}\n진단 점수대: ${fromCheck && fromCheck.lv != null ? `${LEVELS[fromCheck.lv][0]} (${fromCheck.total}점)` : '— (진단 안 함)'}`,
    });
    trackEvent('free_submit', { sheets: picked.length, stage: stage == null ? '(안 고름)' : STAGE_SHORT[stage], news });
    setPhase('done');   // 메일 알림이 실패해도 방문자는 바로 받는다
  }

  const card = (k) => (
    <button type="button" key={k} className={'card' + (sel.has(k) ? ' sel' : '')} aria-pressed={sel.has(k)} onClick={() => toggle(k)}>
      {k === pick && <span className="badge">진단 결과 추천</span>}
      <span className="thumb"><Mini k={k} /></span>
      <span className="body"><span className="tick" aria-hidden="true" />
        <span><span className="ct">{SHEETS[k].name}</span><span className="cd">{SHEETS[k].desc}</span><span className="for">이런 분께 · {SHEETS[k].for}</span></span></span>
    </button>
  );

  return (
    <div className="wrap page free-page"><div className="narrowcol">
      <div className="rise">
        <p className="eyebrow">무료 자료</p>
        <h1>출력해서 바로 쓰는<br />스타트업 경영 한 장</h1>
        <p className="lead">블로그 글에서 쓰던 표를 한 장짜리로 정리했습니다. 이메일을 적으면 바로 내려받을 수 있습니다.</p>
      </div>
      {phase !== 'done' ? <>
        <div className="cards">{main.map(card)}</div>
        {more.length > 0 && <details className="more"><summary>사업자가 있거나 투자·B2B 를 준비하는 분께 {more.length}종 더</summary><div className="cards">{more.map(card)}</div></details>}
        <form className="form" onSubmit={submit} noValidate>
          <div className="field"><label htmlFor="free-email">이메일<span className="req">필수</span></label>
            <input type="email" id="free-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            {err.email && <p className="hint-err">이메일을 확인해 주세요.</p>}</div>
          <div className="field"><label>지금 단계<span className="opt">선택</span></label>
            <div className="seg">{STAGE_SHORT.map((s, k) => <button type="button" key={s} className={stage === k ? 'on' : ''} onClick={() => setStage(k)}>{s}</button>)}</div>
            {fromCheck && <p className="small muted" style={{ marginTop: 6 }}>진단에서 고른 단계가 미리 채워져 있습니다.</p>}</div>
          <div className="field">
            <label className="consent"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span><b>체크표를 받으려고 이메일을 적는 데 동의합니다</b><span className="req">필수</span></span></label>
            <p className="consent-text">이메일과 단계는 체크표를 보낸 기록으로만 씁니다. 수드(SOOD) 외에는 쓰지 않고, 1년 뒤 지우거나 요청하시면 바로 지웁니다. 동의하지 않으셔도 체크표 내용은 블로그 글에서 보실 수 있습니다.</p>
            {err.agree && <p className="hint-err">동의에 체크해 주세요.</p>}
            <label className="consent"><input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} /><span>새 체크표가 나오면 이메일로 알려 주세요<span className="opt">선택</span></span></label>
          </div>
          <button type="submit" className="button primary block" disabled={!picked.length || phase === 'sending'}>{phase === 'sending' ? '준비하는 중…' : `체크표 받기 (${picked.length}종)`}</button>
        </form>
      </> : (
        <div className="done rise">
          <p className="eyebrow">받을 준비가 됐습니다</p>
          <h2>체크표 {picked.length}종을 내려받으세요</h2>
          <p className="muted">A4 한 장씩입니다. 흑백으로 출력해도 잘 보입니다.</p>
          <div className="dl">
            {picked.map((k) => <a key={k} href={SHEETS[k].file} download onClick={() => trackEvent('free_download', { file: k })}>{SHEETS[k].name}<span>PDF · 1쪽</span></a>)}
          </div>
          <div className="next">
            <p>다 채웠는데 어디서 막히는지 모르겠다면, 이 표를 들고 첫 상담 60분을 신청하세요.</p>
            <Link className="button primary" to="/consulting#contact" onClick={() => trackEvent('free_to_consult')}>첫 상담 신청하기</Link>
            {!fromCheck && <p className="alt"><Link className="textlink" to="/check">3분 준비도 진단도 해 보기 →</Link></p>}
          </div>
        </div>
      )}
    </div></div>
  );
}
