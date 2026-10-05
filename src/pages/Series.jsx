import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { loadSeries, formatDate } from '../lib/posts';

// 사례 연재 6개 모아 보기 (2026-10-05). 회차 제목은 네이버 블로그 원문으로 새 창에서 연다.
// 블로그 사이드바 위젯 「수드의 연재 6개」가 이 페이지로 보낸다.
const LATEST = 3;
const short = (name) => name.replace(/^수드의 /, '');

function SeriesItem({ item }) {
  return (
    <li>
      <span className="series-no">{item.no}편</span>
      <span className="series-meta">{item.subject}{item.subject ? ' · ' : ''}{formatDate(item.date)}</span>
      <a className="series-title" href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
    </li>
  );
}

function SeriesCard({ s, full, onToggle }) {
  // onToggle 이 없으면(연재 하나만 고른 화면) 늘 전체 목록
  const newest = [...s.items].reverse();
  const shown = full ? newest : newest.slice(0, LATEST);
  return (
    <section className={full ? 'series-card is-open' : 'series-card'} id={'series-' + s.key} aria-labelledby={'series-h-' + s.key}>
      <header className="series-head">
        <span className="series-key" aria-hidden="true">{s.key}</span>
        <div>
          <h2 id={'series-h-' + s.key}>{s.name}</h2>
          <p>{s.desc}</p>
        </div>
        <span className="series-count">{s.items.length}편</span>
      </header>
      <ol className="series-list">{shown.map((i) => <SeriesItem key={i.id} item={i} />)}</ol>
      {onToggle && s.items.length > LATEST && (
        <button type="button" className="series-more" aria-expanded={full} onClick={onToggle}>
          {full ? '최신 3편만 보기' : `전체 ${s.items.length}편 보기`}
        </button>
      )}
    </section>
  );
}

export default function Series() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState({});
  const [params, setParams] = useSearchParams();
  const pick = (params.get('s') || '').toUpperCase();

  useEffect(() => { loadSeries().then(setData).catch(() => setError(true)); }, []);

  const list = data ? data.series : [];
  const chosen = list.find((s) => s.key === pick);
  const shown = chosen ? [chosen] : list;

  function choose(key) {
    setParams((prev) => {
      const n = new URLSearchParams(prev);
      if (key) n.set('s', key); else n.delete('s');
      return n;
    }, { replace: true });
  }

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">연재</p>
        <h1>회사 하나를<br />끝까지 뜯어보는 <em>6개 연재</em></h1>
        <p className="lead">
          블로그 사례 글{data ? ` ${data.total}편` : ''}을 연재별로 모았습니다. 돈 버는 구조, 첫 제품, 방향 전환, 혼자 일하는 법,
          AI 스타트업, 창업자의 결정. 회차 제목을 누르면 네이버 블로그 글이 새 창에서 열립니다.
        </p>
      </header>

      {data && (
        <div className="filters series-filters" aria-label="연재 고르기">
          <button type="button" aria-pressed={!chosen} onClick={() => choose('')}>전체 {data.total}</button>
          {list.map((s) => (
            <button key={s.key} type="button" aria-pressed={chosen?.key === s.key} onClick={() => choose(s.key)}>
              {short(s.name)} {s.items.length}
            </button>
          ))}
        </div>
      )}

      {error && <p className="empty" role="status">연재 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
      {!data && !error && <p className="muted">연재 목록을 불러오는 중입니다.</p>}
      {data && (
        <div className={chosen ? 'series-grid one' : 'series-grid'}>
          {shown.map((s) => (
            <SeriesCard key={s.key} s={s} full={Boolean(chosen) || Boolean(open[s.key])} onToggle={chosen ? null : () => setOpen({ ...open, [s.key]: !open[s.key] })} />
          ))}
        </div>
      )}

      {data && (
        <p className="series-foot muted">
          새 편이 나오면 이 목록에 바로 더해집니다. 다른 글은 <Link to="/articles">글 전체 보기</Link>에서,
          내 회사에 맞춰 같이 보고 싶다면 <Link to="/consulting#contact">상담 문의</Link>로 오세요.
        </p>
      )}
    </div>
  );
}
