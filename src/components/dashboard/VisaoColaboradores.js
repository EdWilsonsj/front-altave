import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function VisaoColaboradores() {
    const [listaColaboradores, setListaColaboradores] = useState([]);
    const [colaboradorSelecionado, setColaboradorSelecionado] = useState(null);
    const [termoBusca, setTermoBusca] = useState('');
    const [carregando, setCarregando] = useState(true);
    const pegaTodaAGalerinha = async () => {
        setCarregando(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador`);
            const data = await response.json();
            setListaColaboradores(data);
        }
        catch (erro) {
            console.error("Falha ao buscar colaboradores:", erro);
            // mostrar um estado de erro na tela no futuro
        }
        finally {
            setCarregando(false);
        }
    };
    useEffect(() => {
        pegaTodaAGalerinha();
    }, []);
    const handleProfileClick = () => {
        if (!colaboradorSelecionado)
            return;
        const profileId = colaboradorSelecionado.email === 'admin@altave.com.br' ? 1 : colaboradorSelecionado.id;
        window.open(`/supervisor/profile/${profileId}`, '_blank');
    };
    // Filtra a lista de colaboradores com base no termo de busca
    const colaboradoresFiltrados = listaColaboradores.filter(c => c.nome.toLowerCase().includes(termoBusca.toLowerCase()));
    return (_jsxs("div", { className: "h-full flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: "Vis\u00E3o de Colaboradores" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: "Pesquise e visualize os perfis dos colaboradores." }), _jsxs("div", { className: "relative mt-6", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Pesquisar por nome...", value: termoBusca, onChange: e => setTermoBusca(e.target.value), className: "w-full max-w-lg pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700" })] })] }), _jsxs("div", { className: "flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 overflow-y-auto", children: [_jsx("h3", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mb-4", children: "Todos os Colaboradores" }), carregando ? (_jsx("p", { children: "Carregando..." })) : (_jsx("ul", { className: "space-y-3", children: colaboradoresFiltrados.map(colab => (_jsxs("li", { onClick: () => setColaboradorSelecionado(colab), className: `p-4 rounded-xl cursor-pointer transition-all ${colaboradorSelecionado?.id === colab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}`, children: [_jsx("p", { className: "font-semibold", children: colab.nome }), _jsx("p", { className: `text-sm ${colaboradorSelecionado?.id === colab.id ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`, children: colab.cargo?.nomeCargo })] }, colab.id))) }))] }), _jsx("div", { className: "lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700", children: colaboradorSelecionado ? (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-6 mb-6", children: [_jsx("div", { className: "w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl", children: colaboradorSelecionado.nome.substring(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("h3", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: colaboradorSelecionado.nome }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300", children: colaboradorSelecionado.cargo?.nomeCargo }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: colaboradorSelecionado.email })] })] }), _jsxs("div", { className: "mt-8 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-lg font-semibold mb-4", children: "A\u00E7\u00F5es" }), _jsxs("button", { className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", onClick: handleProfileClick, children: [_jsx(User, { className: "h-4 w-4" }), "Ver Perfil Completo"] })] })] })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400", children: [_jsx(User, { className: "h-16 w-16 mb-4" }), _jsx("h3", { className: "text-xl font-semibold", children: "Selecione um colaborador" }), _jsx("p", { children: "Clique em um nome na lista para ver os detalhes." })] })) })] })] }));
}
