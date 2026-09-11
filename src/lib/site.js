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
  formKey: '05e6dd01-e063-4d56-9099-87fc2f9f7edf',
};

export const services = [
  {
    id: 'strategy',
    number: '01',
    title: '사업모델 · 전략',
    tagline: '아이디어를 사업의 언어로.',
    description: '누구의 어떤 문제를, 어떤 구조로 돈이 되게 풀 것인지부터 정리합니다. 대기업 기획실에서 익힌 가치평가 프레임으로 사업의 뼈대를 세웁니다.',
    outputs: ['비즈니스 모델 진단', '사업 타당성 시뮬레이션', '유닛 이코노믹스 · 13주 현금흐름', '런웨이 · 매각(Exit) 준비'],
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
    description: '2026년 창업 지원 예산은 역대 최대지만, 창업자 대부분은 어떤 사업이 우리 회사에 맞는지 모릅니다. 예비창업패키지, 프리팁스·TIPS, 정책자금, 공공조달 첫 고객까지 우리 회사에 맞는 지원사업 지도를 1장으로 만들고, 심사위원과 투자자가 실제로 보는 기준으로 계획서와 피칭을 다시 씁니다. 1차 탈락 피드백으로 2차에 붙는 것까지가 범위입니다.',
    outputs: ['우리 회사 지원사업 지도 1장', '계획서 리라이팅 · 탈락 피드백 대응', '투자 유치 스토리 · 피칭 리허설'],
  },
  {
    id: 'ai',
    number: '04',
    title: 'AI 에이전트 · 1인 기업',
    tagline: '혼자서도 팀처럼.',
    description: '코딩 없이 AI 에이전트로 시장을 검증하고, 반복 업무를 자동화하고, 콘텐츠를 운영하는 1인 기업의 운영 체계를 설계합니다. 제가 매일 쓰는 리서치·초안·분석 워크플로를 그대로 보여드립니다.',
    outputs: ['1인 기업 AI 운영 체계', '시장 검증 · 데이터 분석 자동화', '실전 워크숍 (반나절)'],
  },
  {
    id: 'lecture',
    number: '05',
    title: '강연 · 교육',
    tagline: '숫자로 증명하는 창업.',
    description: '기관·대학·창업지원센터를 위한 강연과 교육 과정입니다. 검증 사슬(문제 → 솔루션 → MVP → PMF)과 3개의 계기판(유닛 이코노믹스 · 13주 현금흐름 · 피벗 지표)을 워크시트로 익힙니다. 60분 강연부터 3시간 교육, 6주 코호트까지 대상에 맞춰 구성합니다.',
    outputs: ['시그니처 강연 「숫자로 증명하는 창업」 60~90분', '기관 교육 3시간 · 워크시트', '대표 코호트 6주 과정'],
  },
];

export const experience = [
  { period: '2025 —', org: '수트와후드 (SOOD)', role: '스타트업 경영 컨설턴트', desc: '초기 창업자 1:1 자문과 멘토링. 비즈니스 모델·사업계획서·MVP/PMF 검증 전략 자문, 네이버 블로그·브런치·모비인사이드 칼럼 연재.' },
  { period: '2023 — 2025', org: '(주)더문테크', role: '전략 고문', desc: '25만 유저 서비스의 유저 세그멘테이션과 리텐션 관리, AI 에이전트 도입 모델 수립, 신규 사업 타당성 시뮬레이션.' },
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
  { value: '1회', label: '19년 경영 후 사업 매각(Exit)' },
  { value: '20건', label: '스타트업 1:1 자문 실적' },
  { value: '200+', label: '스타트업 경영 칼럼', dynamic: 'posts' },
];

export const process = [
  { step: '01', title: '현재 상황 듣기', desc: '정리된 계획서가 없어도 됩니다. 지금 사업과 고민, 기대하는 변화를 먼저 듣습니다.' },
  { step: '02', title: '문제와 범위 정하기', desc: '가장 급한 문제 하나를 고르고, 산출물·일정·비용을 함께 정합니다.' },
  { step: '03', title: '함께 실행하기', desc: '합의한 과제를 진행하고, 지표로 확인하며 다음 행동을 정리합니다.' },
];
