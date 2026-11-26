import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { takeOldAddress } from './lib/analytics'

// 옛 주소 표시(old_host·old_ref)를 React Router 가 주소를 읽기 전에 지운다 — 늦게 지우면 필터·탭을 누를 때 다시 붙는다 (2026-11-26)
takeOldAddress()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
