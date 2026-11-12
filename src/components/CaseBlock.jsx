import { Link } from 'react-router-dom';
import { caseCards, recruit } from '../lib/site';
import { Arrow } from './Icons';

// 익명 사례 네 장 + 후기 모집 안내 (2026-11-12, 지시서 v3 3단계). 홈(첫 화면 다음)과 상담 페이지(제목과 상품 칸 사이)에 같이 쓴다.
// onRecruit 가 있으면 같은 페이지 서식으로(상담 페이지), 없으면 상담 페이지 서식으로 '사례 모집'을 골라 보낸다(홈).
export default function CaseBlock({ onRecruit }) {
  return (
    <>
      <div className="section-head">
        <h2>함께 푼 문제 · 익명 사례</h2>
        <p className="lead">초기 스타트업과 1:1로 진행한 자문 가운데 일부입니다. 고객사 이름은 밝히지 않습니다. 후기가 아니라 제가 정리한 사례입니다.</p>
      </div>
      <div className="case-grid">
        {caseCards.map((c) => (
          <div key={c.tag} className="service-card case-card">
            <span className="num">{c.tag}</span>
            <h3>{c.title}</h3>
            <p className="tagline">결과: {c.result}</p>
          </div>
        ))}
      </div>
      <div className="entry-offer case-recruit">
        <div>
          <p className="eyebrow">후기 모집</p>
          <h3>{recruit.title}</h3>
          <p>{recruit.body}</p>
        </div>
        <div className="offer-side">
          {onRecruit
            ? <a className="button primary block" href="#contact" onClick={onRecruit}>사례 모집으로 요청하기<Arrow /></a>
            : <Link className="button primary block" to="/consulting#contact" state={{ product: '사례 모집' }}>사례 모집으로 요청하기<Arrow /></Link>}
          <p className="small">{recruit.note}</p>
        </div>
      </div>
    </>
  );
}
