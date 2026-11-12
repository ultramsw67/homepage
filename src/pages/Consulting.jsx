import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { services, profile, process, faq, offers } from '../lib/site';
import { trackLead } from '../lib/analytics';
import { Arrow } from '../components/Icons';
import { Link } from 'react-router-dom';
import CaseBlock from '../components/CaseBlock';

const ENDPOINT = 'https://api.web3forms.com/submit';
// 서식 '원하시는 상품' 목록: 상품 네 단 + 사례 모집 (2026-11-12, 지시서 v3 2단계)
const PRODUCTS = [...offers.map((o) => o.name), '사례 모집'];
const STAGES = ['아이디어', '준비 중', '출시·매출 발생'];

function mailtoLink(data) {
  const body = `원하시는 상품: ${data.product}\n성함: ${data.name}\n회사·팀: ${data.company || '-'}\n회신 이메일: ${data.email}\n사업 단계: ${data.stage}\n상담 분야: ${data.service}\n\n현재 상황과 고민:\n${data.message}`;
  const subject = `[SOOD 상담] ${data.product} · ${data.name}`;
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
    for (const key of ['product', 'name', 'email', 'message']) {
      if (prefill[key] && form.elements[key] && !form.elements[key].value) form.elements[key].value = prefill[key];
    }
    // 칼럼 아래 '자문 문의'에서 온 분야 (선택 칸은 늘 값이 있어 따로 넣는다)
    if (prefill.service && [...form.elements.service.options].some((o) => o.value === prefill.service)) form.elements.service.value = prefill.service;
    const next = ['name', 'email', 'message'].find((k) => !form.elements[k].value);
    const t = setTimeout(() => form.elements[next || 'message']?.focus({ preventScroll: true }), 400);
    return () => clearTimeout(t);
  }, [prefill]);

  // 상품 칸 단추를 누르면 서식의 '원하시는 상품'이 미리 골라진다
  function pickProduct(name) {
    const sel = formRef.current?.elements.product;
    if (sel) sel.value = name;
  }

  async function contact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const data = { product: fd.get('product'), name: fd.get('name'), company: fd.get('company'), email: fd.get('email'), stage: fd.get('stage'), service: fd.get('service'), message: fd.get('message') };
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
          subject: `[SOOD 상담] ${data.product} · ${data.name}`,
          from_name: 'SOOD 홈페이지 상담 폼',
          product: data.product,
          name: data.name,
          company: data.company || '-',
          email: data.email,
          replyto: data.email,
          stage: data.stage,
          service: data.service,
          message: data.message,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        form.reset();
        trackLead();
        setState({ phase: 'sent', text: '접수됐습니다. 보통 1~2일 안에 회신 이메일로 답장드립니다.' });
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
          <p className="lead">창업 3년 이내 대표, 1인 창업자와 일합니다. 정부지원사업이나 첫 투자 심사를 앞두고 숫자로 증명해야 한다면 특히 잘 맞습니다. 자주 받는 질문은 아래에 먼저 답해 두었습니다.</p>
          <div className="actions">
            <a className="button primary" href="#contact" onClick={() => pickProduct(offers[0].name)}>초기 상담 30분 신청<Arrow /></a>
            <a className="button ghost" href="#offer-single">1회 자문 보수 보기</a>
          </div>
        </header>

        {/* 사례·후기: 제목과 상품 칸 사이 (지시서 v3 3단계) */}
        <section className="section" id="cases">
          <CaseBlock onRecruit={() => pickProduct('사례 모집')} />
        </section>

        <section className="section" id="offers">
          <div className="section-head">
            <h2>자문 상품과 보수</h2>
          </div>
          <div className="offer-grid">
            {offers.map((o) => (
              <article id={o.id} key={o.id} className="offer-card">
                <h3>{o.name}</h3>
                <p className="offer-price">{o.price}{o.priceNote && <span> · {o.priceNote}</span>}</p>
                <p className="offer-desc">{o.desc}</p>
                <ul>{o.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                <a className="button ghost block" href="#contact" onClick={() => pickProduct(o.name)}>{o.cta}<Arrow /></a>
              </article>
            ))}
          </div>
          <p className="small offer-flow">초기 상담 → 1회 자문 → 4주 자문 순서로 이어 가실 수 있습니다. 어느 단계에서 멈추셔도 됩니다.</p>
        </section>

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
              <h3>초기 상담 30분 · 보수 없음</h3>
              <p>지금 하시는 일과 어려운 점을 듣고 자문으로 이어 갈 일인지 함께 확인합니다. 자문을 하실지는 상담을 마친 뒤 정하시면 됩니다. 자문을 시작하면 첫 시간에 ‘다음 한 수’ 한 장을 드립니다. 먼저 풀 문제 하나와 그다음 할 일을 종이 한 장에 정리한 것입니다.</p>
            </div>
            <div className="offer-side">
              <a className="button primary block" href="#contact" onClick={() => pickProduct(offers[0].name)}>초기 상담 30분 신청<Arrow /></a>
              <p className="small">초기 상담은 보수를 받지 않습니다. 자문 보수는 위 상품 안내에 있습니다.</p>
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
            <p className="lead">계획서가 없어도 됩니다. 지금 상황을 적어 주시면 1~2일 안에 답장드립니다.</p>
            {/* 2026-10-09: 빈 칸 앞에서 막힌 사람에게 진단 먼저 — 결과가 '현재 상황과 고민' 칸에 채워져 돌아온다 */}
            <Link className="contact-check" to="/check">
              <b>무엇부터 적을지 모르겠다면</b>
              <span>3분 진단을 먼저 해 보세요. 결과가 오른쪽 ‘현재 상황과 고민’ 칸에 저절로 들어갑니다.</span>
              <em>3분 진단 <Arrow /></em>
            </Link>
            <div className="contact-mail">
              <p className="k">이메일</p>
              <a className="contact-email" href={'mailto:' + profile.email}>{profile.email}</a>
              <p>보통 1~2일 안에 답장드립니다.</p>
            </div>
          </div>
          <form className="form-card" onSubmit={contact} ref={formRef}>
            <h3>상담 요청</h3>
            <div className="field">
              <label htmlFor="product">원하시는 상품</label>
              <select id="product" name="product" required defaultValue="">
                <option value="" disabled>골라 주십시오</option>
                {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">성함</label>
                <input id="name" name="name" autoComplete="name" required maxLength="100" placeholder="홍길동" />
              </div>
              <div className="field">
                <label htmlFor="company">회사·팀 이름 <span className="optional">(선택)</span></label>
                <input id="company" name="company" autoComplete="organization" maxLength="100" placeholder="없으면 비워 두셔도 됩니다" />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="email">회신받을 이메일</label>
                <input id="email" name="email" type="email" autoComplete="email" required maxLength="200" placeholder="hello@yourcompany.com" />
              </div>
              <div className="field">
                <label htmlFor="stage">회사·사업 단계</label>
                <select id="stage" name="stage" required defaultValue="">
                  <option value="" disabled>골라 주십시오</option>
                  {STAGES.map((st) => <option key={st}>{st}</option>)}
                </select>
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
              <textarea id="message" name="message" required rows="5" maxLength="3000" placeholder="한 줄이어도 됩니다. 어떤 사업을 하시는지, 가장 어려운 점이 무엇인지 적어 주십시오." />
            </div>
            <input type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" className="honeypot" aria-hidden="true" />
            <button className="button primary block" type="submit" disabled={state.phase === 'sending'}>
              {profile.formKey ? (state.phase === 'sending' ? '보내는 중…' : '상담 요청 보내기') : '상담 메일 작성하기'}
              <Arrow />
            </button>
            <p className="small">{profile.formKey ? '보내기를 누르면 수드에게 바로 전달됩니다. 입력한 이메일로 답장드립니다.' : '입력 내용으로 메일 앱이 열립니다. 사이트는 내용을 저장하지 않습니다.'}</p>
            <p className="small">적어 주신 이메일과 내용은 회신에만 씁니다.</p>
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
