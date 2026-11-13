import { Link } from 'react-router-dom';
import { Arrow } from './Icons';

// 칼럼·글 목록·연재 목록 아래 공통 안내 (2026-11-12, 지시서 v3 5단계). 글 분류가 상담 분야와 맞으면 서식에 그 분야를 골라 둔다.
const SERVICE_BY_CATEGORY = {
  '사업모델·가격-전략': '사업모델 · 전략',
  '투자유치·정부지원사업': '투자 · 정부지원',
  '1인-기업-AI-활용': 'AI 에이전트 · 1인 기업',
  'MVP·PMF-실전-전술': '지표 · PMF',
};

export default function ColumnCta({ category, title = '이 주제로 고민 중이라면' }) {
  const service = SERVICE_BY_CATEGORY[category];
  return (
    <div className="article-cta">
      <div>
        <strong>{title}</strong>
        <p>초기 상담 30분은 보수를 받지 않습니다. 지금 상황만 적어 주시면 1~2일 안에 답장드립니다.</p>
      </div>
      <Link className="button primary" to="/consulting#contact" state={service ? { service } : undefined}>자문 문의<Arrow /></Link>
    </div>
  );
}
