import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { services, profile, stats, experience } from '../lib/site';
import { loadIndex } from '../lib/posts';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { loadIndex().then(setPosts).catch(() => setPosts([])); }, []);
  const latest = posts.slice(0, 6);

  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">{profile.role} · {profile.brand}</p>
          <h1>수트의 논리,<br />후드의 <em>실행.</em></h1>
          <p className="lead">
            현대그룹 기획실에서 배운 숫자와 구조, 19년 창업과 엑시트로 배운 실행.
            두 경험으로 창업자의 <strong>다음 한 수</strong>를 함께 찾습니다.
          </p>
          <div className="actions">
            <Link className="button primary" to="/consulting#contact">상담 문의하기</Link>
            <Link className="button ghost" to="/articles">칼럼 읽기</Link>
          </div>
          <div className="hero-links" aria-label="블로그, 브런치, 이메일">
            <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그<span aria-hidden="true">↗</span></a>
            <a href={profile.brunch} target="_blank" rel="noreferrer">브런치<span aria-hidden="true">↗</span></a>
            <a href={'mailto:' + profile.email}>{profile.email}</a>
          </div>
        </div>
        <figure className="hero-figure">
          <img src="/sood-character.jpg" alt="수트와후드 캐릭터. 안경을 쓰고 미소 짓는 문성운의 일러스트" width="1020" height="1024" fetchPriority="high" />
          <figcaption>문성운 · 스타트업 경영 코치 수드</figcaption>
        </figure>
      </section>

      <section className="stats">
        <div className="wrap stats-inner">
          {stats.map((s) => (
            <div key={s.value}>
              <strong>{s.value}</strong>
              <span>{s.dynamic === 'posts' && posts.length ? s.label.replace('{n}', posts.length) : (s.fallback || s.label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section wrap" id="services">
        <div className="section-head">
          <p className="eyebrow">함께하는 일</p>
          <h2>지금 가장 급한 문제 하나에 집중합니다.</h2>
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
      </section>

      <section className="story">
        <div className="wrap story-inner">
          <div>
            <p className="eyebrow">왜 수트와후드인가</p>
            <h2>대기업의 넥타이와<br />창업가의 후드티,<br />둘 다 입어봤습니다.</h2>
          </div>
          <div className="story-text">
            <p>
              현대그룹 기획실에서 수천억 규모의 M&A와 가치평가를 다루며 '숫자와 논리'를 배웠습니다.
              그러다 안정된 수트를 벗고 후드티의 세계로 나와 IT 스타트업을 세웠습니다. 19년 동안 투자를 유치하며 회사를 키웠고, 매각(Exit)으로 결실을 맺었습니다.
            </p>
            <p>
              지금은 그 두 경험을 합쳐 창업자를 코칭합니다. 아이디어를 비즈니스 언어로 풀지 못하거나, 데이터를 전략으로 잇지 못하는 팀에게 지표 중심의 데이터 경영을 제안합니다.
            </p>
            <div className="actions">
              <Link className="text-link" to="/about">경력과 일하는 방식 보기 →</Link>
              <Link className="text-link" to="/articles/224095280583">첫 번째 글: 넥타이와 후드티 →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head row">
          <div>
            <p className="eyebrow">최근 칼럼</p>
            <h2>매일 아침, 스타트업 경영 한 편.</h2>
          </div>
          <Link className="text-link" to="/articles">전체 글 {posts.length ? posts.length + '편 ' : ''}보기 →</Link>
        </div>
        {latest.length ? (
          <div className="post-grid">{latest.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}</div>
        ) : (
          <p className="muted">글을 불러오는 중입니다.</p>
        )}
        <div className="channels">
          <a href={profile.blog} target="_blank" rel="noreferrer"><strong>네이버 블로그</strong><span>Design & Breakthrough · 원문과 댓글</span></a>
          <a href={profile.brunch} target="_blank" rel="noreferrer"><strong>브런치</strong><span>방구석 데이터 경영 · 연재</span></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer"><strong>LinkedIn</strong><span>경력과 소식</span></a>
        </div>
      </section>

      <section className="section wrap timeline-preview">
        <div className="section-head">
          <p className="eyebrow">지나온 길</p>
          <h2>기획실에서 창업으로, 창업에서 코칭으로.</h2>
        </div>
        <ol className="timeline compact">
          {experience.map((e) => (
            <li key={e.org}><span>{e.period}</span><strong>{e.org}</strong><em>{e.role}</em></li>
          ))}
        </ol>
      </section>

      <section className="cta-band">
        <div className="wrap cta-inner">
          <div>
            <h2>지금 풀고 있는 문제, 같이 볼까요?</h2>
            <p>정리된 계획서가 없어도 괜찮습니다. 현재 상황과 고민부터 들려주세요.</p>
          </div>
          <div className="actions">
            <Link className="button primary" to="/consulting#contact">상담 문의하기</Link>
            <a className="button ghost" href={'mailto:' + profile.email}>{profile.email}</a>
          </div>
        </div>
      </section>
    </>
  );
}
