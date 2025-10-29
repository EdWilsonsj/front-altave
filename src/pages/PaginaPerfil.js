"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Briefcase, Award, Code, Plus, X, Sun, Moon, Edit3, Heart, Camera, LogOut, FolderOpen, Calendar, Building, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export default function PaginaPerfil() {
    // Hooks para obter o ID da URL e navegação
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const fileInputRef = useRef(null);
    /**
     * Função auxiliar para buscar experiências do colaborador
     */
    const buscarExperienciasColaborador = async (colaboradorId) => {
        try {
            // Tentar API específica do colaborador primeiro
            const responseEspecifica = await fetch(`${API_BASE_URL}/api/colaborador/${colaboradorId}/experiencias`);
            if (responseEspecifica.ok) {
                const experiencias = await responseEspecifica.json();
                return Array.isArray(experiencias) ? experiencias : [];
            }
        }
        catch (error) {
            // Continuar para próxima estratégia
        }
        try {
            // Buscar todas e filtrar
            const responseGeral = await fetch(`${API_BASE_URL}/api/experiencia`);
            if (responseGeral.ok) {
                const todasExperiencias = await responseGeral.json();
                if (!Array.isArray(todasExperiencias)) {
                    return [];
                }
                // Filtrar experiências do colaborador
                const experienciasFiltradas = todasExperiencias.filter((exp) => {
                    if (!exp || !exp.colaborador)
                        return false;
                    const expColabId = exp.colaborador.id;
                    return expColabId === colaboradorId ||
                        expColabId === colaboradorId.toString() ||
                        parseInt(expColabId) === colaboradorId ||
                        expColabId?.toString() === colaboradorId.toString();
                });
                return experienciasFiltradas;
            }
        }
        catch (error) {
            // Continuar para próxima estratégia
        }
        // Buscar através do endpoint do colaborador
        try {
            const responseColaborador = await fetch(`${API_BASE_URL}/api/colaborador/${colaboradorId}`);
            if (responseColaborador.ok) {
                const colaboradorData = await responseColaborador.json();
                if (colaboradorData.experiencias && Array.isArray(colaboradorData.experiencias)) {
                    return colaboradorData.experiencias;
                }
            }
        }
        catch (error) {
            // Falhou em todas as estratégias
        }
        return [];
    };
    // Estados do componente
    const [modoEscuro, setModoEscuro] = useState(() => {
        if (typeof window === 'undefined')
            return false;
        return window.localStorage?.getItem('theme') === 'dark';
    });
    const [colaborador, setColaborador] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [novaHardSkill, setNovaHardSkill] = useState("");
    const [novaSoftSkill, setNovaSoftSkill] = useState("");
    const [emEdicao, setEmEdicao] = useState(false);
    const [colaboradorOriginal, setColaboradorOriginal] = useState(null);
    const [cargosDisponiveis, setCargosDisponiveis] = useState([]);
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
    // Estados para certificações
    const [certificacoesDisponiveis, setCertificacoesDisponiveis] = useState([]);
    const [certificacaoSelecionada, setCertificacaoSelecionada] = useState('');
    // Skills pré-configuradas
    const HARD_SKILLS_DISPONIVEIS = [
        'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Angular',
        'Vue.js', 'PHP', 'C#', 'C++', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
        'Git', 'Docker', 'Kubernetes', 'AWS', 'Linux'
    ];
    const SOFT_SKILLS_DISPONIVEIS = [
        'Comunicação', 'Trabalho em equipe', 'Liderança', 'Proatividade', 'Adaptabilidade',
        'Resolução de problemas', 'Organização', 'Gestão de tempo', 'Criatividade', 'Empatia',
        'Pensamento crítico', 'Autoconfiança', 'Motivação', 'Flexibilidade', 'Colaboração',
        'Negociação', 'Persuasão', 'Resiliência', 'Inteligência emocional', 'Foco em resultados'
    ];
    /**
     * Lida com o logout do usuário.
     */
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        }
        catch (error) {
            // Erro ao fazer logout
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
                const errorData = await response.json();
                alert(`Erro ao fazer upload da foto: ${errorData.error || 'Erro desconhecido'}`);
            }
        }
        catch (error) {
            alert(`Erro ao conectar com o servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
            alert("Erro ao salvar as alterações. Tente novamente.");
        }
    };
    // Efeito para gerenciar o tema escuro e persistir
    useEffect(() => {
        try {
            const root = document.documentElement;
            if (modoEscuro) {
                root.classList.add("dark");
                if (typeof window !== 'undefined' && window.localStorage?.setItem) {
                    window.localStorage.setItem('theme', 'dark');
                }
            }
            else {
                root.classList.remove("dark");
                if (typeof window !== 'undefined' && window.localStorage?.setItem) {
                    window.localStorage.setItem('theme', 'light');
                }
            }
        }
        catch { /* ignore theme error */ }
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
            console.log("Colaborador carregado do backend:", data);
            console.log("Soft Skills recebidas:", data.softSkills);
            console.log("Hard Skills recebidas:", data.hardSkills);
            // Buscar experiências do colaborador usando função auxiliar
            const colaboradorId = parseInt(id);
            data.experiencias = await buscarExperienciasColaborador(colaboradorId);
            // Corrigir codificação nas soft skills e hard skills
            if (data.softSkills) {
                data.softSkills = data.softSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
                console.log("Soft Skills após correção:", data.softSkills);
            }
            if (data.hardSkills) {
                data.hardSkills = data.hardSkills.map((skill) => ({
                    ...skill,
                    nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
                }));
                console.log("Hard Skills após correção:", data.hardSkills);
            }
            // Construir URL da foto se profilePicturePath existir
            if (data.profilePicturePath) {
                data.fotoUrl = `${API_BASE_URL}/api/colaborador/foto/${data.profilePicturePath}`;
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
    /**
     * Carrega os cargos disponíveis
     */
    const carregarCargos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cargo`);
            if (response.ok) {
                const data = await response.json();
                setCargosDisponiveis(data);
            }
        }
        catch (error) {
            console.error('Erro ao carregar cargos:', error);
        }
    };
    /**
     * Carrega as certificações disponíveis
     */
    const carregarCertificacoesDisponiveis = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/certificacao`);
            if (response.ok) {
                const data = await response.json();
                setCertificacoesDisponiveis(data);
            }
        }
        catch (error) {
            console.error('Erro ao carregar certificações:', error);
        }
    };
    /**
     * Adiciona uma certificação ao colaborador
     */
    const adicionarCertificacao = async () => {
        if (!certificacaoSelecionada || !colaborador)
            return;
        const certificacaoId = parseInt(certificacaoSelecionada);
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}/certificacao/${certificacaoId}`, {
                method: 'POST',
            });
            if (response.ok) {
                const colaboradorAtualizado = await response.json();
                setColaborador(colaboradorAtualizado);
                setCertificacaoSelecionada('');
                alert('Certificação adicionada com sucesso!');
            }
            else {
                alert('Erro ao adicionar certificação.');
            }
        }
        catch (error) {
            console.error('Erro ao adicionar certificação:', error);
            alert('Erro ao adicionar certificação.');
        }
    };
    /**
     * Remove uma certificação do colaborador
     */
    const removerCertificacao = async (certificacaoId) => {
        if (!colaborador)
            return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}/certificacao/${certificacaoId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Remover localmente
                setColaborador(prev => prev ? {
                    ...prev,
                    certificacoes: prev.certificacoes.filter(cert => cert.id !== certificacaoId)
                } : null);
                alert('Certificação removida com sucesso!');
            }
            else {
                alert('Erro ao remover certificação.');
            }
        }
        catch (error) {
            console.error('Erro ao remover certificação:', error);
            alert('Erro ao remover certificação.');
        }
    };
    // Efeito para buscar os dados do colaborador quando o ID da URL muda
    useEffect(() => {
        buscarColaborador();
        carregarComentarios();
        carregarCargos();
        carregarCertificacoesDisponiveis();
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
                        // Erro ao buscar colaborador
                    }
                    return { ...comentario, nomeColaboradorOrigem: 'Desconhecido' };
                }));
                setComentarios(comentariosComNomes);
            }
        }
        catch (error) {
            // Erro ao carregar comentários
        }
        finally {
            setCarregandoComentarios(false);
        }
    };
    const removerComentario = async (comentarioId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/comentario/${comentarioId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await carregarComentarios();
            }
            else {
                const errorText = await response.text();
                alert(`Erro ao remover comentário: ${errorText}`);
            }
        }
        catch (error) {
            alert('Erro ao remover comentário.');
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
        if (!novaHardSkill || !colaborador)
            return;
        try {
            const novaSkill = {
                nomeCompetencia: novaHardSkill,
                colaborador: { id: colaborador.id }
            };
            console.log("Adicionando hard skill:", novaSkill);
            const response = await fetch(`${API_BASE_URL}/api/hardskill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaSkill),
            });
            if (response.ok) {
                const skillAdicionada = await response.json();
                console.log("Hard skill adicionada:", skillAdicionada);
                // Recarregar colaborador completo do backend para garantir sincronização
                await buscarColaborador();
                setNovaHardSkill("");
            }
            else {
                const errorText = await response.text();
                console.error("Falha ao adicionar a hard skill:", errorText);
                alert(`Erro ao adicionar hard skill: ${errorText}`);
            }
        }
        catch (error) {
            console.error("Erro ao adicionar hard skill:", error);
            alert(`Erro ao adicionar hard skill: ${error}`);
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
     * Normaliza texto para comparação (remove acentos e deixa minúsculo)
     */
    const normalizarTexto = (texto) => {
        if (!texto)
            return texto;
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .trim();
    };
    /**
     * Adiciona uma nova soft skill para o colaborador.
     */
    const adicionarSoftSkill = async () => {
        if (!novaSoftSkill || !colaborador)
            return;
        try {
            const payload = { nomeCompetencia: novaSoftSkill };
            console.log("Associando soft skill ao colaborador:", payload);
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}/softskill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                await buscarColaborador();
                setNovaSoftSkill("");
            }
            else {
                const errorText = await response.text();
                console.error("Falha ao associar a soft skill:", errorText);
                alert(`Erro ao adicionar soft skill: ${errorText}`);
            }
        }
        catch (error) {
            console.error("Erro ao adicionar soft skill:", error);
            alert(`Erro ao adicionar soft skill: ${error}`);
        }
    };
    /**
     * Remove uma hard skill do colaborador.
     */
    const removerHardSkill = async (skillId) => {
        try {
            console.log(`Removendo hard skill com ID: ${skillId}`);
            const response = await fetch(`${API_BASE_URL}/api/hardskill/${skillId}`, {
                method: 'DELETE',
            });
            console.log(`Response status: ${response.status}`);
            if (response.ok) {
                console.log("Hard skill removida com sucesso no backend");
                // Recarregar colaborador completo do backend para garantir sincronização
                await buscarColaborador();
            }
            else {
                const errorText = await response.text();
                console.error("Falha ao remover a hard skill. Status:", response.status, "Erro:", errorText);
                alert(`Erro ao remover hard skill: ${errorText}`);
            }
        }
        catch (error) {
            console.error("Erro ao remover hard skill:", error);
            alert(`Erro ao remover hard skill: ${error}`);
        }
    };
    /**
     * Remove uma soft skill do colaborador.
     */
    const removerSoftSkill = async (skillId) => {
        if (!colaborador)
            return;
        try {
            console.log(`Desassociando soft skill ${skillId} do colaborador ${colaborador.id}`);
            const response = await fetch(`${API_BASE_URL}/api/colaborador/${colaborador.id}/softskill/${skillId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await buscarColaborador();
            }
            else {
                const errorText = await response.text();
                console.error("Falha ao remover a soft skill. Status:", response.status, "Erro:", errorText);
                alert(`Erro ao remover soft skill: ${errorText}`);
            }
        }
        catch (error) {
            console.error("Erro ao remover soft skill:", error);
            alert(`Erro ao remover soft skill: ${error}`);
        }
    };
    /**
     * Adiciona uma nova experiência.
     */
    const adicionarExperiencia = async () => {
        if (!colaborador || !novaExperiencia.cargo || !novaExperiencia.empresa)
            return;
        try {
            const experienciaData = {
                cargo: novaExperiencia.cargo.trim(),
                empresa: novaExperiencia.empresa.trim(),
                dataInicio: novaExperiencia.dataInicio,
                dataFim: novaExperiencia.dataFim,
                colaborador: { id: colaborador.id }
            };
            const response = await fetch(`${API_BASE_URL}/api/experiencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(experienciaData),
            });
            if (response.ok) {
                setNovaExperiencia({ cargo: '', empresa: '', dataInicio: '', dataFim: '' });
                await recarregarExperiencias();
                alert('Experiência adicionada com sucesso!');
            }
            else {
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
            const colaboradorId = parseInt(id);
            const experiencias = await buscarExperienciasColaborador(colaboradorId);
            setColaborador(prev => prev ? {
                ...prev,
                experiencias: experiencias
            } : null);
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
            const response = await fetch(`${API_BASE_URL}/api/experiencia/${expId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                // Se falhar, recarregar para restaurar o estado correto
                await recarregarExperiencias();
            }
        }
        catch (error) {
            console.error('Erro ao remover experiência:', error);
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
            const projetoData = {
                nomeProjeto: novoProjeto.nomeProjeto.trim(),
                descricao: novoProjeto.descricao.trim(),
                tecnologias: novoProjeto.tecnologias.trim(),
                dataInicio: novoProjeto.dataInicio || null,
                dataFim: novoProjeto.dataFim || null,
                link: novoProjeto.link.trim() || null,
                colaborador: { id: colaborador.id }
            };
            console.log('Enviando projeto para:', `${API_BASE_URL}/api/projeto`);
            console.log('Dados:', projetoData);
            const response = await fetch(`${API_BASE_URL}/api/projeto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(projetoData),
            });
            console.log('Response status:', response.status);
            if (response.ok) {
                const projetoAdicionado = await response.json();
                setColaborador(prev => prev ? {
                    ...prev,
                    projetos: prev.projetos ? [...prev.projetos, projetoAdicionado] : [projetoAdicionado]
                } : null);
                setNovoProjeto({ nomeProjeto: '', descricao: '', tecnologias: '', dataInicio: '', dataFim: '', link: '' });
                alert('Projeto adicionado com sucesso!');
            }
            else {
                const errorText = await response.text();
                console.error('Erro do servidor:', errorText);
                alert(`Erro ao adicionar projeto: ${response.status} - ${errorText.substring(0, 100)}`);
            }
        }
        catch (error) {
            console.error('Erro ao adicionar projeto:', error);
            alert('Erro ao adicionar projeto. Verifique o console para mais detalhes.');
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
                alert('Projeto removido com sucesso!');
            }
            else {
                alert('Erro ao remover projeto.');
            }
        }
        catch (error) {
            console.error('Erro ao remover projeto:', error);
            alert('Erro ao remover projeto.');
        }
    };
    /**
     * Exporta o perfil completo para PDF.
     */
    const exportarParaPDF = () => {
        if (!colaborador)
            return;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPos = margin;
        // Função auxiliar para adicionar nova página se necessário
        const checkPageBreak = (requiredSpace) => {
            if (yPos + requiredSpace > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
        };
        // Título
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246); // Azul
        const title = 'PERFIL PROFISSIONAL';
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, yPos);
        yPos += 15;
        // Linha separadora
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
        // Informações Pessoais
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('INFORMAÇÕES PESSOAIS', margin, yPos);
        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nome: ${colaborador.nome}`, margin, yPos);
        yPos += 7;
        doc.text(`Email: ${colaborador.email}`, margin, yPos);
        yPos += 7;
        doc.text(`Cargo: ${colaborador.cargo?.nomeCargo || 'N/A'}`, margin, yPos);
        yPos += 10;
        // Sobre Mim
        checkPageBreak(25);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('SOBRE MIM', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const aboutLines = doc.splitTextToSize(colaborador.apresentacao || 'Não informado', pageWidth - 2 * margin);
        doc.text(aboutLines, margin, yPos);
        yPos += aboutLines.length * 5 + 8;
        // Experiências Profissionais
        if (colaborador.experiencias && colaborador.experiencias.length > 0) {
            checkPageBreak(30);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('EXPERIÊNCIAS PROFISSIONAIS', margin, yPos);
            yPos += 8;
            colaborador.experiencias.forEach((exp, index) => {
                checkPageBreak(20);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}. ${exp.cargo}`, margin, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Empresa: ${exp.empresa}`, margin + 5, yPos);
                yPos += 5;
                const inicioDate = new Date(exp.dataInicio).toLocaleDateString('pt-BR');
                const fimDate = exp.dataFim ? new Date(exp.dataFim).toLocaleDateString('pt-BR') : 'Presente';
                doc.text(`Período: ${inicioDate} - ${fimDate}`, margin + 5, yPos);
                yPos += 7;
            });
        }
        // Hard Skills
        if (colaborador.hardSkills && colaborador.hardSkills.length > 0) {
            checkPageBreak(20);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('HARD SKILLS', margin, yPos);
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const hardSkillsText = colaborador.hardSkills.map(skill => skill.nomeCompetencia).join(', ');
            const hardSkillsLines = doc.splitTextToSize(hardSkillsText, pageWidth - 2 * margin);
            doc.text(hardSkillsLines, margin, yPos);
            yPos += hardSkillsLines.length * 5 + 8;
        }
        // Soft Skills
        if (colaborador.softSkills && colaborador.softSkills.length > 0) {
            checkPageBreak(20);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('SOFT SKILLS', margin, yPos);
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const softSkillsText = colaborador.softSkills.map(skill => skill.nomeCompetencia).join(', ');
            const softSkillsLines = doc.splitTextToSize(softSkillsText, pageWidth - 2 * margin);
            doc.text(softSkillsLines, margin, yPos);
            yPos += softSkillsLines.length * 5 + 8;
        }
        // Certificações
        if (colaborador.certificacoes && colaborador.certificacoes.length > 0) {
            checkPageBreak(25);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('CERTIFICAÇÕES', margin, yPos);
            yPos += 8;
            colaborador.certificacoes.forEach((cert, index) => {
                checkPageBreak(15);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`${index + 1}. ${cert.nomeCertificacao}`, margin, yPos);
                yPos += 5;
                doc.text(`   Instituição: ${cert.instituicao}`, margin + 5, yPos);
                yPos += 7;
            });
        }
        // Projetos
        if (colaborador.projetos && colaborador.projetos.length > 0) {
            checkPageBreak(30);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('PROJETOS', margin, yPos);
            yPos += 8;
            colaborador.projetos.forEach((proj, index) => {
                checkPageBreak(30);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}. ${proj.nomeProjeto}`, margin, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                if (proj.descricao) {
                    const descLines = doc.splitTextToSize(proj.descricao, pageWidth - 2 * margin - 5);
                    doc.text(descLines, margin + 5, yPos);
                    yPos += descLines.length * 5;
                }
                if (proj.tecnologias) {
                    doc.text(`Tecnologias: ${proj.tecnologias}`, margin + 5, yPos);
                    yPos += 5;
                }
                if (proj.dataInicio) {
                    const inicioDate = new Date(proj.dataInicio).toLocaleDateString('pt-BR');
                    const fimDate = proj.dataFim ? new Date(proj.dataFim).toLocaleDateString('pt-BR') : 'Presente';
                    doc.text(`Período: ${inicioDate} - ${fimDate}`, margin + 5, yPos);
                    yPos += 5;
                }
                if (proj.link) {
                    doc.setTextColor(59, 130, 246);
                    doc.text(`Link: ${proj.link}`, margin + 5, yPos);
                    doc.setTextColor(0, 0, 0);
                    yPos += 5;
                }
                yPos += 7;
            });
        }
        // Rodapé
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128);
        doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')} - Altave Sistema de Gestão`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        // Salvar o PDF
        doc.save(`perfil_${colaborador.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
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
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4", children: [_jsxs("div", { className: "fixed top-4 right-4 flex gap-2 z-10", children: [_jsx("button", { onClick: handleLogout, "aria-label": "Sair", className: "p-2 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-105 transition-all shadow-lg", children: _jsx(LogOut, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => setModoEscuro(v => !v), "aria-label": "Alternar tema", className: "p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) })] }), _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700", children: _jsxs("div", { className: "flex flex-col lg:flex-row items-start lg:items-center gap-8", children: [_jsxs("div", { className: "flex-shrink-0 relative", children: [_jsx("div", { className: "w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-700", children: colaborador.fotoUrl ? (_jsx("img", { src: colaborador.fotoUrl, alt: nome, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold", children: nome.substring(0, 2).toUpperCase() })) }), _jsx("button", { onClick: () => fileInputRef.current?.click(), className: "absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors", title: "Alterar foto", children: _jsx(Camera, { className: "h-4 w-4" }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFotoUpload, className: "hidden" })] }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-3 mb-2", children: emEdicao ? (_jsx("input", { type: "text", name: "nome", value: nome, onChange: aoMudarPerfil, className: "text-3xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none" })) : (_jsx("h1", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: nome })) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-5 w-5 text-blue-500" }), emEdicao ? (_jsxs("select", { name: "cargo", value: colaborador.cargo?.id || '', onChange: (e) => {
                                                                const selectedCargo = cargosDisponiveis.find(c => c.id === parseInt(e.target.value));
                                                                if (selectedCargo) {
                                                                    setColaborador(prev => prev ? { ...prev, cargo: selectedCargo } : null);
                                                                }
                                                            }, className: "px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", children: [_jsx("option", { value: "", children: "Selecione um cargo" }), cargosDisponiveis.map((cargo) => (_jsx("option", { value: cargo.id, children: cargo.nomeCargo }, cargo.id)))] })) : (_jsx("span", { children: cargo?.nomeCargo || 'N/A' }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-blue-500" }), _jsx("span", { children: email })] })] })] }), emEdicao ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: aoSalvar, className: "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Salvar" }), _jsx("button", { onClick: aoCancelar, className: "px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: "Cancelar" })] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: aoEditar, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: [_jsx(Edit3, { className: "h-4 w-4" }), "Editar Perfil"] }), _jsxs("button", { onClick: exportarParaPDF, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg", children: [_jsx(Download, { className: "h-4 w-4" }), "Exportar PDF"] })] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(User, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Sobre mim" })] }), emEdicao ? (_jsx("textarea", { name: "apresentacao", value: apresentacao, onChange: aoMudarPerfil, maxLength: 2000, className: "w-full min-h-48 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm resize-vertical" })) : (_jsx("p", { className: "text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line", children: apresentacao }))] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Code, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Hard Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: hardSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        removerHardSkill(skill.id);
                                                    }, className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-blue-900 dark:text-blue-100" }) })] }, skill.id))) }), _jsx("div", { className: "flex justify-center mt-auto", children: _jsxs("div", { className: "flex gap-2 w-full max-w-sm", children: [_jsxs("select", { value: novaHardSkill, onChange: (e) => setNovaHardSkill(e.target.value), className: "flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", children: [_jsx("option", { value: "", children: "Selecione uma Hard Skill" }), HARD_SKILLS_DISPONIVEIS
                                                            .filter(skill => !hardSkills.some(hs => normalizarTexto(hs.nomeCompetencia) === normalizarTexto(skill)))
                                                            .map((skill) => (_jsx("option", { value: skill, children: skill }, skill)))] }), _jsx("button", { onClick: adicionarHardSkill, disabled: !novaHardSkill, type: "button", className: "px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg flex items-center justify-center", children: _jsx(Plus, { className: "h-4 w-4" }) })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Heart, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: "Soft Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: softSkills.map((skill) => (_jsxs("span", { className: "group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors", children: [skill.nomeCompetencia, _jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        removerSoftSkill(skill.id);
                                                    }, className: "opacity-0 group-hover:opacity-100 transition-opacity", type: "button", children: _jsx(X, { className: "h-3 w-3 text-green-900 dark:text-green-100" }) })] }, skill.id))) }), _jsx("div", { className: "flex justify-center mt-auto", children: _jsxs("div", { className: "flex gap-2 w-full max-w-sm", children: [_jsxs("select", { value: novaSoftSkill, onChange: (e) => setNovaSoftSkill(e.target.value), className: "flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", children: [_jsx("option", { value: "", children: "Selecione uma Soft Skill" }), SOFT_SKILLS_DISPONIVEIS
                                                            .filter(skill => !softSkills.some(ss => normalizarTexto(ss.nomeCompetencia) === normalizarTexto(skill)))
                                                            .map((skill) => (_jsx("option", { value: skill, children: skill }, skill)))] }), _jsx("button", { onClick: adicionarSoftSkill, disabled: !novaSoftSkill, type: "button", className: "px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg flex items-center justify-center", children: _jsx(Plus, { className: "h-4 w-4" }) })] }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Award, { className: "h-6 w-6 text-blue-500" }), _jsxs("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: ["Certifica\u00E7\u00F5es (", certificacoes.length, ")"] })] }), _jsx("div", { className: "space-y-3 mb-4 max-h-64 overflow-y-auto pr-1", children: certificacoes.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: _jsx("p", { className: "text-sm", children: "Nenhuma certifica\u00E7\u00E3o adicionada ainda" }) })) : (certificacoes.map((cert) => (_jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 group", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: "w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", children: cert.nomeCertificacao.substring(0, 2).toUpperCase() }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm truncate", children: cert.nomeCertificacao }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 truncate", children: cert.instituicao })] })] }) }), _jsx("button", { onClick: () => removerCertificacao(cert.id), className: "opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 flex-shrink-0", title: "Remover certifica\u00E7\u00E3o", children: _jsx(X, { className: "h-4 w-4" }) })] }) }, cert.id)))) }), _jsx("div", { className: "mt-4 pt-4", children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("select", { value: certificacaoSelecionada, onChange: (e) => setCertificacaoSelecionada(e.target.value), className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", children: [_jsx("option", { value: "", children: "Selecione uma certifica\u00E7\u00E3o" }), certificacoesDisponiveis
                                                            .filter(cert => !certificacoes.some(c => c.id === cert.id))
                                                            .map((cert) => (_jsx("option", { value: cert.id, children: cert.nomeCertificacao }, cert.id)))] }), _jsxs("button", { onClick: adicionarCertificacao, disabled: !certificacaoSelecionada, className: "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium", children: [_jsx(Plus, { className: "h-4 w-4" }), "Adicionar Certifica\u00E7\u00E3o"] })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(FolderOpen, { className: "h-6 w-6 text-blue-500" }), _jsxs("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: ["Projetos (", projetos.length, ")"] })] }), _jsx("div", { className: "space-y-3 mb-4 max-h-64 overflow-y-auto pr-1", children: projetos.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: _jsx("p", { className: "text-sm", children: "Nenhum projeto adicionado ainda" }) })) : (projetos.map((proj) => (_jsx("div", { className: "p-3 bg-green-50 dark:bg-gray-700 rounded-xl border border-green-200 dark:border-gray-600 group", children: _jsxs("div", { className: "flex justify-between items-start gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1", children: proj.nomeProjeto }), _jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400 mb-1", children: proj.descricao }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500 mb-1", children: [_jsx(Code, { className: "h-3 w-3 inline mr-1" }), proj.tecnologias] }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [_jsx(Calendar, { className: "h-3 w-3 inline mr-1" }), proj.dataInicio ? new Date(proj.dataInicio).toLocaleDateString() : 'N/A', " - ", proj.dataFim ? new Date(proj.dataFim).toLocaleDateString() : 'Presente'] }), proj.link && (_jsx("a", { href: proj.link, target: "_blank", rel: "noreferrer", className: "text-xs text-blue-600 hover:text-blue-700 underline inline-block mt-1", children: "Ver projeto \u2192" }))] }), _jsx("button", { onClick: () => removerProjeto(proj.id), className: "opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 flex-shrink-0", children: _jsx(X, { className: "h-4 w-4" }) })] }) }, proj.id)))) }), _jsx("div", { className: "mt-4 pt-4", children: _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("input", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", placeholder: "Nome do Projeto", value: novoProjeto.nomeProjeto, onChange: (e) => setNovoProjeto(v => ({ ...v, nomeProjeto: e.target.value })) }), _jsx("input", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", placeholder: "Tecnologias (ex: React, Node.js, PostgreSQL)", value: novoProjeto.tecnologias, onChange: (e) => setNovoProjeto(v => ({ ...v, tecnologias: e.target.value })) }), _jsx("textarea", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm resize-none", placeholder: "Descri\u00E7\u00E3o do projeto...", rows: 2, value: novoProjeto.descricao, onChange: (e) => setNovoProjeto(v => ({ ...v, descricao: e.target.value })) }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", type: "date", placeholder: "Data In\u00EDcio", value: novoProjeto.dataInicio, onChange: (e) => setNovoProjeto(v => ({ ...v, dataInicio: e.target.value })) }), _jsx("input", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", type: "date", placeholder: "Data Fim (opcional)", value: novoProjeto.dataFim, onChange: (e) => setNovoProjeto(v => ({ ...v, dataFim: e.target.value })) })] }), _jsx("input", { className: "w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm", placeholder: "Link (opcional)", value: novoProjeto.link, onChange: (e) => setNovoProjeto(v => ({ ...v, link: e.target.value })) }), _jsxs("button", { onClick: adicionarProjeto, disabled: !novoProjeto.nomeProjeto.trim(), className: "w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium", children: [_jsx(Plus, { className: "h-4 w-4" }), "Adicionar Projeto"] })] }) })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700", children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Heart, { className: "h-6 w-6 text-blue-500" }), _jsxs("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100", children: ["Coment\u00E1rios (", comentarios.length, ")"] })] }) }), _jsx("div", { className: "space-y-3 mb-4 max-h-64 overflow-y-auto", children: carregandoComentarios ? (_jsxs("div", { className: "text-center py-4", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Carregando coment\u00E1rios..." })] })) : comentarios.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: _jsx("p", { className: "text-sm", children: "Nenhum coment\u00E1rio ainda" }) })) : (comentarios.map((comentario) => (_jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold", children: comentario.nomeColaboradorOrigem?.substring(0, 2).toUpperCase() || 'NN' }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200 text-sm", children: comentario.nomeColaboradorOrigem || 'Desconhecido' }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatarData(comentario.dataComentario) }), isAdmin && currentUserId === comentario.idColaboradorOrigem && (_jsx("button", { onClick: () => removerComentario(comentario.idComentario), className: "ml-auto text-red-600 hover:text-red-700 text-xs", title: "Remover coment\u00E1rio", children: "Remover" }))] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: comentario.textoComentario })] })] }) }, comentario.idComentario)))) }), isAdmin && (_jsxs("div", { className: "border-t dark:border-gray-600 pt-4", children: [_jsx("textarea", { value: novoComentario, onChange: (e) => setNovoComentario(e.target.value), placeholder: "Adicionar coment\u00E1rio sobre este colaborador...", className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-none", rows: 2, maxLength: 500 }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [novoComentario.length, "/500"] }), _jsx("button", { onClick: adicionarComentario, disabled: !novoComentario.trim(), className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors", children: "Comentar" })] })] }))] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Building, { className: "h-6 w-6 text-blue-500" }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: "Experi\u00EAncia Profissional" })] }), _jsx("div", { className: "space-y-4 mb-6", children: experiencias.map((exp) => (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-800 dark:text-gray-200", children: exp.cargo }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: exp.empresa }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [_jsx(Calendar, { className: "h-3 w-3 inline mr-1" }), new Date(exp.dataInicio).toLocaleDateString(), " - ", exp.dataFim ? new Date(exp.dataFim).toLocaleDateString() : 'Presente'] })] }), _jsx("button", { onClick: () => removerExperiencia(exp.id), className: "text-red-600 hover:text-red-700 text-sm px-2", children: _jsx(X, { className: "h-4 w-4" }) })] }) }, exp.id))) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-xl", children: [_jsx("input", { type: "text", placeholder: "Cargo", value: novaExperiencia.cargo, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, cargo: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "text", placeholder: "Empresa", value: novaExperiencia.empresa, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, empresa: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "date", value: novaExperiencia.dataInicio, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, dataInicio: e.target.value })), className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsx("input", { type: "date", value: novaExperiencia.dataFim, onChange: (e) => setNovaExperiencia(prev => ({ ...prev, dataFim: e.target.value })), placeholder: "Data Fim (opcional)", className: "px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm" }), _jsxs("button", { onClick: adicionarExperiencia, className: "md:col-span-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center", children: [_jsx(Plus, { className: "h-4 w-4" }), "Adicionar Experi\u00EAncia"] })] })] }), _jsx("div", { className: "text-center py-6", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " Altave. Sistema de Gest\u00E3o de Compet\u00EAncias."] }) })] })] }));
}
