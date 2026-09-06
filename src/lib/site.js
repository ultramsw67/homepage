export const profile = {
  name: '문성운',
  brand: '수트와후드',
  brandEn: 'SOOD',
  role: '스타트업 경영 코치',
  email: 'ultramsw67@gmail.com',
  blog: 'https://blog.naver.com/ultramsw67',
  brunch: 'https://brunch.co.kr/@a3b90b2e717a467',
  linkedin: 'https://www.linkedin.com/in/%EC%84%B1%EC%9A%B4-%EB%AC%B8-415976234/',
  site: 'https://sood-page.web.app',
  // Web3Forms 액세스 키 (https://web3forms.com/#start 에서 ultramsw67@gmail.com 으로 발급).
  // 비어 있으면 상담 폼은 메일 앱을 여는 방식으로 동작한다.
  formKey: '',
};

export const services = [
  {
    id: 'strategy',
    number: '01',
    title: '사업모델 · 전략',
    tagline: '아이디어를 사업의 언어로.',
    description: '누구의 어떤 문제를, 어떤 구조로 돈이 되게 풀 것인지부터 정리합니다. 대기업 기획실에서 익힌 가치평가 프레임으로 사업의 뼈대를 세웁니다.',
    outputs: ['비즈니스 모델 진단', '사업 타당성 시뮬레이션', '사업계획서 · IR 스토리'],
  },
  {
    id: 'growth',
    number: '02',
    title: '지표 · PMF',
    tagline: '감이 아니라 숫자로.',
    description: '만들기 전에 검증하고, 지표에서 다음 행동을 찾습니다. MVP 설계부터 리텐션·가격까지 팀이 봐야 할 숫자를 함께 정합니다.',
    outputs: ['MVP · PMF 검증 설계', '핵심 지표 튜닝', '리텐션 · 가격 전략'],
  },
  {
    id: 'funding',
    number: '03',
    title: '투자 · 정부지원',
    tagline: '떨어지는 이유를 먼저 고칩니다.',
    description: 'TIPS, 예비창업패키지, 정책자금, 투자 라운드. 심사위원과 투자자가 실제로 보는 기준에 맞춰 계획서와 피칭을 다시 설계합니다.',
    outputs: ['정부지원사업 준비 · 피드백', '투자 유치 스토리', '피칭 · 심사 대응'],
  },
  {
    id: 'ai',
    number: '04',
    title: 'AI 활용 · 1인 기업',
    tagline: '혼자서도 팀처럼.',
    description: '코딩 없이도 AI에게 초안을 맡기고 사람은 판단에 집중하는 방법. 1인 기업과 초기 팀의 업무 자동화와 콘텐츠 운영을 설계합니다.',
    outputs: ['업무 자동화 워크플로', 'AI 리터러시 코칭', '콘텐츠 · 블로그 운영 전략'],
  },
];

export const experience = [
  { period: '2023 —', org: '수트와후드 (SOOD)', role: '스타트업 경영 코치 · 전략 자문', desc: '1:1 경영 자문, 사업모델·지표 코칭. 네이버 블로그 「Design & Breakthrough」, 브런치, 모비인사이드에 스타트업 경영 칼럼 연재.' },
  { period: '2020 — 2023', org: '(주)오렌지가든', role: 'CSO · 최고전략책임자', desc: '브랜드 제조·수출과 미디어 커머스 사업 총괄.' },
  { period: '2001 — 2019', org: '(주)인터랙티비', role: '창업자 · 대표이사', desc: '디지털 마케팅 회사 창업. 19년간 경영하며 투자 유치와 사업 매각(Exit)까지 직접 완주.' },
  { period: '1993 — 2000', org: '(주)현대석유화학 기획실', role: '기획 · 가치평가', desc: '현대그룹 계열사 기획실에서 M&A, 가치평가(Valuation), 신규 사업 타당성 분석.' },
];

export const cases = [
  { field: '미디어 커머스', result: 'UX 데이터 분석으로 신규 아이템을 발굴하고 매출을 끌어올렸습니다.' },
  { field: '숏폼 플랫폼', result: '투자자 관점으로 사업계획서를 다시 써 벤처기업 인증과 어워드 수상으로 이어졌습니다.' },
  { field: '커뮤니티 플랫폼', result: '유저 활동 데이터를 뜯어보고 리텐션 전략을 세웠습니다.' },
  { field: 'AI 서비스', result: 'AI 기술 트렌드와 비즈니스 모델을 잇는 전략을 자문했습니다.' },
];

export const stats = [
  { value: '30년+', label: '기획실부터 창업, 코칭까지' },
  { value: '19년', label: '창업 · 경영 · 엑시트' },
  { value: '200+', label: '스타트업 경영 칼럼', dynamic: 'posts' },
  { value: '1:1', label: '창업자 맞춤 자문' },
];

export const process = [
  { step: '01', title: '현재 상황 듣기', desc: '정리된 계획서가 없어도 됩니다. 지금 사업과 고민, 기대하는 변화를 먼저 듣습니다.' },
  { step: '02', title: '문제와 범위 정하기', desc: '가장 급한 문제 하나를 고르고, 산출물·일정·비용을 함께 정합니다.' },
  { step: '03', title: '함께 실행하기', desc: '합의한 과제를 진행하고, 지표로 확인하며 다음 행동을 정리합니다.' },
];
