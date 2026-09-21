import { Link } from 'react-router-dom';
import { experience, profile, cases } from '../lib/site';
import { Arrow, Blog, Book, Linked, Mail } from '../components/Icons';

export default function About() {
  return (
    <div className="wrap page">
      <header className="page-head split">
        <div>
          <p className="eyebrow">소개</p>
          <h1>숫자로 생각하고,<br />현장에서 <em>배웁니다.</em></h1>
          <p className="lead">
            수트와후드 문성운입니다. 연세대학교 화학공학을 졸업하고 현대그룹 기획실에서 일을 시작했습니다.
            사업의 구조를 이해하고 실행의 무게를 아는 창업가이자 스타트업 경영 코치입니다.
          </p>
          <div className="social">
            <a href={profile.blog} target="_blank" rel="noreferrer"><Blog />네이버 블로그</a>
            <a href={profile.brunch} target="_blank" rel="noreferrer"><Book />브런치</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linked />LinkedIn</a>
            <a href={'mailto:' + profile.email}><Mail />{profile.email}</a>
          </div>
        </div>
        <figure className="portrait-photo">
          <img src="/sood-character.jpg" alt="수트와후드 문성운의 브랜드 캐릭터" width="1020" height="1024" />
        </figure>
      </header>

      <section className="section prose-section">
        <p className="eyebrow">이야기</p>
        <h2>“대기업 출신이 왜 사서 고생을?”</h2>
        <div className="prose" style={{ marginTop: 28 }}>
          <p>
            현대그룹 계열사 기획실에서 수천억 규모의 M&amp;A(인수합병), 가치평가(Valuation), 사업 타당성 분석을 맡았습니다.
            숫자와 논리가 얼마나 강한 무기인지 그때 배웠습니다. 그리고 큰 조직의 한 부분으로 남기보다 내 힘으로 가치를 증명하고 싶어 수트를 벗고 후드티를 입었습니다.
          </p>
          <p>
            2001년 디지털 마케팅 회사 인터랙티비를 세웠습니다. 시장의 반응을 숫자로 읽고 빠르게 방향을 바꾸는 법을 현장에서 익혔고
            19년 동안 투자를 유치해 회사를 키운 뒤 매각(Exit)으로 결실을 맺었습니다.
          </p>
          <p>
            2023년부터는 30만 유저 서비스의 전략 고문으로 유저 세그멘테이션과 리텐션을 맡고 AI 에이전트 도입 모델과 신사업 타당성을 검토했습니다.
            지금은 대기업의 구조적 사고와 창업가의 실전 감각을 합쳐 초기 창업자와 1:1로 일합니다. 그동안 스무 팀 이상의 사업모델, 지표, 투자·정부지원을 함께 풀었습니다.
          </p>
          <p>
            매일 아침 네이버 블로그 「수트와후드」에 스타트업 경영 칼럼을 쓰고, 브런치북 「온라인 쇼핑몰의 데이터 경영 전략」 「런웨이 12주, 1000억의 증명」을 펴냈으며,
            모비인사이드에 「수트와 후드의 스타트업 경영」을 연재합니다.
          </p>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-head">
          <p className="eyebrow">경력</p>
          <h2>경험은 다음 질문의 토대가 됩니다.</h2>
        </div>
        <ol className="timeline">
          {experience.map((e, i) => (
            <li key={e.org} className={i === 0 ? 'is-now' : undefined}>
              <span>{e.period}</span>
              <strong>{e.org}</strong>
              <em>{e.role}</em>
              <p>{e.desc}</p>
              {e.points?.length ? <ul className="timeline-points">{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul> : null}
            </li>
          ))}
        </ol>
        <p className="muted small" style={{ marginTop: 24 }}>연세대학교 화학공학 졸업</p>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">자문 사례</p>
          <h2>함께 푼 문제들.</h2>
          <p className="lead">초기 스타트업과 1:1로 진행한 자문 가운데 일부를 익명으로 옮깁니다.</p>
        </div>
        <div className="case-grid">
          {cases.map((c) => (
            <div key={c.field} className="case-card"><strong>{c.field}</strong><p>{c.result}</p></div>
          ))}
        </div>
        <p className="muted small case-foot">고객사 이름과 상세 수치는 공개하지 않습니다. 개별 프로젝트 범위는 상담에서 안내합니다.</p>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="eyebrow">지금 하는 일</p>
          <h2>쓰고, 코칭합니다.</h2>
        </div>
        <div className="now-grid">
          <div><strong>칼럼</strong><p>네이버 블로그 「수트와후드」와 브런치에 스타트업 전략·투자·데이터 경영 글을 정기 연재하며, 모비인사이드 필진으로도 활동 중입니다.</p><Link className="text-link" to="/articles">글 보기<Arrow /></Link></div>
          <div><strong>1:1 자문</strong><p>초기 스타트업 대표와 1인 기업가를 위한 사업모델·지표·자금 코칭. 정리된 계획서가 없어도 시작할 수 있습니다.</p><Link className="text-link" to="/consulting">상담 안내<Arrow /></Link></div>
          <div><strong>콘텐츠 협업</strong><p>스타트업 경영 칼럼 기고와 콘텐츠 협업 제안을 받습니다.</p><a className="text-link" href={'mailto:' + profile.email}>메일로 제안하기<Arrow /></a></div>
        </div>
      </section>

      <div className="inline-cta">
        <div>
          <h2>지금 풀고 싶은 문제가 있나요?</h2>
          <p style={{ marginTop: 8 }}>정리된 계획서가 없어도 괜찮습니다. 보통 2~3일 안에 답장드립니다.</p>
        </div>
        <Link to="/consulting#contact" className="button primary">첫 상담 60분 신청<Arrow /></Link>
      </div>
    </div>
  );
}
