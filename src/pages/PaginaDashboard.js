import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BarChart2, AlertTriangle, ArrowLeft, Sun, Moon, Award, Code, User as UserIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function PaginaDashboard() {
    const [numColaboradores, setNumColaboradores] = useState(0);
    const [numCompetencias, setNumCompetencias] = useState(0);
    const [numDesatualizados] = useState('N/A');
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'colaboradores'
    const { colaborador } = useAuth();
    const [modoEscuro, setModoEscuro] = useState(() => {
        if (typeof window === 'undefined')
            return false;
        return localStorage.getItem('theme') === 'dark';
    });
    const navigate = useNavigate();
    // dados de skills
    const [hardSkills, setHardSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [loadingKpis, setLoadingKpis] = useState(false);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [topCerts] = useState([]);
    useEffect(() => {
        if (view !== 'dashboard' || !colaborador)
            return;
        setLoadingKpis(true);
        Promise.all([
            fetch(`${API_BASE_URL}/api/colaborador/count`).then(r => r.ok ? r.json() : { total: 0 }),
            fetch(`${API_BASE_URL}/api/competencia`).then(r => r.ok ? r.json() : [])
        ])
            .then(([countResponse, competencias]) => {
            setNumColaboradores(countResponse.total || 0);
            setNumCompetencias(Array.isArray(competencias) ? competencias.length : 0);
        })
            .catch(() => {
            setNumColaboradores(0);
            setNumCompetencias(0);
        })
            .finally(() => setLoadingKpis(false));
    }, [view, colaborador]);
    useEffect(() => {
        try {
            // Proteções para SSR/ambientes sem DOM e APIs
            if (typeof document === 'undefined')
                return;
            const root = document.documentElement;
            if (!root || !root.classList)
                return;
            if (modoEscuro) {
                root.classList.add('dark');
                if (typeof window !== 'undefined' && window.localStorage?.setItem) {
                    window.localStorage.setItem('theme', 'dark');
                }
            }
            else {
                root.classList.remove('dark');
                if (typeof window !== 'undefined' && window.localStorage?.setItem) {
                    window.localStorage.setItem('theme', 'light');
                }
            }
        }
        catch (err) {
            // Em caso de erro, loga e continua renderizando a UI
            console.error('Theme effect error:', err);
        }
    }, [modoEscuro]);
    // carregar listas de skills para gráficos reais
    useEffect(() => {
        if (view !== 'dashboard' || !colaborador)
            return;
        setLoadingSkills(true);
        Promise.all([
            fetch(`${API_BASE_URL}/api/hardskill`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE_URL}/api/softskill`).then(r => r.ok ? r.json() : [])
        ])
            .then(([hard, soft]) => {
            setHardSkills(Array.isArray(hard) ? hard : []);
            setSoftSkills(Array.isArray(soft) ? soft : []);
        })
            .catch(() => {
            setHardSkills([]);
            setSoftSkills([]);
        })
            .finally(() => setLoadingSkills(false));
    }, [view, colaborador]);
    // util: contagem por nome de competência
    const contarPorNome = (items) => {
        const map = new Map();
        for (const it of items) {
            const key = (it.nomeCompetencia || '').trim();
            if (!key)
                continue;
            map.set(key, (map.get(key) || 0) + 1);
        }
        return map;
    };
    const topHard = useMemo(() => {
        const map = contarPorNome(hardSkills);
        return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [hardSkills]);
    const topSoft = useMemo(() => {
        const map = contarPorNome(softSkills);
        return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [softSkills]);
    const maxHardCount = useMemo(() => topHard[0]?.[1] || 1, [topHard]);
    const maxSoftCount = useMemo(() => topSoft[0]?.[1] || 1, [topSoft]);
    // O ProtectedRoute já garante que o usuário é admin e está autenticado
    if (view === 'colaboradores') {
        return (_jsxs("div", { className: "p-8", children: [_jsxs(Button, { onClick: () => setView('dashboard'), className: "mb-4 bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Voltar ao Dashboard"] }), _jsx(VisaoColaboradores, {})] }));
    }
    return (_jsxs("div", { className: "relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8", children: [_jsx("button", { onClick: () => setModoEscuro(v => !v), "aria-label": "Alternar tema", className: "absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) }), _jsx("header", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-gray-800 dark:text-gray-100", children: "Dashboard Executivo" }), _jsx("h2", { className: "text-lg text-gray-600 dark:text-gray-300 mt-2", children: "\uD83D\uDCCA Vis\u00E3o geral de compet\u00EAncias e talentos" })] }), colaborador && (_jsxs(Button, { onClick: () => navigate(`/perfil/${colaborador.id}`), className: "bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(UserIcon, { className: "mr-2 h-4 w-4" }), " Meu Perfil"] }))] }) }), _jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-8", children: [_jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium dark:text-gray-100 mb-4", children: "Colaboradores" }), _jsx(Users, { className: "h-6 w-6 text-purple-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-purple-500", children: loadingKpis ? '—' : numColaboradores }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Total na organiza\u00E7\u00E3o" })] })] }), _jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium dark:text-gray-100 mb-4", children: "Compet\u00EAncias Mapeadas" }), _jsx(BarChart2, { className: "h-6 w-6 text-blue-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-blue-500", children: loadingKpis ? '—' : numCompetencias }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Do cat\u00E1logo corporativo" })] })] }), _jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium dark:text-gray-100 mb-4", children: "Desatualizados" }), _jsx(AlertTriangle, { className: "h-6 w-6 text-yellow-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-purple-500", children: numDesatualizados }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Requer aten\u00E7\u00E3o" })] })] })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2 mb-8", children: [_jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Code, { className: "h-5 w-5 text-blue-500" }), _jsx(CardTitle, { className: "text-base font-semibold dark:text-gray-100", children: "Top 10 Hard Skills" })] }) }), _jsx(CardContent, { children: loadingSkills ? (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Carregando\u2026" })) : topHard.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Sem dados de hard skills." })) : (_jsx("div", { className: "space-y-3", children: topHard.map(([nome, qtd]) => (_jsxs("div", { className: "grid grid-cols-12 items-center gap-2", children: [_jsx("div", { className: "col-span-4 truncate text-xs md:text-sm text-gray-700 dark:text-gray-200", children: nome }), _jsx("div", { className: "col-span-7", children: _jsx("div", { className: "h-3 bg-blue-100 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500 dark:bg-blue-600", style: { width: `${Math.max(8, (qtd / maxHardCount) * 100)}%` } }) }) }), _jsx("div", { className: "col-span-1 text-right text-xs text-gray-600 dark:text-gray-300", children: qtd })] }, nome))) })) })] }), _jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "h-5 w-5 text-green-500" }), _jsx(CardTitle, { className: "text-base font-semibold dark:text-gray-100", children: "Top 10 Soft Skills" })] }) }), _jsx(CardContent, { children: loadingSkills ? (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Carregando\u2026" })) : topSoft.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Sem dados de soft skills." })) : (_jsx("div", { className: "space-y-3", children: topSoft.map(([nome, qtd]) => (_jsxs("div", { className: "grid grid-cols-12 items-center gap-2", children: [_jsx("div", { className: "col-span-4 truncate text-xs md:text-sm text-gray-700 dark:text-gray-200", children: nome }), _jsx("div", { className: "col-span-7", children: _jsx("div", { className: "h-3 bg-green-100 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-green-500 dark:bg-green-600", style: { width: `${Math.max(8, (qtd / maxSoftCount) * 100)}%` } }) }) }), _jsx("div", { className: "col-span-1 text-right text-xs text-gray-600 dark:text-gray-300", children: qtd })] }, nome))) })) })] })] }), _jsxs(Card, { className: "bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl mb-8", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "h-5 w-5 text-purple-500" }), _jsx(CardTitle, { className: "text-base font-semibold dark:text-gray-100", children: "Top 3 Certifica\u00E7\u00F5es" })] }) }), _jsx(CardContent, { children: topCerts.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Sem dados de certifica\u00E7\u00F5es." })) : (_jsx("div", { className: "space-y-3", children: topCerts.map(([nome, qtd]) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-700 dark:text-gray-200", children: nome }), _jsx("span", { className: "px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", children: qtd })] }, nome))) })) })] }), _jsx("footer", { className: "flex justify-start", children: _jsx(Button, { onClick: () => setView('colaboradores'), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "\uD83D\uDD0D Buscar Talentos" }) })] }));
}
