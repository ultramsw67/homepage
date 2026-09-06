import { Link, useParams } from 'react-router-dom';
import { articlesData } from '../lib/articles';
import { profile } from '../lib/site';
export default function ArticleDetail() {
  const { id } = useParams();
  const article = articlesData.find(a => a.id === id);
  if (!article) return <div className="shell page-section not-found"><p className="eyebrow">JOURNAL / NOT FOUND</p><h1>글을 찾을 수 없습니다.</h1><Link className="button primary" to="/articles">글 목록으로 돌아가기 ↗</Link></div>;
  return <article className="shell page-section reading"><Link className="text-link" to="/articles">← 생각과 기록</Link><header><p className="eyebrow" style={{marginTop:40}}>{article.category}</p><h1>{article.title}</h1><p className="article-meta">{article.date} · 수트와후드</p></header><div className="article-body" dangerouslySetInnerHTML={{__html:article.content}} /><div className="reader-contact"><p>이 주제에 대한 생각을 나누고 싶다면 <a href={'mailto:' + profile.email}>이메일로 이야기해 주세요 ↗</a></p></div><Link className="text-link" to="/articles">← 모든 글 보기</Link></article>;
}
