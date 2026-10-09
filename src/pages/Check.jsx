import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Q, SHORT, EARLY, TODO, SMALL, PEN, AXES, STAGES, STAGE_SHORT, LEVELS, VERDICT, POSTS, SHEETS, SEAL_DAYS,
  calc, level, weakAxis, nextStep, sheetFor, dec, keyUrl, saveKey, loadKey, enc, addDays, isoDate, md, daysPassed, daysLeft,
  icsText, gcalUrl, download, plantSvg,
} from '../lib/check';
import { loadIndex } from '../lib/posts';
import { trackEvent } from '../lib/analytics';
import { sendForm } from '../lib/notify';
import { Arrow } from '../components/Icons';
import '../check.css';

const ansLabel = (v) => (v === 10 ? '예' : v === 5 ? '조금' : v === 0 ? '아니오' : v === -1 ? '아직 이릅니다' : '—');

// 손글씨 글꼴(나눔펜)은 이 페이지에서만 불러온다
function usePenFont() {
  useEffect(() => {
    if (document.getElementById('pen-font')) return;
    const l = document.createElement('link');
    l.id = 'pen-font'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap';
    document.head.appendChild(l);
  }, []);
}

// 진단이 끝나면 대표님 메일로 바로 알림 (2026-10-09 지시 — 이름·연락처·쪽지는 보내지 않는다)
function alertOwner({ ans, stage, from, prev }) {
  const { total, axis } = calc(ans);
  const lv = level(total);
  const ns = nextStep(ans, stage);
  const again = prev ? ` · 다시 잰 것 ${prev.total}→${total}점` : '';
  const subject = `[3분 진단] ${LEVELS[lv][0]} ${total}점 · ${STAGE_SHORT[stage]} · 다음 칸: ${ns ? SHORT[ns.i] : '모두 예'}${again}`;
  const answers = Q.map(([ax, q], i) => `${i + 1}. [${ax}] ${q} → ${ansLabel(ans[i])}`).join('\n');
  sendForm(subject, {
    message: `점수 ${total}점 (${LEVELS[lv][0]}) · 단계 ${STAGE_SHORT[stage]}${again}\n갈래별(20점 만점): ${AXES.map((a, k) => `${a} ${axis[k] ?? '나중'}`).join(' · ')}\n다음 칸 질문: ${ns ? SHORT[ns.i] : '-'}\n들어온 곳: ${from || '진단 페이지'}\n\n답 10개\n${answers}\n\n(이름·연락처·쪽지 내용은 받지 않습니다)`,
  }, { siteOnly: true });
}

function Plant({ lv, size = 84 }) {
  return <span className="plant" style={{ width: size, height: size }} aria-label={LEVELS[lv][0]} role="img" dangerouslySetInnerHTML={{ __html: plantSvg(lv, size) }} />;
}

function Radar({ scores, prev }) {
  const cx = 170, cy = 160, R = 112, n = 5;
  const pt = (k, r) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const ring = (f) => AXES.map((_, k) => pt(k, R * f).join(',')).join(' ');
  const poly = (sc) => sc.map((s, k) => pt(k, (R * (s || 0)) / 20).join(',')).join(' ');
  const wk = AXES.indexOf(weakAxis(scores));
  return (
    <svg className="radar" viewBox="0 0 340 330" role="img" aria-label="갈래별 점수 오각형 그래프">
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={ring(f)} fill="none" stroke="#e4e2dd" />)}
      {AXES.map((_, k) => { const [x, y] = pt(k, R); return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="#e4e2dd" />; })}
      {prev && <polygon points={poly(prev)} fill="rgba(0,0,0,.05)" stroke="#9a9a9a" strokeWidth="1.5" strokeDasharray="4 3" />}
      <polygon points={poly(scores)} fill="rgba(31,75,184,.16)" stroke="#1f4bb8" strokeWidth="2" />
      {scores.map((s, k) => { if (s == null) return null; const [x, y] = pt(k, (R * s) / 20); return <circle key={k} cx={x} cy={y} r="4" fill={k === wk ? '#1f4bb8' : '#111'} />; })}
      {AXES.map((a, k) => { const [x, y] = pt(k, R + 26); const s = scores[k]; return <text key={a} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight={k === wk ? 800 : 600} fill={s == null ? '#9a9a9a' : k === wk ? '#1f4bb8' : '#111'}>{a} {s == null ? '나중' : s}</text>; })}
    </svg>
  );
}

