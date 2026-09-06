import { useState } from 'react';
import { Link } from 'react-router-dom';
import { articlesData } from '../lib/articles';
import { profile } from '../lib/site';
export default function Articles() {
  const [filter, setFilter] = useState('전체');
  const [query, setQuery] = useState('');
  const categories = ['전체', ...new Set(articlesData.map(a => a.category))];
  const articles = articlesData.filter(a => (filter === '전체' || a.category === filter) && (a.title + ' ' + a.excerpt).toLowerCase().includes(query.toLowerCase()));
  return <div className="shell page-section"><p className="eyebrow">THE SOOD JOURNAL</p><h1 className="page-title">생각은 나눌수록,<br /><em>더 멀리 갑니다.</em></h1><p className="lead">스타트업, 일하는 방식, 그리고 AI.<br />변화를 읽고 사업의 다음 질문을 찾는 기록입니다.</p><div className="channel-banner"><p>수트와후드의 새로운 글은 이곳에서 만나보세요.</p><div><a href={profile.blog} target="_blank" rel="noreferrer">네이버 블로그 ↗</a><a href={profile.brunch} target="_blank" rel="noreferrer">브런치스토리 ↗</a></div></div><div className="journal-toolbar"><div className="filters" aria-label="글 카테고리">{categories.map(c => <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>)}</div><label className="search-label"><span className="sr-only">글 검색</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="궁금한 주제 검색" /></label></div><div className="article-list">{articles.map((a, i) => <Link to={'/articles/' + a.id} className="article-row" key={a.id}><span className="article-number">0{i+1}</span><div><p className="eyebrow">{a.category} / {a.date}</p><h2>{a.title}</h2><p>{a.excerpt}</p></div><span className="article-arrow">↗</span></Link>)}{articles.length === 0 && <p className="empty-state" role="status">검색 결과가 없습니다. 다른 단어나 카테고리를 선택해 주세요.</p>}</div></div>;
}
