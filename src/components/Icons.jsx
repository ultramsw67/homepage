// 인라인 선 아이콘. 이모지 대신 쓴다.
const base = { className: 'ico', viewBox: '0 0 24 24', 'aria-hidden': 'true' };

export const Arrow = () => (<svg {...base}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>);
export const ArrowOut = () => (<svg {...base}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>);
export const Down = () => (<svg {...base}><path d="M12 5v14" /><path d="M6 13l6 6 6-6" /></svg>);
export const Blog = () => (<svg {...base}><path d="M4 5h16v14H4z" /><path d="M9 15V9l6 6V9" /></svg>);
export const Book = () => (<svg {...base}><path d="M5 4h9l5 5v11H5z" /><path d="M14 4v5h5" /></svg>);
export const Linked = () => (<svg {...base}><path d="M4 9v11" /><path d="M4 5v.5" /><path d="M10 20V9" /><path d="M10 13a4 4 0 0 1 8 0v7" /></svg>);
export const Mail = () => (<svg {...base}><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></svg>);