function Result({ ans, stage, prevAxis, titles }) {
  const { total, axis } = calc(ans);
  const lv = level(total);
  const ns = nextStep(ans, stage);
  const qi = ns ? ns.i : -1;
  const have = ans.map((v, i) => (v === 10 ? SHORT[i] : null)).filter(Boolean);
  const skipped = ans.filter((v) => v === -1).length;
  const axisName = qi >= 0 ? Q[qi][0] : weakAxis(axis);
  const lo = LEVELS[lv][1], hi = lv < 3 ? ns?.nextAt ?? 100 : 100;
  return (
    <>
      <div className="score-top">
        <div>
          <div className="lvname"><Plant lv={lv} /><div><b>{LEVELS[lv][0]} 단계</b><div className="big">{total}<small>/ 100점</small></div></div></div>
          <p className="verdict">{VERDICT[stage][lv]}</p>
          <div className="have">
            {have.length ? <><p>이미 갖춘 것 {have.length}개</p><div className="chips">{have.map((h) => <span className="chip" key={h}>{h}</span>)}</div></> : <p>‘조금’이라고 답했다면 이미 시작한 겁니다.</p>}
          </div>
          {skipped > 0 && <p className="small muted">아직 이른 질문 {skipped}개는 점수에서 뺐습니다.</p>}
          <div className="nextbar">
            {ns ? <>
              <div className="lab"><span>{LEVELS[lv][0]} {total}점</span><span>{lv < 3 ? `${LEVELS[lv + 1][0]} ${ns.nextAt}점` : '100점'}</span></div>
              <div className="track"><i style={{ width: `${Math.min(100, ((total - lo) / Math.max(1, hi - lo)) * 100)}%` }} /></div>
              <p>{ns.up
                ? <>‘{SHORT[ns.i]}’ 하나만 ‘예’가 되면 <b>{ns.t2}점, {LEVELS[level(ns.t2)][0]}</b>입니다.</>
                : <>‘{SHORT[ns.i]}’ 하나만 ‘예’가 되면 {ns.t2}점입니다.{lv < 3 && ` ${LEVELS[lv + 1][0]}까지 ${ns.nextAt - total}점 남았습니다.`}</>}</p>
            </> : <p>모든 질문에 ‘예’입니다. 1주 뒤에 다시 재 보세요.</p>}
          </div>
        </div>
        <div>
          <Radar scores={axis} prev={prevAxis} />
          {prevAxis
            ? <div className="legend"><span><i className="was" />1주 전</span><span><i className="now" />오늘</span></div>
            : <p className="small muted center">갈래마다 20점 만점</p>}
        </div>
      </div>
      {qi >= 0 && (
        <div className="blk">
          <h2>수드의 빨간 펜</h2>
          <div className="pen">
            <span className="why">점수를 올리기 가장 쉬운 질문</span>
            <div className="q">{qi + 1}. {Q[qi][1]}</div>
            <div className="myans">내 답 <em>{ansLabel(ans[qi])}</em></div>
            <div className="note">{PEN[qi]}</div>
            <div className="sign">— 수드</div>
          </div>
          <div className="todo">이번 주 할 일 — {TODO[qi]}</div>
        </div>
      )}
      <div className="blk">
        <h2>같이 읽을 글 2편 · {axisName}</h2>
        <div className="posts">
          {POSTS[axisName].map((id) => (
            <Link key={id} to={'/articles/' + id}>
              <span className="d">{titles[id]?.date?.slice(5).replace('-', '/') || ''}</span>
              <span className="t">{titles[id]?.title || '글 보기'}</span>
              <span className="n">읽기 <Arrow /></span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// 1주 뒤 알림 — 구글 캘린더 버튼 하나 (2026-10-09 「쪽지 받기가 어려워」 → 봉인·열쇠·잠금화면 정리)
function Letter({ base }) {
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const today = isoDate(new Date());
  const due = md(addDays(today, SEAL_DAYS));
  const key = { ...base, n: note.trim(), d: today };
  const keep = (how) => { saveKey(key); setDone(true); trackEvent('check_calendar', { how, has_note: !!note.trim(), round: (key.h || []).length }); };
  return (
    <div className="blk">
      <h2>1주 뒤 다시 재 보기 알림</h2>
      <p className="muted mb">구글 캘린더에 {due} 아침 9시 일정을 넣어 드립니다. 그날 일정 속 링크를 누르면 오늘 결과가 열리고, 달라진 것만 다시 잴 수 있습니다.</p>
      <div className="letter-form">
        <label htmlFor="note">1주 뒤의 나에게 한 줄 <span className="small muted">(선택)</span></label>
        <input type="text" id="note" maxLength="60" value={note} onChange={(e) => setNote(e.target.value)} placeholder="예) 고객 후보 3명을 만나 봤다" />
        <a className="button gold block" href={gcalUrl(key)} target="_blank" rel="noopener noreferrer" onClick={() => keep('google')}>구글 캘린더에 넣기</a>
        {done
          ? <p className="sent">캘린더 창에서 「저장」을 누르면 끝입니다. {due} 아침 9시에 알림이 옵니다.</p>
          : <p className="small muted">구글 캘린더가 열리면 「저장」만 누르세요.</p>}
        <p className="small muted alt-cal">
          <button type="button" className="textlink" onClick={() => { download('3분 진단 다시 재 보기.ics', new Blob([icsText(key)], { type: 'text/calendar' })); keep('ics'); }}>아이폰·아웃룩 달력에 넣기</button>
          {' · '}
          <button type="button" className="textlink" onClick={() => { navigator.clipboard?.writeText(keyUrl(key)).catch(() => {}); setCopied(true); keep('copy'); }}>{copied ? '링크를 복사했습니다' : '링크만 복사하기'}</button>
        </p>
        <p className="small muted">쓴 한 줄과 답은 내 캘린더와 이 기기에만 남습니다. 수드는 볼 수 없습니다.</p>
      </div>
    </div>
  );
}

function Ask({ total, lv, stage }) {
  const [q, setQ] = useState('');
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('idle');
  async function send() {
    if (!q.trim()) return;
    setPhase('sending');
    const r = await sendForm(`[진단 상담실] ${LEVELS[lv][0]} ${total}점 · ${STAGE_SHORT[stage]}`, {
      message: `${q.trim()}\n\n진단 ${total}점(${LEVELS[lv][0]}) · 단계 ${STAGE_SHORT[stage]}${email.trim() ? '' : '\n(알림 이메일 없음)'}`,
      ...(email.trim() ? { email: email.trim(), replyto: email.trim() } : {}),
    });
    trackEvent('check_ask_submit', { has_email: !!email.trim(), band: LEVELS[lv][0] });
    setPhase(r.ok ? 'sent' : 'error');
  }
  return (
    <div className="ask">
      <p className="small muted">이름 없이 받습니다. 답은 이름과 회사를 빼고 블로그 「진단 상담실」 글로 올립니다.</p>
      {phase === 'sent' ? <p className="sent">받았습니다. 답 글이 올라오면 블로그 「진단 상담실」에서 보실 수 있습니다.</p> : <>
        <textarea rows="2" maxLength="300" value={q} onChange={(e) => setQ(e.target.value)} aria-label="막힌 것 한 줄" placeholder="예) 직장 다니면서 고객 인터뷰할 시간을 어떻게 내야 할까요?" />
        <div className="row">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="알림 받을 이메일" placeholder="답 글이 올라오면 알림 받기 (선택)" />
          <button type="button" className="button primary" disabled={!q.trim() || phase === 'sending'} onClick={send}>{phase === 'sending' ? '보내는 중…' : '보내기'}</button>
        </div>
        {phase === 'error' && <p className="hint-err">전송에 실패했습니다. 잠시 뒤 다시 눌러 주세요.</p>}
      </>}
    </div>
  );
}

export default function Check() {
  usePenFont();
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  const [titles, setTitles] = useState({});
  useEffect(() => { loadIndex().then((list) => { const t = {}; list.forEach((p) => { t[p.id] = p; }); setTitles(t); }).catch(() => {}); }, []);

  const preset = useMemo(() => {
    const p = new URLSearchParams(search);
    const q = Number(p.get('q')), v = Number(p.get('v'));
    return Number.isInteger(q) && q >= 0 && q < 10 && [0, 5, 10].includes(v) && p.has('q') ? { q, v, from: p.get('from') === 'widget' ? 'widget' : 'article' } : null;
  }, [search]);
  const urlKey = useMemo(() => (hash.startsWith('#k=') ? dec(hash.slice(3)) : null), [hash]);
  const savedKey = useMemo(() => loadKey(), []);

  const [S, setS] = useState(() => ({ step: 'start', stage: null, ans: Array(10).fill(null), order: [], pos: 0 }));
  const [R, setR] = useState({ step: 'none' });   // 다시 온 날 흐름

  // 다시 재기 링크(캘린더 일정)로 들어왔으면 '다시 온 날'로
  useEffect(() => {
    if (!urlKey) return;
    setR({ step: daysLeft(urlKey) > 0 ? 'sealed' : 'letter', key: urlKey, early: false });
    trackEvent('return_open', { days: daysPassed(urlKey), sealed: daysLeft(urlKey) > 0 });
  }, [urlKey]);
  // 글 끝에서 첫 질문을 누르고 왔으면 그 답을 채우고 단계 질문부터
  useEffect(() => {
    if (!preset || urlKey) return;
    const ans = Array(10).fill(null); ans[preset.q] = preset.v;
    setS({ step: 'stage', stage: null, ans, order: [], pos: 0, from: preset.from });
    trackEvent('check_start', { from: preset.from });
  }, [preset, urlKey]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [S.step, S.pos, R.step, R.pos]);

  // ── 새 진단 ──
  const start = () => { setS({ step: 'stage', stage: null, ans: Array(10).fill(null), order: [], pos: 0 }); trackEvent('check_start', { from: 'check' }); };
  const pickStage = (k) => setS((s) => ({ ...s, step: 'q', stage: k, order: Q.map((_, i) => i).filter((i) => s.ans[i] == null), pos: 0 }));
  function answer(v) {
    setS((s) => {
      const ans = s.ans.slice(); ans[s.order[s.pos]] = v;
      if (s.pos < s.order.length - 1) return { ...s, ans, pos: s.pos + 1 };
      const { total, axis } = calc(ans);
      trackEvent('check_complete', { score_band: LEVELS[level(total)][0], weak: weakAxis(axis), stage: STAGE_SHORT[s.stage], early_skip: ans.filter((x) => x === -1).length, from: s.from || 'check' });
      alertOwner({ ans, stage: s.stage, from: { article: '글 끝 질문', widget: '블로그 위젯 질문' }[s.from] || '진단 페이지' });
      return { ...s, ans, step: 'result' };
    });
  }
  const back = () => setS((s) => (s.pos === 0 ? { ...s, step: 'stage' } : { ...s, pos: s.pos - 1 }));

  // ── 다시 온 날 ──
  function reAnswer(v) {
    setR((r) => {
      const ans = r.ans.slice(); ans[r.order[r.pos]] = v;
      if (r.pos < r.order.length - 1) return { ...r, ans, pos: r.pos + 1 };
      const before = calc(r.key.a), after = calc(ans);
      trackEvent('return_complete', { delta: after.total - before.total, band_from: LEVELS[level(before.total)][0], band_to: LEVELS[level(after.total)][0], kept: r.kept });
      alertOwner({ ans, stage: r.stage, from: '1주 뒤 다시 재기 링크', prev: before });
      return { ...r, ans, step: 'result' };
    });
  }

  const qBox = (qi, prevAns, onPick, onBack, stage, progress, label) => (
    <div className="rise" key={qi}>
      <div className="progress"><span>{label}</span><div className="bar"><i style={{ transform: `scaleX(${progress / 100})` }} /></div><span>{Math.round(progress / 10)}/10</span></div>
      <span className="qtag">{qi + 1}. {Q[qi][0]}{prevAns !== undefined ? ` · 1주 전 답: ${ansLabel(prevAns)}` : ''}</span>
      <h2 className="qtext">{Q[qi][1]}</h2>
      <div className="answers">
        {[['예', 10], ['조금', 5], ['아니오', 0]].map(([l, v]) => <button type="button" key={v} onClick={() => onPick(v)}>{l}</button>)}
        {stage === 0 && EARLY.includes(qi) && <button type="button" className="early" onClick={() => onPick(-1)}>아직 이릅니다<span className="sub">점수에서 뺍니다</span></button>}
      </div>
      {onBack && <div className="qnav"><button type="button" className="textlink" onClick={onBack}>← 뒤로</button><span className="small muted">누르면 바로 다음으로 넘어갑니다</span></div>}
    </div>
  );

  // 다시 온 날 화면
  if (R.step !== 'none' && R.key) {
    const k = R.key, left = daysLeft(k), passed = daysPassed(k);
    const before = calc(k.a);
    const qi0 = k.q >= 0 ? k.q : 0;
    return (
      <div className="wrap page check"><div className="narrowcol">
        {R.step === 'sealed' && (
          <div className="seal rise">
            <p className="eyebrow">다시 오셨네요</p>
            <div className="envelope"><span className="wax">D-{left}</span></div>
            <h1>다시 재는 날까지 {left}일 남았습니다</h1>
            <p className="lead">이번 주 할 일을 벌써 끝냈다면 지금 다시 재도 됩니다.</p>
            <div className="todo left">이번 주 할 일 — {TODO[qi0]}</div>
            <div className="earlybox">
              <label><input type="checkbox" className="box" checked={!!R.did} onChange={(e) => setR({ ...R, did: e.target.checked })} /> 할 일을 끝냈습니다</label>
              <button type="button" className="button primary block" disabled={!R.did} onClick={() => { setR({ ...R, step: 'letter', early: true }); trackEvent('return_open_early'); }}>지금 다시 재기</button>
            </div>
            <p className="small muted">아직이라면 {md(addDays(k.d, SEAL_DAYS))} 아침 9시 캘린더 알림을 기다리세요.</p>
          </div>
        )}
        {R.step === 'letter' && (
          <div className="seal rise">
            <p className="eyebrow">{R.early ? '할 일을 먼저 끝내셨네요' : `${passed}일 전에 쓴 한 줄`}</p>
            <h1 className="sr-only">1주 전 나에게 쓴 한 줄</h1>
            <div className="envelope open" />
            <div className="oldnote">
              <div className="hand">{k.n ? `“${k.n}”` : `이번 주 할 일: ${TODO[qi0]}`}</div>
              <div className="meta">{k.d.replace(/-/g, '.')} · 그때 {LEVELS[level(before.total)][0]} {before.total}점{k.b ? ` · 해내면 나에게: ${k.b}` : ''}</div>
            </div>
            <h2 className="kept-q">{k.n ? '이 한 줄, 해냈나요?' : '이 할 일, 해 봤나요?'}</h2>
            <div className="kept">
              {[[2, '했어요'], [1, '절반쯤요'], [0, '못 했어요']].map(([v, l]) => <button type="button" key={v} disabled={R.kept != null} className={R.kept === v ? 'on' : ''} onClick={() => { setR({ ...R, kept: v }); trackEvent('return_kept', { kept: ['못함', '절반', '지킴'][v] }); }}>{l}</button>)}
            </div>
            {R.kept != null && (
              <div className="reply">
                {R.kept === 0 && <>괜찮습니다. 이번 주는 더 작은 일부터 해 보세요.<br /><b>{SMALL[qi0]}</b></>}
                {R.kept === 1 && '절반만 했어도 지난주보다 나아진 겁니다.'}
                {R.kept === 2 && <>잘하셨습니다.{k.b ? <> 이제 「{k.b}」 받으세요.</> : ''}</>}
                <div className="stamps">
                  <span className="stamp">{(k.h || []).length + 1}번째<small>다시 온 날</small></span>
                  {R.early && <span className="stamp">일찍 옴<small>할 일 먼저 끝냄</small></span>}
                  {R.kept === 2 && <span className="stamp">해냄<small>{md(new Date())}</small></span>}
                </div>
                <p className="strong">이제 달라진 것만 다시 재 보세요. ‘예’였던 질문은 건너뛰고 {k.a.filter((v) => v !== 10).length}개만 묻습니다.</p>
                <button type="button" className="button gold" onClick={() => setR({ ...R, step: 'stage', ans: k.a.slice(), stage: k.st })}>달라진 것만 다시 재기<Arrow /></button>
              </div>
            )}
          </div>
        )}
        {R.step === 'stage' && (
          <div className="rise">
            <span className="qtag">지금 단계</span>
            <h1 className="qtext">1주 사이 단계가 바뀌었나요?</h1>
            <div className="answers">
              {STAGES.map((s, i) => <button type="button" key={s} className={k.st === i ? 'picked' : ''} onClick={() => {
                const order = k.a.map((_, j) => j).filter((j) => k.a[j] !== 10);
                if (!order.length) { setR({ ...R, stage: i, ans: k.a.slice(), step: 'result' }); return; }
                setR({ ...R, stage: i, order, pos: 0, step: 'q' });
              }}>{s}{k.st === i && <span className="sub">지난번과 같음</span>}</button>)}
            </div>
          </div>
        )}
        {R.step === 'q' && qBox(R.order[R.pos], k.a[R.order[R.pos]], reAnswer, null, R.stage, ((R.pos + 1) / R.order.length) * 100, '달라진 것만')}
        {R.step === 'result' && (() => {
          const after = calc(R.ans), d = after.total - before.total;
          const hist = [...(k.h || []), { d: k.d, s: before.total }];
          const ns = nextStep(R.ans, R.stage);
          return (
            <div className="rise">
              <p className="eyebrow">다시 잰 결과 · {hist.length + 1}번째</p>
              <h1 className="sr-only">다시 잰 결과</h1>
              <div className="deltarow"><span className={'delta' + (d > 0 ? ' up' : '')}>{d > 0 ? '+' : ''}{d}점</span><span className="muted">{before.total}점 → {after.total}점</span></div>
              <p className="strong">{d > 0 ? '1주 전보다 채운 칸이 늘었습니다. 회색 점선이 1주 전입니다.' : d === 0 ? '점수는 그대로입니다. 아래 이번 주 할 일 하나만 해 보세요.' : '점수가 내려갔습니다. 고객을 직접 만나 보면 ‘예’라고 생각했던 답이 ‘조금’으로 바뀌는 일이 흔합니다. 잘못한 게 아닙니다.'}</p>
              <div className="grow">
                {hist.map((h) => <div key={h.d + h.s}><Plant lv={level(h.s)} size={56} />{md(new Date(h.d + 'T00:00:00'))}<br />{h.s}점</div>)}
                <div><Plant lv={level(after.total)} size={56} /><b>오늘</b><br />{after.total}점</div>
              </div>
              <div className="mt"><Result ans={R.ans} stage={R.stage} prevAxis={before.axis} titles={titles} /></div>
              <Letter base={{ v: 1, st: R.stage, a: R.ans.slice(), q: ns ? ns.i : -1, h: hist }} />
              <div className="minor"><Link className="text-link" to="/consulting#contact" state={{ message: `준비도 진단 ${before.total}→${after.total}점 · 단계: ${STAGE_SHORT[R.stage]}\n` }}>이 결과로 무료 첫 상담 60분 신청하기<Arrow /></Link></div>
            </div>
          );
        })()}
      </div></div>
    );
  }

  // 새 진단 화면
  const { total, axis } = S.step === 'result' ? calc(S.ans) : { total: 0, axis: [] };
  const lv = level(total);
  const ns = S.step === 'result' ? nextStep(S.ans, S.stage) : null;
  const pick = S.step === 'result' ? sheetFor(ns ? Q[ns.i][0] : weakAxis(axis), S.stage) : null;
  const memo = S.step === 'result' ? `준비도 진단 ${total}점(${LEVELS[lv][0]}) · 다음 칸 질문: ${ns ? SHORT[ns.i] : '-'} · 단계: ${STAGE_SHORT[S.stage]}\n` : '';
  const answered = S.ans.filter((v) => v != null).length;
  return (
    <div className="wrap page check"><div className="narrowcol">
      {S.step === 'start' && (
        <div className="start rise">
          <p className="eyebrow">3분 창업 준비도 진단</p>
          <h1>내 창업 준비,<br />지금 어디쯤일까요?</h1>
          <p className="lead">질문 10개, 3분이면 끝납니다. 아이디어도, 이름·연락처도 묻지 않습니다. 회사에 다니며 고민만 하는 단계여도 괜찮습니다. 그 단계에 맞춰 봅니다.</p>
          <div className="facts"><span className="chip">질문 10개</span><span className="chip">약 3분</span><span className="chip">연락처 없음</span><span className="chip">이번 주 할 일 1개</span><span className="chip">1주 뒤 다시 재 보기</span></div>
          <button type="button" className="button primary" onClick={start}>진단 시작하기<Arrow /></button>
          <p className="small muted privacy">결과 요약(점수·단계)만 이름 없이 수드에게 전달됩니다. 1주 뒤의 나에게 쓰는 한 줄은 이 기기와 내 캘린더에만 남습니다.</p>
          {savedKey && (
            <div className="saved">
              <span>지난 진단이 있습니다 · {daysLeft(savedKey) > 0 ? `다시 재는 날까지 ${daysLeft(savedKey)}일` : '오늘 다시 잴 수 있습니다'}</span>
              <button type="button" className="textlink" onClick={() => navigate('/check#k=' + enc(savedKey))}>지난 결과 보기 →</button>
            </div>
          )}
        </div>
      )}
      {S.step === 'stage' && (
        <div className="rise">
          <div className="progress"><span>시작 전 한 가지</span><div className="bar"><i style={{ transform: `scaleX(${answered / 10})` }} /></div><span>{answered}/10</span></div>
          <span className="qtag">지금 단계</span>
          <h1 className="qtext">지금 어느 단계인가요?</h1>
          {preset && <p className="small muted mb">{preset.from === 'widget' ? '블로그에서' : '글에서'} 고른 답(‘{ansLabel(preset.v)}’)은 그대로 이어 갑니다.</p>}
          <div className="answers">{STAGES.map((s, k) => <button type="button" key={s} onClick={() => pickStage(k)}>{s}</button>)}</div>
          <p className="small muted mt">단계마다 묻는 기준이 다릅니다. 아이디어 단계라면 아직 이른 질문은 점수에서 뺍니다.</p>
          <div className="qnav"><button type="button" className="textlink" onClick={() => setS({ ...S, step: 'start' })}>← 처음으로</button><span /></div>
        </div>
      )}
      {S.step === 'q' && qBox(S.order[S.pos], undefined, answer, back, S.stage, ((10 - S.order.length + S.pos + 1) / 10) * 100, Q[S.order[S.pos]][0])}
      {S.step === 'result' && (
        <div className="rise">
          <p className="eyebrow">진단 결과 · {STAGE_SHORT[S.stage]} 단계</p>
          <h1 className="sr-only">3분 진단 결과</h1>
          <Result ans={S.ans} stage={S.stage} titles={titles} />
          <Letter base={{ v: 1, st: S.stage, a: S.ans.slice(), q: ns ? ns.i : -1, h: [] }} />
          <div className="blk">
            <h2>이 결과로 할 수 있는 것</h2>
            <div className="ladder">
              <div><p className="step">① 표 한 장 받기 · 이메일 없이 바로</p>
                <p className="small muted">{SHEETS[pick].desc}</p>
                <a className="button gold block" href={SHEETS[pick].file} download onClick={() => trackEvent('check_sheet_download', { pick })}>「{SHEETS[pick].name}」 PDF 받기</a></div>
              <div><p className="step">② 수드에게 막힌 것 물어보기</p><Ask total={total} lv={lv} stage={S.stage} /></div>
              <div><p className="step">③ 직접 상담 받기 · 60분 무료</p>
                <Link className="button ghost block" to="/consulting#contact" state={{ message: memo }} onClick={() => trackEvent('check_to_consult')}>이 결과로 무료 첫 상담 60분 신청하기</Link></div>
            </div>
            <div className="minor"><button type="button" className="textlink" onClick={() => setS({ step: 'start', stage: null, ans: Array(10).fill(null), order: [], pos: 0 })}>처음부터 다시 하기</button></div>
          </div>
        </div>
      )}
    </div></div>
  );
}
