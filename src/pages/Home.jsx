import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services, profile, stats, process, picks } from '../lib/site';
import { loadIndex, loadBrunch } from '../lib/posts';
import PostCard from '../components/PostCard';
import { Arrow, Down } from '../components/Icons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [brunchCount, setBrunchCount] = useState(0);
  const [popular, setPopular] = useState(null);
  useEffect(() => { fetch('/popular.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).then((p) => { if (p && p.title && p.href) setPopular(p); }).catch(() => {}); }, []);
  useEffect(() => { loadIndex().then(setPosts).catch(() => setPosts([])); }, []);
  useEffect(() => { loadBrunch().then((b) => setBrunchCount(b?.posts?.length || 0)); }, []);
  const latest = posts.slice(0, 3);

  // 첫 화면 카드에 적은 내용을 상담 폼으로 그대로 옮긴다.
  function toContact(event) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const state = { name: fd.get('leadName')?.trim() || '', email: fd.get('leadEmail')?.trim() || '', message: fd.get('leadIssue')?.trim() || '' };
    navigate('/consulting#contact', { state });
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow rise d1"><span className="dot" aria-hidden="true" />{profile.role} {profile.name}</p>
            <h1 className="rise d2"><span className="nw">현대 기획실에서</span> <span className="nw">숫자를 배웠고,</span><br /><span className="nw">제 회사를</span> <span className="nw">19년 운영했습니다</span></h1>
            <p className="lead rise d3">
              지금은 초기 창업자와 마주 앉아 사업모델, 숫자, 자금 문제를 같이 봅니다.
              수트와후드(SOOD)는 넥타이와 후드티를 둘 다 입어 본 사람의 자문이라는 뜻입니다.
            </p>
            {/* 2026-10-09: 첫 화면은 글로 먼저 믿음을 주고, 상담은 뒤로 (위 메뉴 '상담 문의'·아래 상담 칸에서 바로 찾게) */}
            <div className="actions rise d4">
              <Link className="button primary" to="/series">사례 연재 먼저 보기<Arrow /></Link>
              {/* 2026-10-09: 두 번째 버튼 = 3분 진단 (첫 화면 6초·이탈 81% — 글보다 가벼운 첫 행동) */}
              <Link className="button ghost hero-check" to="/check">내 창업 준비, 3분 진단<Arrow /></Link>
            </div>
            <div className="hero-meta rise d5">
              <span>창업 3년 이내 대표, 1인 창업자와 일합니다</span>
              <a className="hero-contact" href="#process">상담 문의는 아래에서<Down /></a>
            </div>
          </div>

          <aside className="pick-card rise d6" aria-labelledby="pick-card-title">
            <h2 id="pick-card-title">먼저 읽어 보세요</h2>
            <p className="note">홈페이지에서 가장 오래 읽힌 글 3편입니다.</p>
            <ol className="pick-list">
              {picks.map((p) => (
                <li key={p.id}>
                  <Link to={'/articles/' + p.id}>
                    <span className="pick-tag">{p.tag}</span>
                    <span className="pick-title">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link className="text-link" to="/articles">칼럼 전체 보기<Arrow /></Link>
          </aside>
        </div>
      </section>

      <section className="trust" aria-label="신뢰 요소">
        <div className="wrap">
          <hr className="gold-rule" />
          <div className="stats-inner">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>{s.dynamic === 'posts' ? (posts.length ? s.value.replace('{n}', posts.length + brunchCount) : s.fallbackValue) : s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2>이런 문제를 같이 봅니다</h2>
            <p className="lead">사업모델부터 자금, 1인 기업 운영까지 넓게 봅니다. 다만 한 번에 하나씩, 지금 제일 급한 것부터 합니다.</p>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <Link key={s.id} to={'/consulting#' + s.id} className="service-card">
                <span className="num">{s.number}</span>
                <h3>{s.title}</h3>
                <p className="tagline">{s.tagline}</p>
                <p>{s.description}</p>
                <ul>{s.outputs.map((o) => <li key={o}>{o}</li>)}</ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section on-navy" id="story">
        <div className="wrap">
          {/* 문구는 sood-humanize 통과본 (2026-09-24, light, 변경률 0.2%) */}
          <p className="eyebrow">왜 수트와후드인가</p>
          <blockquote className="story-quote">“대기업의 넥타이와 창업가의 후드티, 둘 다 입어봤습니다.”</blockquote>
          <div className="story-body">
            <p>1993년 현대석유화학 기획실에서 첫 경력을 시작해 M&amp;A와 가치평가(Valuation)를 맡았습니다. 수천억 원 규모의 거래를 숫자로 따지는 자리였습니다. 2001년에는 넥타이를 풀고 IT 스타트업 인터랙티비를 창업했습니다. 투자를 유치해 회사를 키웠고 매각까지 이뤄냈습니다.</p>
            <p>그 뒤로 여러 스타트업을 곁에서 자문해 왔습니다. 지금은 수트의 논리와 후드의 실행, 두 경험을 합쳐 창업자를 코칭합니다.</p>
          </div>
          <div className="story-sign">
            <div className="who">
              <span className="avatar"><img src="/sood-character-192.webp" alt="" width="58" height="58" /></span>
              <span>
                <span className="name">{profile.name}</span>
                <span className="role">{profile.brand} ({profile.brandEn}) · {profile.role}</span>
              </span>
            </div>
            {/* 최근 한 달 조회수 1위 글 — 매일 09:50 대시보드 작업이 public/popular.json 을 갱신한다 (2026-09-24). 못 받으면 첫 글로 */}
            <div className="story-pick">
              <span className="pick-label">{popular ? '지난 한 달 가장 많이 읽힌 글' : '첫 번째 글'}</span>
              {popular && /^https?:/.test(popular.href)
                ? <a className="text-link" href={popular.href} target="_blank" rel="noreferrer">{popular.title}<Arrow /></a>
                : <Link className="text-link" to={popular ? popular.href : '/articles/224095280583'}>{popular ? popular.title : '넥타이와 후드티'}<Arrow /></Link>}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="career">
        <div className="wrap">
          <div className="section-head">
            <h2>코치 소개</h2>
          </div>
          <div className="career-grid solo">
            <aside className="portrait">
              <div className="portrait-inner">
                <span className="portrait-avatar"><img src="/sood-character-192.webp" alt={profile.name} width="92" height="92" loading="lazy" /></span>
                <h3>{profile.name} · {profile.brand}</h3>
                <p>기획실에서는 사업성을 따지는 쪽에, 창업하고 나서는 그 숫자를 맞춰야 하는 쪽에 있었습니다. 자료가 정리돼 있지 않아도 지금 상황부터 들려주시면 됩니다.</p>
                <div className="portrait-links">
                  <Link to="/about"><Arrow />경력 전체 보기</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 2026-10-09: 대표님 문구 그대로 (「홈페이지 안내 문구 최종안11」). 상담 칸 바로 위에서 '왜 같이 봐야 하나'를 잇는다 */}
      <section className="section monologue" id="alone" aria-labelledby="alone-title">
        <div className="wrap">
          <p className="eyebrow">혼자 고민하는 대표에게</p>
          <h2 id="alone-title" className="mono-title">결정은 결국 내 몫이다.</h2>
          <div className="mono-body">
            <p>매출은 지난달보다 늘었다.<br />그런데 월말에 통장을 열면 남은 게 없다.</p>
            <p>가격을 올려야 할까.<br />아니면 지금이라도 방향을 바꿔야 할까.</p>
            <p>주변에 물어보면<br />“잘하고 있어, 곧 될 거야” 하고 어깨를 두드려 준다.<br />고마운 말인데, 답은 아니다.</p>
            <p className="strong">일을 더 하는 건 힘들지 않다.<br />이 길이 맞는지 모르는 채 달리는 게 힘들다.</p>
            <p>오늘 밤도 혼자 엑셀을 열기 전에,<br />돈이 어디서 새는지 누군가와 같이 들여다보고 싶다.</p>
          </div>
          <hr className="mono-rule" />
          <div className="mono-close">
            <p className="mono-label">수드의 1:1 스타트업 경영 자문</p>
            <p>스무 팀과 다음 한 수를 함께 정했습니다.<br />혼자 보던 숫자, 이제 같이 봅니다.</p>
          </div>
        </div>
      </section>

      <section className="section band" id="process">
        <div className="wrap">
          <div className="section-head">
            <h2>상담은 이렇게 진행됩니다</h2>
          </div>
          <div className="process-grid">
            {process.map((p) => (
              <div key={p.step}><span>{p.step}</span><h3>{p.title}</h3><p>{p.desc}</p></div>
            ))}
          </div>
          <div className="entry-offer">
            <div>
              <p className="eyebrow">처음이라면</p>
              <h3>첫 상담 60분</h3>
              <p>지금 숫자와 고민을 듣고, 가장 먼저 풀 문제 하나와 4주 동안 할 일을 종이 한 장으로 드립니다. 이 한 장을 ‘다음 한 수 1장’이라고 부릅니다. 계속 같이 할지는 그다음에 정하셔도 됩니다.</p>
            </div>
            {/* 2026-10-09: 첫 화면에 있던 짧은 신청 칸을 이리로 옮김 — 적은 내용은 상담 폼으로 그대로 넘어간다 */}
            <form className="offer-side" onSubmit={toContact} aria-label="첫 상담 신청">
              <div className="field">
                <label htmlFor="leadName">이름</label>
                <input id="leadName" name="leadName" type="text" autoComplete="name" maxLength="100" placeholder="이름 또는 팀 이름" />
              </div>
              <div className="field">
                <label htmlFor="leadEmail">회신받을 이메일</label>
                <input id="leadEmail" name="leadEmail" type="email" autoComplete="email" maxLength="200" placeholder="name@company.com" />
              </div>
              <div className="field">
                <label htmlFor="leadIssue">지금 가장 막힌 것 한 줄</label>
                <input id="leadIssue" name="leadIssue" type="text" maxLength="300" placeholder="지금 가장 급한 문제 하나" />
              </div>
              <button className="button primary block" type="submit">이어서 작성하기<Arrow /></button>
              <p className="small">계획서가 없어도 됩니다. 비용은 할 일을 정한 뒤 말씀드립니다.</p>
            </form>
          </div>
        </div>
      </section>

      <section className="section" id="columns">
        <div className="wrap">
          <div className="section-head row">
            <div>
              <h2>매일 아침 칼럼을 씁니다</h2>
            </div>
            <Link className="button ghost" to="/articles">칼럼 전체 보기{posts.length ? ` (${posts.length}편)` : ''}<Arrow /></Link>
          </div>
          {latest.length ? (
            <div className="post-grid">{latest.map((p) => <PostCard key={p.id} post={p} />)}</div>
          ) : (
            <p className="muted">글을 불러오는 중입니다.</p>
          )}
          <div className="channels">
            <a href={profile.blog} target="_blank" rel="noreferrer"><strong>네이버 블로그</strong><span>수트와후드 · 원문과 댓글</span></a>
            <a href={profile.brunch} target="_blank" rel="noreferrer"><strong>브런치</strong><span>방구석 데이터 경영 · 연재</span></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><strong>LinkedIn</strong><span>경력과 소식</span></a>
          </div>
        </div>
      </section>

      <section className="cta-band on-navy">
        <div className="wrap cta-inner">
          <div>
            <h2>고민을 몇 줄로 보내 주세요</h2>
            <p>계획서가 없어도 됩니다. 지금 상황을 적어 주시면 1~2일 안에 답장드립니다.</p>
          </div>
          <div className="actions">
            <Link className="button primary" to="/consulting#contact">첫 상담 신청하기<Arrow /></Link>
            <a className="button ghost" href={'mailto:' + profile.email}>{profile.email}</a>
          </div>
        </div>
      </section>
    </>
  );
}
