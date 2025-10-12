import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BarChart2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompetenciasChart from '../components/dashboard/CompetenciasChart';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';
export default function PaginaDashboard() {
    const [numColaboradores, setNumColaboradores] = useState(0);
    const [numCompetencias, setNumCompetencias] = useState(0);
    const [numDesatualizados, _setNumDesatualizados] = useState('N/A');
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'colaboradores'
    const [colaborador, setColaborador] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedColaborador = localStorage.getItem('colaborador');
        if (storedColaborador) {
            const parsedColaborador = JSON.parse(storedColaborador);
            if (parsedColaborador.perfil >= 1) {
                setColaborador(parsedColaborador);
                setLoading(false);
            }
            else {
                navigate('/login');
            }
        }
        else {
            navigate('/login');
        }
    }, [navigate]);
    useEffect(() => {
        if (view === 'dashboard' && colaborador) {
            // Fetch collaborators
            fetch('/api/colaborador')
                .then(response => response.json())
                .then(data => {
                setNumColaboradores(data.length);
                // TODO: Implementar a lógica de desatualizados
            })
                .catch(error => console.error('Error fetching collaborators:', error));
            // Fetch competencies
            fetch('/api/competencia')
                .then(response => response.json())
                .then(data => setNumCompetencias(data.length))
                .catch(error => console.error('Error fetching competencies:', error));
        }
    }, [view, colaborador]);
    if (loading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Verificando acesso..." });
    }
    if (view === 'colaboradores') {
        return (_jsxs("div", { className: "p-8", children: [_jsxs(Button, { onClick: () => setView('dashboard'), className: "mb-4 bg-gray-600 hover:bg-gray-700 text-white", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Voltar ao Dashboard"] }), _jsx(VisaoColaboradores, {})] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-white p-8", children: [_jsxs("header", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-800", children: "Dashboard Executivo" }), _jsx("h2", { className: "text-2xl text-center text-gray-600 mt-4", children: "\uD83D\uDCCA Painel de Gest\u00E3o de Talentos" })] }), _jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-8", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Colaboradores" }), _jsx(Users, { className: "h-6 w-6 text-purple-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-purple-500", children: numColaboradores }), _jsx("p", { className: "text-xs text-gray-500", children: "+10 esse m\u00EAs" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Compet\u00EAncias" }), _jsx(BarChart2, { className: "h-6 w-6 text-purple-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-purple-500", children: numCompetencias }), _jsx("p", { className: "text-xs text-gray-500", children: "Mapeadas" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Desatualizados" }), _jsx(AlertTriangle, { className: "h-6 w-6 text-yellow-500" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-4xl font-bold text-purple-500", children: numDesatualizados }), _jsx("p", { className: "text-xs text-gray-500", children: "Requer aten\u00E7\u00E3o" })] })] })] }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 mb-4", children: "\uD83D\uDCC8 Gr\u00E1fico Interativo: Top 10 Compet\u00EAncias por Equipe" }), _jsx(CompetenciasChart, {})] }), _jsxs("footer", { className: "flex justify-between", children: [_jsx(Button, { onClick: () => setView('colaboradores'), className: "bg-blue-600 hover:bg-blue-700 text-white", children: "\uD83D\uDD0D Buscar Talentos" }), _jsx(Button, { variant: "outline", className: "text-gray-600", children: "\uD83D\uDCC4 Relat\u00F3rios Avan\u00E7ados" })] })] }));
}
