import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services, profile, stats, experience, process } from '../lib/site';
import { loadIndex } from '../lib/posts';
import PostCard from '../components/PostCard';
import { Arrow, Down, Blog, Book, Linked, Mail } from '../components/Icons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { loadIndex().then(setPosts).catch(() => setPosts([])); }, []);
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
            <p className="eyebrow hero-eyebrow rise d1"><span className="dot" aria-hidden="true" />{profile.role} · {profile.name}</p>
            <h1 className="rise d2">수트의 논리,<br /><em>후드</em>의 실행.</h1>
            <p className="lead rise d3">
              현대그룹 기획실에서 배운 숫자와 구조, 19년 창업과 매각(Exit)으로 익힌 실행.
              두 경험으로 창업자의 <strong>다음 한 수</strong>를 함께 찾습니다.
            </p>
            <div className="actions rise d4">
              <Link className="button primary" to="/consulting#contact">첫 상담 60분 신청<Arrow /></Link>
              <Link className="button ghost" to="/consulting">자문 영역 보기</Link>
            </div>
            <div className="hero-meta rise d5">
              <span>초기 스타트업 · 예비창업자 · 1인 기업</span>
              <span>보통 2~3일 안에 답장드립니다</span>
            </div>
            <div className="hero-links rise d5" aria-label="블로그, 브런치, 링크드인, 이메일">
              <a href={profile.blog} target="_blank" rel="noreferrer"><Blog />네이버 블로그</a>
              <a href={profile.brunch} target="_blank" rel="noreferrer"><Book />브런치</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linked />링크드인</a>
              <a href={'mailto:' + profile.email}><Mail />{profile.email}</a>
            </div>
          </div>

          <aside className="lead-card rise d6" aria-labelledby="lead-card-title">
            <h2 id="lead-card-title">첫 상담 60분 신청</h2>
            <p className="note">현재 지표와 고민을 듣고 먼저 풀어야 할 문제 하나와 다음 4주 동안 할 일을 한 장으로 정리해 드립니다.</p>
            <form onSubmit={toContact}>
              <div className="field">
                <label htmlFor="leadName">이름</label>
                <input id="leadName" name="leadName" type="text" autoComplete="name" maxLength="100" placeholder="이름 또는 팀 이름" />
              </div>
              <div className="field">
                <label htmlFor="leadEmail">회신받을 이메일</label>
                <input id="leadEmail" name="leadEmail" type="email" autoComplete="email" maxLength="200" placeholder="name@company.com" />
              </div>
              <div className="field">
                <label htmlFor="leadIssue">고민 한 줄</label>
                <input id="leadIssue" name="leadIssue" type="text" maxLength="300" placeholder="지금 가장 급한 문제 하나" />
              </div>
              <button className="button gold block" type="submit">상담 폼으로 이어가기<Down /></button>
            </form>
            <p className="foot">정리된 계획서가 없어도 괜찮습니다.<br />일정과 비용은 상담 범위에 따라 협의합니다.</p>
          </aside>
        </div>
      </section>

      <section className="trust" aria-label="신뢰 요소">
        <div className="wrap">
          <hr className="gold-rule" />
          <div className="stats-inner">
            {stats.map((s) => (
              <div key={s.value}>
                <strong>{s.value}</strong>
                <span>{s.dynamic === 'posts' && posts.length ? s.label.replace('{n}', posts.length) : (s.fallback || s.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="services">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">자문 영역</p>
            <h2>네 가지 축으로 함께 풉니다.</h2>
            <p className="lead">사업의 뼈대, 봐야 할 숫자, 자금, 혼자서도 돌아가는 운영 체계. 지금 가장 급한 한 축부터 시작합니다.</p>
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
          <p className="eyebrow">왜 수트와후드인가</p>
          <blockquote className="story-quote"><span className="q">“</span>대기업의 넥타이와 창업가의 후드티, 둘 다 입어봤습니다.<span className="q">”</span></blockquote>
          <div className="story-body">
            <p>현대그룹 기획실에서 수천억 규모의 M&amp;A(인수합병)와 가치평가(Valuation)를 다루며 <strong>숫자와 논리</strong>를 배웠습니다. 그러다 수트를 벗고 후드티의 세계로 나와 IT 스타트업을 세웠습니다.</p>
            <p>19년 동안 투자를 유치하며 회사를 키웠고 <strong>매각(Exit)으로 결실</strong>을 맺었습니다. 지금은 그 두 경험을 합쳐 창업자를 코칭합니다.</p>
          </div>
          <div className="story-sign">
            <div className="who">
              <span className="avatar"><img src="/sood-character.jpg" alt="" width="58" height="58" /></span>
              <span>
                <span className="name">{profile.name}</span>
                <span className="role">{profile.brand} ({profile.brandEn}) · {profile.role}</span>
              </span>
            </div>
            <Link className="text-link" to="/articles/224095280583">첫 번째 글: 넥타이와 후드티<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section" id="career">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">경력</p>
            <h2>기획실에서 창업으로, 창업에서 자문으로.</h2>
          </div>
          <div className="career-grid">
            <ol className="timeline">
              {experience.map((e, i) => (
                <li key={e.org} className={i === 0 ? 'is-now' : undefined}>
                  <span>{e.period}</span>
                  <strong>{e.org}</strong>
                  <em>{e.role}</em>
                </li>
              ))}
            </ol>
            <aside className="portrait">
              <div className="portrait-inner">
                <span className="portrait-avatar"><img src="/sood-character.jpg" alt={profile.name} width="92" height="92" /></span>
                <h3>{profile.name} · {profile.brand}</h3>
                <p>기획실의 프레임과 창업의 현장을 모두 겪었기에, 계획서의 숫자가 현실에서 어떻게 움직이는지 함께 봅니다. 정리된 자료가 없어도 지금 상황을 듣는 데서 시작합니다.</p>
                <div className="portrait-links">
                  <a href={profile.blog} target="_blank" rel="noreferrer"><Blog />네이버 블로그</a>
                  <a href={profile.brunch} target="_blank" rel="noreferrer"><Book />브런치</a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linked />LinkedIn</a>
                  <Link to="/about"><Arrow />소개 더 보기</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section band" id="process">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">진행 방식</p>
            <h2>세 단계로 시작합니다.</h2>
          </div>
          <div className="process-grid">
            {process.map((p) => (
              <div key={p.step}><span>{p.step}</span><h3>{p.title}</h3><p>{p.desc}</p></div>
            ))}
          </div>
          <div className="entry-offer">
            <div>
              <p className="eyebrow">처음이라면</p>
              <h3>첫 상담 60분, ‘다음 한 수 1장’</h3>
              <p>현재 지표와 고민을 듣고 지금 가장 먼저 풀어야 할 문제 하나와 다음 4주 동안 할 일을 한 장으로 정리해 드립니다. 이후 집중 자문으로 이어갈지는 그때 정합니다.</p>
            </div>
            <div className="offer-side">
              <Link className="button primary block" to="/consulting#contact">첫 상담 60분 신청<Arrow /></Link>
              <p className="small">일정과 비용은 상담 범위에 따라 협의합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="columns">
        <div className="wrap">
          <div className="section-head row">
            <div>
              <p className="eyebrow">최근 칼럼</p>
              <h2>매일 아침 한 편.</h2>
            </div>
            <Link className="button ghost" to="/articles">칼럼 전체 보기{posts.length ? ` · ${posts.length}편` : ''}<Arrow /></Link>
          </div>
          {latest.length ? (
            <div className="post-grid">{latest.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
          ) : (
            <p className="muted">글을 불러오는 중입니다.</p>
          )}
          <div className="channels">
            <a href={profile.blog} target="_blank" rel="noreferrer"><strong>네이버 블로그</strong><span>Design &amp; Breakthrough · 원문과 댓글</span></a>
            <a href={profile.brunch} target="_blank" rel="noreferrer"><strong>브런치</strong><span>방구석 데이터 경영 · 연재</span></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><strong>LinkedIn</strong><span>경력과 소식</span></a>
          </div>
        </div>
      </section>

      <section className="cta-band on-navy">
        <div className="wrap cta-inner">
          <div>
            <h2>지금 풀고 있는 문제, 같이 볼까요?</h2>
            <p>정리된 계획서가 없어도 괜찮습니다. 현재 상황과 고민부터 들려주세요.</p>
          </div>
          <div className="actions">
            <Link className="button primary" to="/consulting#contact">첫 상담 60분 신청<Arrow /></Link>
            <a className="button ghost" href={'mailto:' + profile.email}>{profile.email}</a>
          </div>
        </div>
      </section>
    </>
  );
}
