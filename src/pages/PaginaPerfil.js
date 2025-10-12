"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Mail, Briefcase, Award, Code, Plus, X, Sun, Moon, Edit3, BookOpen, Heart } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function PaginaPerfil() {
    // Hook para obter o ID da URL
    const { id } = useParams();
    // Estados do componente
    const [modoEscuro, setModoEscuro] = useState(false);
    const [colaborador, setColaborador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [novaHardSkill, setNovaHardSkill] = useState("");
    const [novaSoftSkill, setNovaSoftSkill] = useState("");
    const [emEdicao, setEmEdicao] = useState(false);
    const [colaboradorOriginal, setColaboradorOriginal] = useState(null);
    /**
     * Lida com mudanças nos inputs do perfil durante a edição.
     */
    const aoMudarPerfil = (e) => {
        if (!colaborador)
            return;
        const { name, value } = e.target;
        setColaborador({
            ...colaborador,
            [name]: value,
        });
    };
    /**
     * Ativa o modo de edição e salva o estado original do colaborador.
     */
    const aoEditar = () => {
        setColaboradorOriginal(colaborador);
        setEmEdicao(true);
    };
    /**
     * Cancela a edição e restaura o estado original do colaborador.
     */
    const aoCancelar = () => {
        setColaborador(colaboradorOriginal);
        setEmEdicao(false);
    };
    /**
     * Salva as alterações do perfil no backend.
     */
    const aoSalvar = async () => {
        if (!colaborador)
            return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colaborador),
            });
            if (!response.ok) {
                throw new Error('Falha ao salvar o perfil.');
            }
            const colaboradorAtualizado = await response.json();
            setColaborador(colaboradorAtualizado);
            setEmEdicao(false);
            setColaboradorOriginal(null);
        }
        catch (error) {
            console.error(error);
            alert("Erro ao salvar as alterações. Tente novamente.");
        }
    };
    // Efeito para gerenciar o tema escuro
    useEffect(() => {
        const root = document.documentElement;
        if (modoEscuro) {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
    }, [modoEscuro]);
    /**
     * Busca os dados do colaborador na API com base no ID da URL.
     */
    const buscarColaborador = async () => {
        if (!id)
            return;
        setCarregando(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${id}`);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi bem-sucedida.');
            }
            const data = await response.json();
            setColaborador(data);
        }
        catch (error) {
            if (error instanceof Error) {
                setErro(error.message);
            }
            else {
                setErro("Ocorreu um erro desconhecido.");
            }
        }
        finally {
            setCarregando(false);
        }
    };
    // Efeito para buscar os dados do colaborador quando o ID da URL muda
    useEffect(() => {
        buscarColaborador();
    }, [id]);
    /**
     * Adiciona uma nova hard skill para o colaborador.
     */
    const adicionarHardSkill = async () => {
        if (novaHardSkill.trim() && colaborador) {
            const novaSkill = {
                nomeCompetencia: novaHardSkill.trim(),
                colaborador: { id: colaborador.id }
            };
            const response = await fetch(`${API_BASE_URL}/api/hardskill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaSkill),
            });
            if (response.ok) {
                const skillAdicionada = await response.json();
                setColaborador(prev => prev ? { ...prev, hardSkills: [...prev.hardSkills, skillAdicionada] } : null);
                setNovaHardSkill("");
            }
            else {
                console.error("Falha ao adicionar a hard skill.");
            }
        }
    };
    /**
     * Adiciona uma nova soft skill para o colaborador.
     */
    const adicionarSoftSkill = async () => {
        if (novaSoftSkill.trim() && colaborador) {
            const novaSkill = {
                nomeCompetencia: novaSoftSkill.trim(),
                colaborador: { id: colaborador.id }
            };
            const response = await fetch(`${API_BASE_URL}/api/softskill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaSkill),
            });
            if (response.ok) {
                const skillAdicionada = await response.json();
                setColaborador(prev => prev ? { ...prev, softSkills: [...prev.softSkills, skillAdicionada] } : null);
                setNovaSoftSkill("");
            }
            else {
                console.error("Falha ao adicionar a soft skill.");
            }
        }
    };
    /**
     * Remove uma hard skill do colaborador.
     */
    const removerHardSkill = async (skillId) => {
        const response = await fetch(`${API_BASE_URL}/api/hardskill/${skillId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setColaborador(prev => prev ? { ...prev, hardSkills: prev.hardSkills.filter(s => s.id !== skillId) } : null);
        }
        else {
            console.error("Falha ao remover a hard skill.");
        }
    };
    /**
     * Remove uma soft skill do colaborador.
     */
    const removerSoftSkill = async (skillId) => {
        const response = await fetch(`${API_BASE_URL}/api/softskill/${skillId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setColaborador(prev => prev ? { ...prev, softSkills: prev.softSkills.filter(s => s.id !== skillId) } : null);
        }
        else {
            console.error("Falha ao remover a soft skill.");
        }
    };
    /**
     * Lida com o pressionar da tecla Enter para adicionar skills.
     */
    const aoPressionarTecla = (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (type === 'hard')
                adicionarHardSkill();
            if (type === 'soft')
                adicionarSoftSkill();
        }
    };
    // Renderização condicional enquanto os dados estão sendo carregados
    if (carregando) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Carregando..." });
    }
    // Renderização condicional em caso de erro
    if (erro) {
        return _jsxs("div", { className: "min-h-screen flex items-center justify-center", children: ["Erro: ", erro] });
    }
    // Renderização condicional se o colaborador não for encontrado
    if (!colaborador) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Nenhum dado de colaborador encontrado." });
    }
    const { nome, email, cargo, apresentacao, certificacoes, experiencias, hardSkills, softSkills } = colaborador;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4", children: [_jsx("button", { onClick: () => setModoEscuro(v => !v), "aria-label": "Alternar tema", className: "fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg z-10", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) }), _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center gap-8", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl", children: nome.substring(0, 2).toUpperCase() }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: emEdicao ? (_jsx("input", { type: "text", name: "nome", value: nome, onChange: aoMudarPerfil, className: "text-3xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none" })) : (_jsx("h1", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: nome })) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-5 w-5 text-blue-500" }), _jsx("span", { children: cargo?.nomeCargo || 'N/A' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-blue-500" }), _jsx("span", { children: email })] })] })] }), emEdicao ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: aoSalvar, className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Salvar" }), _jsx("button", { onClick: aoCancelar, className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Cancelar" })] })) : (_jsxs("button", { onClick: aoEditar, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: [_jsx(Edit3, { className: "h-4 w-4" }), "Editar Perfil"] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(User, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Sobre mim" })] }), emEdicao ? (_jsx("textarea", { name: "apresentacao", value: apresentacao, onChange: aoMudarPerfil, className: "w-full h-40 p-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm", children: apresentacao }))] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Award, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Certifica\u00E7\u00F5es" })] }), _jsx("div", { className: "space-y-3", children: certificacoes.map((cert) => (_jsxs("div", { className: "p-3 bg-blue-50 dark:bg-gray-700 rounded-xl", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm", children: cert.nomeCertificacao }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: cert.instituicao })] }, cert.id))) })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Code, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Hard Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: hardSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: () => removerHardSkill(skill.id), className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-blue-900 dark:text-blue-100" }) })] }, skill.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Adicionar Hard Skill...", value: novaHardSkill, onChange: (e) => setNovaHardSkill(e.target.value), onKeyPress: (e) => aoPressionarTecla(e, 'hard'), className: "flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm" }), _jsx("button", { onClick: adicionarHardSkill, type: "button", className: "px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg", children: _jsx(Plus, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Heart, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Soft Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: softSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: () => removerSoftSkill(skill.id), className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-green-900 dark:text-green-100" }) })] }, skill.id))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Adicionar Soft Skill...", value: novaSoftSkill, onChange: (e) => setNovaSoftSkill(e.target.value), onKeyPress: (e) => aoPressionarTecla(e, 'soft'), className: "flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm" }), _jsx("button", { onClick: adicionarSoftSkill, type: "button", className: "px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-lg", children: _jsx(Plus, { className: "h-4 w-4" }) })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(BookOpen, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: "Experi\u00EAncia Profissional" })] }), _jsx("div", { className: "space-y-4", children: experiencias.map((exp) => (_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200", children: exp.cargo }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: exp.empresa }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [new Date(exp.dataInicio).toLocaleDateString(), " - ", exp.dataFim ? new Date(exp.dataFim).toLocaleDateString() : 'Presente'] })] }, exp.id))) })] }), _jsx("div", { className: "text-center py-6", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " Altave. Sistema de Gest\u00E3o de Compet\u00EAncias."] }) })] })] }));
}
