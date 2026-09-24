import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { services, profile, process, faq } from '../lib/site';
import { trackLead } from '../lib/analytics';
import { Arrow, Blog, Book, Linked } from '../components/Icons';

const ENDPOINT = 'https://api.web3forms.com/submit';

function mailtoLink(data) {
  const body = `이름 / 팀: ${data.name}\n회신 이메일: ${data.email}\n상담 분야: ${data.service}\n\n현재 상황과 고민:\n${data.message}`;
  const subject = `[SOOD 상담] ${data.service} · ${data.name}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Consulting() {
  const [state, setState] = useState({ phase: 'idle', text: '' });
  const { state: prefill } = useLocation();
  const formRef = useRef(null);

  // 홈 첫 화면 카드에서 적어 온 내용을 채우고, 비어 있는 첫 칸에 커서를 둔다.
  useEffect(() => {
    if (!prefill || !formRef.current) return;
    const form = formRef.current;
    for (const key of ['name', 'email', 'message']) {
      if (prefill[key] && form.elements[key] && !form.elements[key].value) form.elements[key].value = prefill[key];
    }
    const next = ['name', 'email', 'message'].find((k) => !form.elements[k].value);
    const t = setTimeout(() => form.elements[next || 'message']?.focus({ preventScroll: true }), 400);
    return () => clearTimeout(t);
  }, [prefill]);

  async function contact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const data = { name: fd.get('name'), email: fd.get('email'), service: fd.get('service'), message: fd.get('message') };
    if (fd.get('botcheck')) return;

    if (!profile.formKey) {
      window.location.href = mailtoLink(data);
      setState({ phase: 'mailto', text: `메일 앱이 열렸습니다. 발송 버튼을 눌러야 접수됩니다. 앱이 열리지 않으면 ${profile.email} 로 직접 보내주세요.` });
      return;
    }

    setState({ phase: 'sending', text: '보내는 중입니다…' });
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: profile.formKey,
          subject: `[SOOD 상담] ${data.service} · ${data.name}`,
          from_name: 'SOOD 홈페이지 상담 폼',
          name: data.name,
          email: data.email,
          replyto: data.email,
          service: data.service,
          message: data.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        form.reset();
        trackLead();
        setState({ phase: 'sent', text: '접수됐습니다. 보통 2~3일 안에 회신 이메일로 답장드립니다.' });
      } else {
        throw new Error(json.message || res.statusText);
      }
    } catch {
      setState({ phase: 'error', text: `전송에 실패했습니다. 아래 버튼으로 메일 앱을 열거나 ${profile.email} 로 직접 보내주세요.`, fallback: mailtoLink(data) });
    }
  }

  return (
    <>
      <div className="wrap page">
        <header className="page-head">
          <p className="eyebrow">상담</p>
          <h1>무엇을 돕는지,<br />어떻게 진행하는지</h1>
          <p className="lead">초기 스타트업 대표, 예비창업자, 1인 기업가와 일합니다. 자주 받는 질문은 아래에 먼저 답해 두었습니다.</p>
          <div className="actions">
            <a className="button primary" href="#contact">첫 상담 60분 신청<Arrow /></a>
            <a className="button ghost" href="#faq">자주 묻는 질문</a>
          </div>
        </header>

        <section className="section" id="services">
          <div className="section-head">
            <h2>이런 문제를 같이 봅니다</h2>
          </div>
          {services.map((s) => (
            <article id={s.id} key={s.id} className="service-row">
              <span className="num">{s.number}</span>
              <div>
                <h2>{s.title}</h2>
                <p className="tagline">{s.tagline}</p>
                <p>{s.description}</p>
              </div>
              <ul>{s.outputs.map((o) => <li key={o}>{o}</li>)}</ul>
            </article>
          ))}
        </section>

        <section className="section" id="process">
          <div className="section-head">
            <h2>상담은 이렇게 진행됩니다</h2>
          </div>
          <div className="process-grid">
            {process.map((p) => (
              <div key={p.step}><span>{p.step}</span><h3>{p.title}</h3><p>{p.desc}</p></div>
            ))}
          </div>
          <div className="entry-offer">
            <div>
              <p className="eyebrow">처음이라면</p>
              <h3>첫 상담 60분</h3>
              <p>현재 지표와 고민을 듣고 지금 가장 먼저 풀어야 할 문제 하나와 다음 4주 동안 할 일을 한 장으로 정리해 드립니다. 이후 집중 자문으로 이어갈지는 그때 정합니다.</p>
            </div>
            <div className="offer-side">
              <a className="button primary block" href="#contact">첫 상담 60분 신청<Arrow /></a>
              <p className="small">비용은 할 일을 정한 뒤 말씀드립니다.</p>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-head">
            <h2>자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <section className="section on-navy contact" id="contact">
        <div className="wrap contact-grid">
          <div>
            <p className="eyebrow">상담 문의</p>
            <h2>고민을 몇 줄로 보내 주세요</h2>
            <p className="lead">계획서가 없어도 됩니다. 지금 상황을 적어 주시면 2~3일 안에 답장드립니다.</p>
            <div className="contact-mail">
              <p className="k">이메일</p>
              <a className="contact-email" href={'mailto:' + profile.email}>{profile.email}</a>
              <p>보통 2~3일 안에 답장드립니다.</p>
            </div>
            <div className="contact-social">
              <a href={profile.blog} target="_blank" rel="noreferrer"><Blog />네이버 블로그</a>
              <a href={profile.brunch} target="_blank" rel="noreferrer"><Book />브런치</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linked />LinkedIn</a>
            </div>
          </div>
          <form className="form-card" onSubmit={contact} ref={formRef}>
            <h3>상담 요청</h3>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">이름 / 팀 또는 회사</label>
                <input id="name" name="name" autoComplete="organization" required maxLength="100" placeholder="홍길동 / 팀 이름" />
              </div>
              <div className="field">
                <label htmlFor="email">회신받을 이메일</label>
                <input id="email" name="email" type="email" autoComplete="email" required maxLength="200" placeholder="hello@yourcompany.com" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="service">함께 이야기할 분야</label>
              <select id="service" name="service">
                {services.map((s) => <option key={s.id}>{s.title}</option>)}
                <option>콘텐츠 협업 · 기타</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">현재 상황과 고민</label>
              <textarea id="message" name="message" required rows="5" maxLength="3000" placeholder="어떤 사업을 하고 계신가요? 가장 고민되는 점을 알려주세요." />
            </div>
            <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="honeypot" aria-hidden="true" />
            <button className="button primary block" type="submit" disabled={state.phase === 'sending'}>
              {profile.formKey ? (state.phase === 'sending' ? '보내는 중…' : '상담 요청 보내기') : '상담 메일 작성하기'}
              <Arrow />
            </button>
            <p className="small">{profile.formKey ? `보내기를 누르면 ${profile.email} 로 바로 전달됩니다. 입력한 이메일로 답장드립니다.` : '입력 내용으로 메일 앱이 열립니다. 사이트는 내용을 저장하지 않습니다.'}</p>
            <p role="status" className="form-status">
              {state.text}
              {state.phase === 'error' && state.fallback && <> <a href={state.fallback}>메일 앱으로 보내기 →</a></>}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
