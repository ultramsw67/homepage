import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Q, SHORT, EARLY, TODO, SMALL, PEN, AXES, STAGES, STAGE_SHORT, LEVELS, VERDICT, POSTS, SHEETS, SEAL_DAYS,
  calc, level, weakAxis, nextStep, sheetFor, dec, keyUrl, saveKey, loadKey, enc, addDays, isoDate, md, daysPassed, daysLeft,
  icsText, download, plantSvg, wallpaperBlob,
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
            {have.length ? <><p>이미 갖춘 것 {have.length}개</p><div className="chips">{have.map((h) => <span className="chip" key={h}>{h}</span>)}</div></> : <p>‘조금’이라고 답한 것도 이미 시작한 겁니다.</p>}
          </div>
          {skipped > 0 && <p className="small muted">아직 이른 질문 {skipped}개는 점수에서 뺐습니다.</p>}
          <div className="nextbar">
            {ns ? <>
              <div className="lab"><span>{LEVELS[lv][0]} {total}점</span><span>{lv < 3 ? `${LEVELS[lv + 1][0]} ${ns.nextAt}점` : '100점'}</span></div>
              <div className="track"><i style={{ width: `${Math.min(100, ((total - lo) / Math.max(1, hi - lo)) * 100)}%` }} /></div>
              <p>{ns.up
                ? <>‘{SHORT[ns.i]}’ 하나만 ‘예’가 되면 <b>{ns.t2}점, {LEVELS[level(ns.t2)][0]}</b>입니다.</>
                : <>‘{SHORT[ns.i]}’ 하나만 ‘예’가 되면 {ns.t2}점입니다.{lv < 3 && ` ${LEVELS[lv + 1][0]}까지 ${ns.nextAt - total}점 남았습니다.`}</>}</p>
            </> : <p>모든 질문에 ‘예’입니다. 2주 뒤에도 그대로인지 다시 재 보세요.</p>}
          </div>
        </div>
        <div>
          <Radar scores={axis} prev={prevAxis} />
          {prevAxis
            ? <div className="legend"><span><i className="was" />2주 전</span><span><i className="now" />오늘</span></div>
            : <p className="small muted center">갈래마다 20점 만점</p>}
        </div>
      </div>
      {qi >= 0 && (
        <div className="blk">
          <h2>수드의 빨간 펜</h2>
          <div className="pen">
            <span className="why">다음 칸으로 가는 질문</span>
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

function Letter({ base }) {
  const [note, setNote] = useState('');
  const [bet, setBet] = useState('');
  const [key, setKey] = useState(null);
  const [wall, setWall] = useState('');
  const [copied, setCopied] = useState(false);
  const due = md(addDays(isoDate(new Date()), SEAL_DAYS));
  function seal() {
    const k = { ...base, n: note.trim() || '고객 후보 5명을 만나고 가격을 한 번 말해 봤다', b: bet.trim(), d: isoDate(new Date()) };
    setKey(k); saveKey(k);
    trackEvent('check_letter_seal', { has_bet: !!bet.trim(), round: (k.h || []).length });
  }
  async function makeWall() {
    const { url, blob } = await wallpaperBlob(key);
    setWall(url);
    download('이번 주 할 일 잠금화면.png', blob);
    trackEvent('check_wallpaper');
  }
  return (
    <div className="blk">
      <h2>2주 뒤의 나에게 쪽지 한 장</h2>
      <p className="muted mb">쪽지는 2주 동안 봉인됩니다. {due}에 열립니다. 할 일을 먼저 끝내면 그 전에 열 수 있습니다. 쪽지와 답은 이 링크와 이 기기에만 남고, 수드도 볼 수 없습니다.</p>
      {!key ? (
        <div className="letter-form">
          <label htmlFor="note">2주 뒤 나는 이렇게 돼 있을 겁니다</label>
          <textarea id="note" rows="2" maxLength="80" value={note} onChange={(e) => setNote(e.target.value)} placeholder="예) 고객 후보 5명을 만나고 가격을 한 번 말해 봤다" />
          <label htmlFor="bet">해내면 나에게 주는 것 <span className="small muted">(선택)</span></label>
          <input type="text" id="bet" maxLength="30" value={bet} onChange={(e) => setBet(e.target.value)} placeholder="예) 혼자 가는 좋은 점심 한 끼" />
          <button type="button" className="button gold block" onClick={seal}>쪽지 봉인하고 열쇠 받기</button>
        </div>
      ) : (
        <div className="keybox">
          <b>열쇠가 만들어졌습니다</b>
          <p className="small muted">이 주소를 다시 열면 쪽지와 오늘 결과가 그대로 나옵니다. 이 기기에서는 아래 바에 남은 날이 보입니다.</p>
          <div className="url">{keyUrl(key)}</div>
          <div className="acts">
            <button type="button" onClick={() => { navigator.clipboard?.writeText(keyUrl(key)).catch(() => {}); setCopied(true); trackEvent('check_key_copy'); }}>{copied ? '복사했습니다' : '열쇠 링크 복사'}<small>카톡 ‘나와의 채팅’에 붙여 두세요</small></button>
            <button type="button" onClick={() => { download('쪽지 열리는 날.ics', new Blob([icsText(key)], { type: 'text/calendar' })); trackEvent('check_key_ics'); }}>달력에 넣기<small>{due} 아침에 알림</small></button>
            <button type="button" onClick={makeWall}>잠금화면 한 장<small>일주일 동안 할 일이 보입니다</small></button>
          </div>
          {wall && <div className="wall-prev"><img src={wall} alt="잠금화면 미리보기" /><p className="small muted">위쪽은 시계 자리라 비워 뒀습니다</p></div>}
        </div>
      )}
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
      <b>수드에게 막힌 것 한 줄</b>
      <p className="small muted">이름과 회사를 빼고, 블로그 「진단 상담실」 글로 답합니다. 비슷한 고민이 있는 분들도 같이 읽습니다.</p>
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
    return Number.isInteger(q) && q >= 0 && q < 10 && [0, 5, 10].includes(v) && p.has('q') ? { q, v, from: p.get('from') || 'article' } : null;
  }, [search]);
  const urlKey = useMemo(() => (hash.startsWith('#k=') ? dec(hash.slice(3)) : null), [hash]);
  const savedKey = useMemo(() => loadKey(), []);

  const [S, setS] = useState(() => ({ step: 'start', stage: null, ans: Array(10).fill(null), order: [], pos: 0 }));
  const [R, setR] = useState({ step: 'none' });   // 다시 온 날 흐름

  // 열쇠 링크로 들어왔으면 '다시 온 날'로
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
      alertOwner({ ans, stage: s.stage, from: s.from === 'article' ? '글 끝 질문' : '진단 페이지' });
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
      alertOwner({ ans, stage: r.stage, from: '2주 뒤 열쇠 링크', prev: before });
      return { ...r, ans, step: 'result' };
    });
  }

  const qBox = (qi, prevAns, onPick, onBack, stage, progress, label) => (
    <div className="rise" key={qi}>
      <div className="progress"><span>{label}</span><div className="bar"><i style={{ width: `${progress}%` }} /></div><span>{Math.round(progress / 10)}/10</span></div>
      <span className="qtag">{qi + 1}. {Q[qi][0]}{prevAns !== undefined ? ` · 2주 전 답: ${ansLabel(prevAns)}` : ''}</span>
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
            <h1>쪽지는 {left}일 뒤에 열립니다</h1>
            <p className="lead">그 전에 열 수 있는 방법이 하나 있습니다. 이번 주 할 일을 끝내는 겁니다.</p>
            <div className="todo left">이번 주 할 일 — {TODO[qi0]}</div>
            <div className="earlybox">
              <label><input type="checkbox" className="box" checked={!!R.did} onChange={(e) => setR({ ...R, did: e.target.checked })} /> 할 일을 끝냈습니다</label>
              <button type="button" className="button primary block" disabled={!R.did} onClick={() => { setR({ ...R, step: 'letter', early: true }); trackEvent('return_open_early'); }}>쪽지 먼저 열기</button>
            </div>
            <p className="small muted">아직이라면 괜찮습니다. 달력 알림이 {md(addDays(k.d, SEAL_DAYS))}에 다시 불러 드립니다.</p>
          </div>
        )}
        {R.step === 'letter' && (
          <div className="seal rise">
            <p className="eyebrow">{R.early ? '할 일을 먼저 끝낸 분께 · 일찍 열림' : `${passed}일 전의 내가 보낸 쪽지`}</p>
            <h1 className="sr-only">2주 전 나에게 쓴 쪽지</h1>
            <div className="envelope open" />
            <div className="oldnote">
              <div className="hand">“{k.n}”</div>
              <div className="meta">{k.d.replace(/-/g, '.')} 봉인 · 그때 {LEVELS[level(before.total)][0]} {before.total}점{k.b ? ` · 해내면 나에게: ${k.b}` : ''}</div>
            </div>
            <h2 className="kept-q">이 쪽지, 지켰나요?</h2>
            <div className="kept">
              {[[2, '지켰어요'], [1, '절반쯤요'], [0, '못 했어요']].map(([v, l]) => <button type="button" key={v} disabled={R.kept != null} className={R.kept === v ? 'on' : ''} onClick={() => { setR({ ...R, kept: v }); trackEvent('return_kept', { kept: ['못함', '절반', '지킴'][v] }); }}>{l}</button>)}
            </div>
            {R.kept != null && (
              <div className="reply">
                {R.kept === 0 && <>괜찮습니다. {R.early ? '이번 주 할 일은 끝냈으니 이미 한 칸 움직였습니다.' : '2주 뒤에 이 쪽지를 다시 열었다면 아직 놓지 않았습니다.'}<br />할 일을 더 작게 쪼갰습니다. <b>{SMALL[qi0]}</b></>}
                {R.kept === 1 && '절반이면 충분히 움직인 겁니다. 2주 전에는 0이었으니까요.'}
                {R.kept === 2 && <>약속을 지켰습니다.{k.b ? <> 이제 「{k.b}」 받으세요.</> : ''}</>}
                <div className="stamps">
                  <span className="stamp">{(k.h || []).length + 1}번째<small>다시 온 날</small></span>
                  {R.early && <span className="stamp">일찍 연 사람<small>할 일 먼저 끝냄</small></span>}
                  {R.kept === 2 && <span className="stamp">약속 지킴<small>{md(new Date())}</small></span>}
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
            <h1 className="qtext">2주 사이 단계가 바뀌었나요?</h1>
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
              <p className="strong">{d > 0 ? '2주 동안 오각형이 이만큼 넓어졌습니다.' : d === 0 ? '점수는 같습니다. 그래도 어디서 막혔는지는 2주 전보다 분명해졌습니다. 오늘 고른 할 일이 그 자리입니다.' : '점수가 내려갔습니다. 실제로 고객을 만나 보면 ‘예’였던 답이 ‘조금’으로 바뀌는 일이 많습니다. 내려간 게 아니라 더 정확해진 겁니다.'}</p>
              <div className="grow">
                {hist.map((h) => <div key={h.d + h.s}><Plant lv={level(h.s)} size={56} />{md(new Date(h.d + 'T00:00:00'))}<br />{h.s}점</div>)}
                <div><Plant lv={level(after.total)} size={56} /><b>오늘</b><br />{after.total}점</div>
              </div>
              <div className="mt"><Result ans={R.ans} stage={R.stage} prevAxis={before.axis} titles={titles} /></div>
              <Letter base={{ v: 1, st: R.stage, a: R.ans.slice(), q: ns ? ns.i : -1, h: hist }} />
              <div className="minor"><Link className="text-link" to="/consulting#contact" state={{ message: `준비도 진단 ${before.total}→${after.total}점 · 단계: ${STAGE_SHORT[R.stage]}\n` }}>이 결과로 첫 상담 60분 신청하기<Arrow /></Link></div>
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
          <div className="facts"><span className="chip">질문 10개</span><span className="chip">약 3분</span><span className="chip">연락처 없음</span><span className="chip">이번 주 할 일 1개</span><span className="chip">2주 뒤 다시 재 보기</span></div>
          <button type="button" className="button primary" onClick={start}>진단 시작하기<Arrow /></button>
          <p className="small muted privacy">결과 요약(점수·단계)만 이름 없이 수드에게 전달됩니다. 쪽지를 쓰면 그 내용은 이 기기와 열쇠 링크에만 남습니다.</p>
          {savedKey && (
            <div className="saved">
              <span>봉인한 쪽지가 있습니다 · {daysLeft(savedKey) > 0 ? `D-${daysLeft(savedKey)}` : '오늘 열 수 있습니다'}</span>
              <button type="button" className="textlink" onClick={() => navigate('/check#k=' + enc(savedKey))}>쪽지 보러 가기 →</button>
            </div>
          )}
        </div>
      )}
      {S.step === 'stage' && (
        <div className="rise">
          <div className="progress"><span>시작 전 한 가지</span><div className="bar"><i style={{ width: `${answered * 10}%` }} /></div><span>{answered}/10</span></div>
          <span className="qtag">지금 단계</span>
          <h1 className="qtext">지금 어느 단계인가요?</h1>
          {preset && <p className="small muted mb">글에서 고른 답(‘{ansLabel(preset.v)}’)은 그대로 이어 갑니다.</p>}
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
            <h2>다음 걸음</h2>
            <div className="ladder">
              <div><p className="step">작은 걸음 · 이메일 1개</p>
                <Link className="button gold block" to={`/free?pick=${pick}`} state={{ stage: S.stage, total, lv }} onClick={() => trackEvent('check_to_free', { pick })}>이 결과에 맞는 한 장 받기 — {SHEETS[pick].name}</Link></div>
              <div><p className="step">중간 걸음 · 이름 없이 한 줄</p><Ask total={total} lv={lv} stage={S.stage} /></div>
              <div><p className="step">큰 걸음 · 60분</p>
                <Link className="button ghost block" to="/consulting#contact" state={{ message: memo }} onClick={() => trackEvent('check_to_consult')}>이 결과로 첫 상담 60분 신청하기</Link></div>
            </div>
            <div className="minor"><button type="button" className="textlink" onClick={() => setS({ step: 'start', stage: null, ans: Array(10).fill(null), order: [], pos: 0 })}>처음부터 다시 하기</button></div>
          </div>
        </div>
      )}
    </div></div>
  );
}
