import { Link } from 'react-router-dom';
import { experience, profile, cases } from '../lib/site';

export default function About() {
  return (
    <div className="wrap page">
      <header className="page-head split">
        <div>
          <p className="eyebrow">소개</p>
          <h1>숫자로 생각하고,<br />현장에서 <em>배웁니다.</em></h1>
          <p className="lead">
            수트와후드, 문성운입니다. 연세대학교 화학공학을 졸업하고 현대그룹 기획실에서 커리어를 시작했습니다.
            사업의 구조를 이해하고 실행의 어려움을 아는 창업가이자 스타트업 경영 코치입니다.
          </p>
          <div className="social">
            <a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그</a>
            <a href={profile.brunch} target="_blank" rel="noreferrer">브런치</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={'mailto:' + profile.email}>{profile.email}</a>
          </div>
        </div>
        <figure className="portrait">
          <img src="/sood-character.jpg" alt="수트와후드 문성운의 브랜드 캐릭터" width="1020" height="1024" />
        </figure>
      </header>

      <section className="section prose-section">
        <p className="eyebrow">이야기</p>
        <h2>"대기업 출신이 왜 사서 고생을?"</h2>
        <div className="prose">
          <p>
            현대그룹 계열사 기획실에서 수천억 규모의 M&A, 가치평가, 사업 타당성 분석을 맡으며 비즈니스의 정석을 배웠습니다.
            숫자와 논리가 얼마나 강한 무기인지 그때 알았습니다. 하지만 거대한 시스템의 부품이 아니라 스스로의 힘으로 가치를 증명하고 싶어, 안정된 '수트(Suit)'를 벗고 거친 '후드티(Hood)'의 세계로 뛰어들었습니다.
          </p>
          <p>
            IT 스타트업 창업은 낭만이 아니라 생존 전쟁이었습니다. 자금난과 냉담한 시장 반응 속에서 '죽음의 계곡'을 건너며 빠른 피보팅과 위기관리를 몸으로 익혔습니다.
            19년을 버틴 회사는 투자 유치와 사업 매각(Exit)이라는 결실을 맺었습니다.
          </p>
          <p>
            지금은 그 경험을 바탕으로 스타트업 코치이자 자문가로 일합니다. 대기업의 '구조적 사고'와 창업가의 '실전 감각'을 결합해,
            아이디어를 비즈니스 언어로 풀지 못하거나 데이터를 전략으로 연결하지 못하는 팀에게 맞춤형 솔루션을 제안합니다.
            매일 아침 네이버 블로그와 브런치, 모비인사이드에 스타트업 경영 칼럼을 씁니다.
          </p>
        </div>
      </section>

      <section className="section" id="experience">
        <p className="eyebrow">경력</p>
        <h2>경험은 다음 질문의 토대가 됩니다.</h2>
        <ol className="timeline">
          {experience.map((e) => (
            <li key={e.org}>
              <span>{e.period}</span>
              <div>
                <strong>{e.org}</strong>
                <em>{e.role}</em>
                <p>{e.desc}</p>
                {e.points?.length ? <ul className="timeline-points">{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul> : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="muted small">연세대학교 화학공학 졸업</p>
      </section>

      <section className="section">
        <p className="eyebrow">자문 사례</p>
        <h2>분야는 달라도 질문은 같습니다.</h2>
        <div className="case-grid">
          {cases.map((c) => (
            <div key={c.field} className="case-card"><strong>{c.field}</strong><p>{c.result}</p></div>
          ))}
        </div>
        <p className="muted small">고객사 이름과 상세 수치는 공개하지 않습니다. 개별 프로젝트 범위는 상담에서 안내합니다.</p>
      </section>

      <section className="section">
        <p className="eyebrow">지금 하는 일</p>
        <h2>쓰고, 코칭하고, 강의합니다.</h2>
        <div className="now-grid">
          <div><strong>칼럼</strong><p>네이버 블로그 「Design & Breakthrough」에 스타트업 전략·투자·정부지원·AI 활용 글을 매일 씁니다. 브런치에서는 「방구석 데이터 경영」을 연재합니다.</p><Link className="text-link" to="/articles">글 보기 →</Link></div>
          <div><strong>1:1 자문</strong><p>초기 스타트업 대표와 1인 기업가를 위한 사업모델·지표·자금 코칭. 정리된 계획서가 없어도 시작할 수 있습니다.</p><Link className="text-link" to="/consulting">상담 안내 →</Link></div>
          <div><strong>강의 · 협업</strong><p>창업 교육, 정부지원사업 준비, AI 활용 강의와 콘텐츠 협업을 진행합니다.</p><a className="text-link" href={'mailto:' + profile.email}>메일로 제안하기 →</a></div>
        </div>
      </section>

      <div className="inline-cta">
        <h2>지금 풀고 싶은 문제가 있나요?</h2>
        <Link to="/consulting#contact" className="button primary">상담 문의하기</Link>
      </div>
    </div>
  );
}
