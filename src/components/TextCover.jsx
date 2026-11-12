import { formatDate } from '../lib/posts';

// 2026-11-12 지시서 v3 7단계: 글 표지는 그림 대신 한 가지 모양의 글씨 카드 (분류·제목·날짜·작은 캐릭터)
// 제목·분류·날짜로 자동으로 만들어서, 네이버 그림이 깨져도 검은 네모가 나오지 않는다
export default function TextCover({ kind, title, date, big = false }) {
  return (
    <div className={'text-cover' + (big ? ' big' : '')} aria-hidden={big ? undefined : 'true'}>
      <span className="tc-kind">{kind}</span>
      <span className="tc-title">{title}</span>
      <span className="tc-date">{formatDate(date)} · 수트와후드</span>
      <img className="tc-char" src="/sood-character-192.webp" alt="" width="52" height="52" loading="lazy" />
    </div>
  );
}
