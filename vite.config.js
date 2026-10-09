import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

// 칼럼 수 = 네이버 블로그 글 + 브런치 글. 사이트 어디서나 이 한 값만 쓴다 (2026-10-09 대표님 "모든 칼럼 숫자는 동적이고 값은 같아야")
// 매일 발행 반영(import:blog·import:brunch)이 두 목록을 갱신하고 빌드하므로 따라 바뀐다. prerender.mjs 도 같은 두 파일로 계산한다
const columnTotal = JSON.parse(readFileSync('public/posts/index.json', 'utf8')).length
  + (JSON.parse(readFileSync('public/brunch.json', 'utf8')).posts || []).length;

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  define: { __COLUMN_TOTAL__: JSON.stringify(columnTotal) },
});
