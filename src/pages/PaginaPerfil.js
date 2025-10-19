"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Briefcase, Award, Code, Plus, X, Sun, Moon, Edit3, Heart, Camera, LogOut, FolderOpen, Calendar, Building } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function PaginaPerfil() {
    // Hooks para obter o ID da URL e navegação
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const fileInputRef = useRef(null);
    // Estados do componente
    const [modoEscuro, setModoEscuro] = useState(false);
    const [colaborador, setColaborador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [novaHardSkill, setNovaHardSkill] = useState("");
    const [novaSoftSkill, setNovaSoftSkill] = useState("");
    const [emEdicao, setEmEdicao] = useState(false);
    const [colaboradorOriginal, setColaboradorOriginal] = useState(null);
    // Estados para controle de acesso e comentários
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    // Obter dados de autenticação (DEVE ser no nível superior do componente)
    const { isAdmin: adminStatus, colaborador: colaboradorAuth } = useAuth();
    // Estados para experiências
    const [novaExperiencia, setNovaExperiencia] = useState({
        cargo: '',
        empresa: '',
        dataInicio: '',
        dataFim: ''
    });
    // Estados para projetos
    const [novoProjeto, setNovoProjeto] = useState({
        nomeProjeto: '',
        descricao: '',
        tecnologias: '',
        dataInicio: '',
        dataFim: '',
        link: ''
    });
    // Estados para comentários
    const [comentarios, setComentarios] = useState([]);
    const [carregandoComentarios, setCarregandoComentarios] = useState(true);
    const [novoComentario, setNovoComentario] = useState('');
    /**
     * Lida com o logout do usuário.
     */
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    /**
     * Lida com o upload da foto de perfil.
     */
    const handleFotoUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !colaborador)
            return;
        // Validação do arquivo
        if (file.size > 5 * 1024 * 1024) {
            alert('A foto deve ter no máximo 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem');
            return;
        }
        const formData = new FormData();
        formData.append('foto', file);
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}/foto`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                setColaborador(prev => prev ? { ...prev, fotoUrl: data.fotoUrl } : null);
            }
            else {
                alert('Erro ao fazer upload da foto');
            }
        }
        catch (error) {
            console.error('Erro no upload:', error);
            alert('Erro ao fazer upload da foto');
        }
    };
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
            // Aplicar correção de codificação nos dados atualizados também
            if (colaboradorAtualizado.softSkills) {
                colaboradorAtualizado.softSkills = colaboradorAtualizado.softSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
            }
            if (colaboradorAtualizado.hardSkills) {
                colaboradorAtualizado.hardSkills = colaboradorAtualizado.hardSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
            }
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
            // Buscar dados do colaborador
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${id}`);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi bem-sucedida.');
            }
            const data = await response.json();
            // Buscar experiências do colaborador
            try {
                const expResponse = await fetch(`${API_BASE_URL}/api/experiencia`);
                if (expResponse.ok) {
                    const todasExperiencias = await expResponse.json();
                    const colaboradorId = parseInt(id);
                    // Filtrar experiências do colaborador atual
                    data.experiencias = todasExperiencias.filter((exp) => {
                        return exp.colaborador?.id === colaboradorId;
                    });
                    console.log(`📋 Carregadas ${data.experiencias.length} experiências para colaborador ${colaboradorId}`);
                }
                else {
                    console.error('Erro ao buscar experiências:', expResponse.status);
                    data.experiencias = [];
                }
            }
            catch (error) {
                console.error('Erro ao buscar experiências:', error);
                data.experiencias = [];
            }
            // Corrigir codificação nas soft skills e hard skills
            if (data.softSkills) {
                data.softSkills = data.softSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
            }
            if (data.hardSkills) {
                data.hardSkills = data.hardSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
            }
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
        carregarComentarios();
    }, [id]);
    /**
     * Carrega os comentários do colaborador
     */
    const carregarComentarios = async () => {
        if (!id)
            return;
        setCarregandoComentarios(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/comentario/colaborador/${id}`);
            if (response.ok) {
                const data = await response.json();
                // Buscar nomes dos colaboradores de origem
                const comentariosComNomes = await Promise.all(data.map(async (comentario) => {
                    try {
                        const colaboradorResponse = await fetch(`${API_BASE_URL}/api/colaborador/${comentario.idColaboradorOrigem}`);
                        if (colaboradorResponse.ok) {
                            const colaboradorOrigem = await colaboradorResponse.json();
                            return { ...comentario, nomeColaboradorOrigem: colaboradorOrigem.nome };
                        }
                    }
                    catch (error) {
                        console.error('Erro ao buscar colaborador:', error);
                    }
                    return { ...comentario, nomeColaboradorOrigem: 'Desconhecido' };
                }));
                setComentarios(comentariosComNomes);
            }
        }
        catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
        finally {
            setCarregandoComentarios(false);
        }
    };
    /**
     * Adiciona um novo comentário
     */
    const adicionarComentario = async () => {
        if (!novoComentario.trim() || !currentUserId || !colaborador)
            return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/comentario/criar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idColaboradorOrigem: currentUserId,
                    idColaboradorDestino: colaborador.id,
                    textoComentario: novoComentario.trim(),
                }),
            });
            if (response.ok) {
                setNovoComentario('');
                carregarComentarios(); // Recarregar comentários
                alert('Comentário adicionado com sucesso!');
            }
            else {
                alert('Erro ao adicionar comentário.');
            }
        }
        catch (error) {
            console.error('Erro ao criar comentário:', error);
            alert('Erro ao adicionar comentário.');
        }
    };
    // Efeito para atualizar estados locais quando dados de auth mudarem
    useEffect(() => {
        setIsAdmin(adminStatus);
        setCurrentUserId(colaboradorAuth?.id || null);
    }, [adminStatus, colaboradorAuth]);
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
                // Corrigir codificação da skill recém-adicionada
                skillAdicionada.nomeCompetencia = corrigirTexto(skillAdicionada.nomeCompetencia);
                setColaborador(prev => prev ? { ...prev, hardSkills: [...prev.hardSkills, skillAdicionada] } : null);
                setNovaHardSkill("");
            }
            else {
                console.error("Falha ao adicionar a hard skill.");
            }
        }
    };
    /**
     * Formata data para exibição
     */
    const formatarData = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    /**
     * Corrige problemas de codificação UTF-8 - Versão simples
     */
    const corrigirTexto = (texto) => {
        if (!texto)
            return texto;
        // Correções simples e seguras
        return texto
            .replace('Resili??ncia', 'Resiliência')
            .replace('Gest??o do tempo', 'Gestão do tempo')
            .replace('Gest??o', 'Gestão')
            .replace('Resolu????o de problemas', 'Resolução de problemas')
            .replace('Resolu????o', 'Resolução')
            .replace('Lideran??a', 'Liderança')
            .replace('Orienta????o para resultados', 'Orientação para resultados')
            .replace('Orienta????o', 'Orientação')
            .replace('Inova????o', 'Inovação')
            .replace(/\?{2,}/g, (match) => {
            // Para casos genéricos de múltiplos ?, tentar mapear para caracteres comuns
            if (match.length === 2)
                return 'ã';
            if (match.length === 3)
                return 'ção';
            if (match.length === 4)
                return 'ção';
            return match; // Retorna original se não souber como corrigir
        });
    };
    /**
     * Adiciona uma nova hard skill para o colaborador.
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
                // Corrigir codificação da skill recém-adicionada
                skillAdicionada.nomeCompetencia = corrigirTexto(skillAdicionada.nomeCompetencia);
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
    /**
     * Adiciona uma nova experiência.
     */
    const adicionarExperiencia = async () => {
        if (!colaborador || !novaExperiencia.cargo || !novaExperiencia.empresa)
            return;
        try {
            // Estrutura garantindo associação com o colaborador
            const experienciaData = {
                cargo: novaExperiencia.cargo.trim(),
                empresa: novaExperiencia.empresa.trim(),
                dataInicio: novaExperiencia.dataInicio,
                dataFim: novaExperiencia.dataFim,
                colaborador: { id: colaborador.id }
            };
            console.log('📝 Salvando experiência:', experienciaData);
            const response = await fetch(`${API_BASE_URL}/api/experiencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienciaData),
            });
            if (response.ok) {
                const expAdicionada = await response.json();
                console.log('✅ Experiência criada:', expAdicionada);
                // Limpar o formulário
                setNovaExperiencia({ cargo: '', empresa: '', dataInicio: '', dataFim: '' });
                // Recarregar experiências do servidor para garantir consistência
                await recarregarExperiencias();
                alert('Experiência adicionada com sucesso!');
            }
            else {
                const errorText = await response.text();
                console.error('Erro na resposta:', response.status, errorText);
                alert('Erro ao adicionar experiência.');
            }
        }
        catch (error) {
            console.error('Erro ao adicionar experiência:', error);
            alert('Erro ao adicionar experiência.');
        }
    };
    /**
     * Recarrega as experiências do colaborador atual
     */
    const recarregarExperiencias = async () => {
        if (!id || !colaborador)
            return;
        try {
            const expResponse = await fetch(`${API_BASE_URL}/api/experiencia`);
            if (expResponse.ok) {
                const todasExperiencias = await expResponse.json();
                const colaboradorId = parseInt(id);
                const experienciasDoColaborador = todasExperiencias.filter((exp) => {
                    return exp.colaborador?.id === colaboradorId;
                });
                console.log(`🔄 Recarregadas ${experienciasDoColaborador.length} experiências`);
                setColaborador(prev => prev ? {
                    ...prev,
                    experiencias: experienciasDoColaborador
                } : null);
            }
        }
        catch (error) {
            console.error('Erro ao recarregar experiências:', error);
        }
    };
    /**
     * Remove uma experiência.
     */
    const removerExperiencia = async (expId) => {
        try {
            // Remover da lista local imediatamente para feedback instantâneo
            setColaborador(prev => prev ? {
                ...prev,
                experiencias: prev.experiencias.filter(exp => exp.id !== expId)
            } : null);
            // Depois fazer a requisição para remover do servidor
            const response = await fetch(`${API_BASE_URL}/api/experiencia/${expId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log('✅ Experiência removida:', expId);
            }
            else {
                // Se falhar, recarregar para restaurar o estado correto
                console.error('Erro ao remover do servidor, recarregando...');
                await recarregarExperiencias();
            }
        }
        catch (error) {
            console.error('Erro ao remover experiência:', error);
            // Se der erro, recarregar para restaurar o estado correto
            await recarregarExperiencias();
        }
    };
    /**
     * Adiciona um novo projeto.
     */
    const adicionarProjeto = async () => {
        if (!colaborador || !novoProjeto.nomeProjeto)
            return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/projeto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...novoProjeto, colaborador: { id: colaborador.id } }),
            });
            if (response.ok) {
                const projetoAdicionado = await response.json();
                setColaborador(prev => prev ? {
                    ...prev,
                    projetos: prev.projetos ? [...prev.projetos, projetoAdicionado] : [projetoAdicionado]
                } : null);
                setNovoProjeto({ nomeProjeto: '', descricao: '', tecnologias: '', dataInicio: '', dataFim: '', link: '' });
            }
        }
        catch (error) {
            console.error('Erro ao adicionar projeto:', error);
        }
    };
    /**
     * Remove um projeto.
     */
    const removerProjeto = async (projetoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projeto/${projetoId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setColaborador(prev => prev ? {
                    ...prev,
                    projetos: prev.projetos ? prev.projetos.filter(proj => proj.id !== projetoId) : []
                } : null);
            }
        }
        catch (error) {
            console.error('Erro ao remover projeto:', error);
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
    const { nome, email, cargo, apresentacao, certificacoes, experiencias, projetos = [], hardSkills, softSkills } = colaborador;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4", children: [_jsxs("div", { className: "fixed top-4 right-4 flex gap-2 z-10", children: [_jsx("button", { onClick: handleLogout, "aria-label": "Sair", className: "p-2 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-105 transition-all shadow-lg", children: _jsx(LogOut, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => setModoEscuro(v => !v), "aria-label": "Alternar tema", className: "p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) })] }), _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center gap-8", children: [_jsxs("div", { className: "flex-shrink-0 relative", children: [_jsx("div", { className: "w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-700", children: colaborador.fotoUrl ? (_jsx("img", { src: colaborador.fotoUrl, alt: nome, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold", children: nome.substring(0, 2).toUpperCase() })) }), _jsx("button", { onClick: () => fileInputRef.current?.click(), className: "absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors", title: "Alterar foto", children: _jsx(Camera, { className: "h-4 w-4" }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFotoUpload, className: "hidden" })] }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: emEdicao ? (_jsx("input", { type: "text", name: "nome", value: nome, onChange: aoMudarPerfil, className: "text-3xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none" })) : (_jsx("h1", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: nome })) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-5 w-5 text-blue-500" }), _jsx("span", { children: cargo?.nomeCargo || 'N/A' })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-blue-500" }), _jsx("span", { children: email })] })] })] }), emEdicao ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: aoSalvar, className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Salvar" }), _jsx("button", { onClick: aoCancelar, className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Cancelar" })] })) : (_jsxs("button", { onClick: aoEditar, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: [_jsx(Edit3, { className: "h-4 w-4" }), "Editar Perfil"] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(User, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Sobre mim" })] }), emEdicao ? (_jsx("textarea", { name: "apresentacao", value: apresentacao, onChange: aoMudarPerfil, maxLength: 2000, className: "w-full min-h-48 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm resize-vertical" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line", children: apresentacao }))] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Code, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Hard Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: hardSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: () => removerHardSkill(skill.id), className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-blue-900 dark:text-blue-100" }) })] }, skill.id))) }), _jsx("div", { className: "flex justify-center mt-auto", children: _jsxs("div", { className: "flex gap-2 w-full max-w-sm", children: [_jsx("input", { type: "text", placeholder: "Adicionar Hard Skill...", value: novaHardSkill, onChange: (e) => setNovaHardSkill(e.target.value), onKeyDown: (e) => aoPressionarTecla(e, 'hard'), className: "flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm" }), _jsx("button", { onClick: adicionarHardSkill, type: "button", className: "px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg flex items-center justify-center", children: _jsx(Plus, { className: "h-4 w-4" }) })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Heart, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Soft Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: softSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: () => removerSoftSkill(skill.id), className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-green-900 dark:text-green-100" }) })] }, skill.id))) }), _jsx("div", { className: "flex justify-center mt-auto", children: _jsxs("div", { className: "flex gap-2 w-full max-w-sm", children: [_jsx("input", { type: "text", placeholder: "Adicionar Soft Skill...", value: novaSoftSkill, onChange: (e) => setNovaSoftSkill(e.target.value), onKeyDown: (e) => aoPressionarTecla(e, 'soft'), className: "flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm" }), _jsx("button", { onClick: adicionarSoftSkill, type: "button", className: "px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg flex items-center justify-center", children: _jsx(Plus, { className: "h-4 w-4" }) })] }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Award, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Certifica\u00E7\u00F5es" })] }), _jsx("div", { className: "space-y-3", children: certificacoes.map((cert) => (_jsxs("div", { className: "p-3 bg-blue-50 dark:bg-gray-700 rounded-xl", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm", children: cert.nomeCertificacao }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: cert.instituicao })] }, cert.id))) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(FolderOpen, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Projetos" })] }), _jsx("div", { className: "space-y-3 mb-4", children: projetos.map((proj) => (_jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm", children: proj.nomeProjeto }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: proj.descricao }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: ["Tech: ", proj.tecnologias] }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [new Date(proj.dataInicio).toLocaleDateString(), " - ", proj.dataFim ? new Date(proj.dataFim).toLocaleDateString() : 'Presente'] }), proj.link && (_jsx("a", { href: proj.link, target: "_blank", rel: "noreferrer", className: "text-xs text-blue-600 underline", children: "Abrir" }))] }), _jsx("button", { onClick: () => removerProjeto(proj.id), className: "text-red-600 hover:text-red-700 text-xs", children: _jsx(X, { className: "h-4 w-4" }) })] }) }, proj.id))) }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", placeholder: "Nome", value: novoProjeto.nomeProjeto, onChange: (e) => setNovoProjeto(v => ({ ...v, nomeProjeto: e.target.value })) }), _jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", placeholder: "Tech", value: novoProjeto.tecnologias, onChange: (e) => setNovoProjeto(v => ({ ...v, tecnologias: e.target.value })) }), _jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm col-span-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", placeholder: "Descri\u00E7\u00E3o", value: novoProjeto.descricao, onChange: (e) => setNovoProjeto(v => ({ ...v, descricao: e.target.value })) }), _jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", type: "date", value: novoProjeto.dataInicio, onChange: (e) => setNovoProjeto(v => ({ ...v, dataInicio: e.target.value })) }), _jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", type: "date", value: novoProjeto.dataFim, onChange: (e) => setNovoProjeto(v => ({ ...v, dataFim: e.target.value })) }), _jsx("input", { className: "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm col-span-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300", placeholder: "Link (opcional)", value: novoProjeto.link, onChange: (e) => setNovoProjeto(v => ({ ...v, link: e.target.value })) }), _jsx("button", { onClick: adicionarProjeto, className: "col-span-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm", children: "Adicionar Projeto" })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Heart, { className: "h-6 w-6 text-blue-500" }), _jsxs("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: ["Coment\u00E1rios (", comentarios.length, ")"] })] }) }), _jsx("div", { className: "space-y-3 mb-4 max-h-64 overflow-y-auto", children: carregandoComentarios ? (_jsxs("div", { className: "text-center py-4", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Carregando coment\u00E1rios..." })] })) : comentarios.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: _jsx("p", { className: "text-sm", children: "Nenhum coment\u00E1rio ainda" }) })) : (comentarios.map((comentario) => (_jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold", children: comentario.nomeColaboradorOrigem?.substring(0, 2).toUpperCase() || 'NN' }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm", children: comentario.nomeColaboradorOrigem || 'Desconhecido' }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatarData(comentario.dataComentario) })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: comentario.textoComentario })] })] }) }, comentario.idComentario)))) }), isAdmin && (_jsxs("div", { className: "border-t dark:border-gray-600 pt-4", children: [_jsx("textarea", { value: novoComentario, onChange: (e) => setNovoComentario(e.target.value), placeholder: "Adicionar coment\u00E1rio sobre este colaborador...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-none", rows: 2, maxLength: 500 }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [novoComentario.length, "/500"] }), _jsx("button", { onClick: adicionarComentario, disabled: !novoComentario.trim(), className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors", children: "Comentar" })] })] }))] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Building, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: "Experi\u00EAncia Profissional" })] }), _jsx("div", { className: "space-y-4 mb-6", children: experiencias.map((exp) => (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200", children: exp.cargo }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: exp.empresa }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [_jsx(Calendar, { className: "h-3 w-3 inline mr-1" }), new Date(exp.dataInicio).toLocaleDateString(), " - ", exp.dataFim ? new Date(exp.dataFim).toLocaleDateString() : 'Presente'] })] }), _jsx("button", { onClick: () => removerExperiencia(exp.id), className: "text-red-600 hover:text-red-700 text-sm px-2", children: _jsx(X, { className: "h-4 w-4" }) })] }) }, exp.id))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-xl", children: [_jsx("input", { type: "text", placeholder: "Cargo", value: novaExperiencia.cargo, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, cargo: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "text", placeholder: "Empresa", value: novaExperiencia.empresa, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, empresa: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "date", value: novaExperiencia.dataInicio, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, dataInicio: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "date", value: novaExperiencia.dataFim, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, dataFim: e.target.value })), placeholder: "Data Fim (opcional)", className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsxs("button", { onClick: adicionarExperiencia, className: "md:col-span-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center", children: [_jsx(Plus, { className: "h-4 w-4" }), "Adicionar Experi\u00EAncia"] })] })] }), _jsx("div", { className: "text-center py-6", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " Altave. Sistema de Gest\u00E3o de Compet\u00EAncias."] }) })] })] }));
}
