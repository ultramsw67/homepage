import { useState } from 'react';
import { services, profile, process } from '../lib/site';

const ENDPOINT = 'https://api.web3forms.com/submit';

function mailtoLink(data) {
  const body = `이름 / 팀: ${data.name}\n회신 이메일: ${data.email}\n상담 분야: ${data.service}\n\n현재 상황과 고민:\n${data.message}`;
  const subject = `[SOOD 상담] ${data.service} · ${data.name}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Consulting() {
  const [state, setState] = useState({ phase: 'idle', text: '' });

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
        setState({ phase: 'sent', text: '접수됐습니다. 보통 2~3일 안에 회신 이메일로 답장드립니다.' });
      } else {
        throw new Error(json.message || res.statusText);
      }
    } catch {
      setState({ phase: 'error', text: `전송에 실패했습니다. 아래 버튼으로 메일 앱을 열거나 ${profile.email} 로 직접 보내주세요.`, fallback: mailtoLink(data) });
    }
  }

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">상담</p>
        <h1>막연한 고민을,<br /><em>구체적인 다음 단계로.</em></h1>
        <p className="lead">사업의 현재를 함께 짚고, 지금 필요한 실행을 설계합니다. 초기 스타트업 대표, 예비창업자, 1인 기업가와 일합니다.</p>
      </header>

      <section className="section">
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

      <section className="section">
        <p className="eyebrow">진행 방식</p>
        <h2>대화에서 시작해 실행까지.</h2>
        <div className="process-grid">
          {process.map((p) => (
            <div key={p.step}><span>{p.step}</span><h3>{p.title}</h3><p>{p.desc}</p></div>
          ))}
        </div>
        <p className="muted small">일정과 비용은 상담 범위에 따라 협의합니다.</p>
      </section>

      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">문의</p>
          <h2>지금, 어떤 문제를<br />풀고 계신가요?</h2>
          <p>정리된 계획서가 없어도 괜찮습니다. 현재 상황과 고민부터 들려주세요. 보통 2~3일 안에 답장드립니다.</p>
          <a className="contact-email" href={'mailto:' + profile.email}>{profile.email}</a>
        </div>
        <form onSubmit={contact}>
          <label htmlFor="name">이름 / 팀 또는 회사</label>
          <input id="name" name="name" autoComplete="organization" required maxLength="100" placeholder="홍길동 / 팀 이름" />
          <label htmlFor="email">회신받을 이메일</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength="200" placeholder="hello@yourcompany.com" />
          <label htmlFor="service">함께 이야기할 분야</label>
          <select id="service" name="service">
            {services.map((s) => <option key={s.id}>{s.title}</option>)}
            <option>강의 · 콘텐츠 협업 · 기타</option>
          </select>
          <label htmlFor="message">현재 상황과 고민</label>
          <textarea id="message" name="message" required rows="5" maxLength="3000" placeholder="어떤 사업을 하고 계신가요? 가장 고민되는 점을 알려주세요." />
          <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="honeypot" aria-hidden="true" />
          <p className="muted small">{profile.formKey ? `보내기를 누르면 ${profile.email} 로 바로 전달됩니다. 입력한 이메일로 답장드립니다.` : '입력 내용으로 메일 앱이 열립니다. 사이트는 내용을 저장하지 않습니다.'}</p>
          <button className="button primary" type="submit" disabled={state.phase === 'sending'}>
            {profile.formKey ? (state.phase === 'sending' ? '보내는 중…' : '상담 요청 보내기') : '상담 메일 작성하기'}
          </button>
          <p role="status" className="form-status">
            {state.text}
            {state.phase === 'error' && state.fallback && <> <a href={state.fallback}>메일 앱으로 보내기 →</a></>}
          </p>
        </form>
      </section>
    </div>
  );
}
