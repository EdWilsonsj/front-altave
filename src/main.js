import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Função global para debug - limpar sessão
window.limparSessaoAltave = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('colaborador');
    localStorage.clear();
    console.log('✅ Sessão limpa! Recarregando página...');
    window.location.reload();
};
// Função para testar codificação da API
window.testarCodificacaoAPI = async (colaboradorId = 2) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';
    try {
        const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaboradorId}`);
        const data = await response.json();
        console.log('🔍 Teste de codificação da API:');
        console.log('Raw response:', data);
        console.log('Soft Skills:', data.softSkills?.map((s) => ({
            id: s.id,
            nome: s.nomeCompetencia,
            bytes: Array.from(new TextEncoder().encode(s.nomeCompetencia))
        })));
    }
    catch (error) {
        console.error('Erro ao testar API:', error);
    }
};
console.log('🔧 Para limpar a sessão: limparSessaoAltave()');
console.log('🔍 Para testar codificação da API: testarCodificacaoAPI(2)');
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
