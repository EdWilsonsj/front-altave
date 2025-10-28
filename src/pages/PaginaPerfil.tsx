"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  User, 
  Mail, 
  Briefcase, 
  Award, 
  Code, 
  Plus, 
  X, 
  Sun, 
  Moon,
  Edit3,
  Heart,
  Camera,
  LogOut,
  FolderOpen,
  Calendar,
  Building
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Interfaces que espelham os modelos do backend
interface Cargo {
  id: number;
  nomeCargo: string;
}

interface Certificacao {
  id: number;
  nomeCertificacao: string;
  instituicao: string;
}

interface Experiencia {
  id: number;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim: string;
}

interface Projeto {
  id: number;
  nomeProjeto: string;
  descricao: string;
  tecnologias: string;
  dataInicio: string;
  dataFim: string;
  link?: string;
}

interface HardSkill {
  id: number;
  nomeCompetencia: string;
}

interface SoftSkill {
  id: number;
  nomeCompetencia: string;
}

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  apresentacao: string;
  perfil: number;
  cargo: Cargo;
  certificacoes: Certificacao[];
  experiencias: Experiencia[];
  projetos?: Projeto[];
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
  fotoUrl?: string;
  profilePicturePath?: string;
}

export default function PaginaPerfil() {
  // Hooks para obter o ID da URL e navegação
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Função auxiliar para buscar experiências do colaborador
   */
  const buscarExperienciasColaborador = async (colaboradorId: number): Promise<Experiencia[]> => {
    try {
      // Tentar API específica do colaborador primeiro
      const responseEspecifica = await fetch(`${API_BASE_URL}/api/colaborador/${colaboradorId}/experiencias`);
      if (responseEspecifica.ok) {
        const experiencias = await responseEspecifica.json();
        return Array.isArray(experiencias) ? experiencias : [];
      }
    } catch (error) {
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
        const experienciasFiltradas = todasExperiencias.filter((exp: any) => {
          if (!exp || !exp.colaborador) return false;
          
          const expColabId = exp.colaborador.id;
          return expColabId === colaboradorId ||
                 expColabId === colaboradorId.toString() ||
                 parseInt(expColabId) === colaboradorId ||
                 expColabId?.toString() === colaboradorId.toString();
        });
        
        return experienciasFiltradas;
      }
    } catch (error) {
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
    } catch (error) {
      // Falhou em todas as estratégias
    }
    
    return [];
  };

  // Estados do componente
  const [modoEscuro, setModoEscuro] = useState(false);
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [novaHardSkill, setNovaHardSkill] = useState("");
  const [novaSoftSkill, setNovaSoftSkill] = useState("");
  const [emEdicao, setEmEdicao] = useState(false);
  const [colaboradorOriginal, setColaboradorOriginal] = useState<Colaborador | null>(null);
  const [cargosDisponiveis, setCargosDisponiveis] = useState<Cargo[]>([]);
  
  // Estados para controle de acesso e comentários
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
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
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [carregandoComentarios, setCarregandoComentarios] = useState(true);
  const [novoComentario, setNovoComentario] = useState('');
  
  // Estados para certificações
  const [certificacoesDisponiveis, setCertificacoesDisponiveis] = useState<Certificacao[]>([]);
  const [certificacaoSelecionada, setCertificacaoSelecionada] = useState('');

  /**
   * Lida com o logout do usuário.
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Erro ao fazer logout
    }
  };

  /**
   * Lida com o upload da foto de perfil.
   */
  const handleFotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !colaborador) return;

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
      } else {
        const errorData = await response.json();
        alert(`Erro ao fazer upload da foto: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      alert(`Erro ao conectar com o servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  /**
   * Lida com mudanças nos inputs do perfil durante a edição.
   */
  const aoMudarPerfil = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!colaborador) return;
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
    if (!colaborador) return;
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
        colaboradorAtualizado.softSkills = colaboradorAtualizado.softSkills.map((skill: SoftSkill) => ({
          ...skill,
          nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
        }));
      }
      
      if (colaboradorAtualizado.hardSkills) {
        colaboradorAtualizado.hardSkills = colaboradorAtualizado.hardSkills.map((skill: HardSkill) => ({
          ...skill,
          nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
        }));
      }
      
      setColaborador(colaboradorAtualizado);
      setEmEdicao(false);
      setColaboradorOriginal(null);
    } catch (error) {
      alert("Erro ao salvar as alterações. Tente novamente.");
    }
  };

  // Efeito para gerenciar o tema escuro
  useEffect(() => {
    const root = document.documentElement;
    if (modoEscuro) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [modoEscuro]);

  /**
   * Busca os dados do colaborador na API com base no ID da URL.
   */
  const buscarColaborador = async () => {
    if (!id) return;
    setCarregando(true);
    try {
      // Buscar dados do colaborador
      const response = await fetch(`${API_BASE_URL}/api/colaborador/${id}`);
      if (!response.ok) {
        throw new Error('A resposta da rede não foi bem-sucedida.');
      }
      const data: Colaborador = await response.json();
      
      // Buscar experiências do colaborador usando função auxiliar
      const colaboradorId = parseInt(id);
      data.experiencias = await buscarExperienciasColaborador(colaboradorId);
      
      // Corrigir codificação nas soft skills e hard skills
      if (data.softSkills) {
        data.softSkills = data.softSkills.map((skill: SoftSkill) => ({
          ...skill,
          nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
        }));
      }
      
      if (data.hardSkills) {
        data.hardSkills = data.hardSkills.map((skill: HardSkill) => ({
          ...skill,
          nomeCompetencia: corrigirTexto(skill.nomeCompetencia)
        }));
      }
      
      // Construir URL da foto se profilePicturePath existir
      if (data.profilePicturePath) {
        data.fotoUrl = `${API_BASE_URL}/api/colaborador/foto/${data.profilePicturePath}`;
      }
      
      setColaborador(data);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Ocorreu um erro desconhecido.");
      }
    } finally {
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
    } catch (error) {
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
    } catch (error) {
      console.error('Erro ao carregar certificações:', error);
    }
  };

  /**
   * Adiciona uma certificação ao colaborador
   */
  const adicionarCertificacao = async () => {
    if (!certificacaoSelecionada || !colaborador) return;
    
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
      } else {
        alert('Erro ao adicionar certificação.');
      }
    } catch (error) {
      console.error('Erro ao adicionar certificação:', error);
      alert('Erro ao adicionar certificação.');
    }
  };

  /**
   * Remove uma certificação do colaborador
   */
  const removerCertificacao = async (certificacaoId: number) => {
    if (!colaborador) return;
    
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
      } else {
        alert('Erro ao remover certificação.');
      }
    } catch (error) {
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
    if (!id) return;
    setCarregandoComentarios(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/comentario/colaborador/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Buscar nomes dos colaboradores de origem
        const comentariosComNomes = await Promise.all(
          data.map(async (comentario: any) => {
            try {
              const colaboradorResponse = await fetch(`${API_BASE_URL}/api/colaborador/${comentario.idColaboradorOrigem}`);
              if (colaboradorResponse.ok) {
                const colaboradorOrigem = await colaboradorResponse.json();
                return { ...comentario, nomeColaboradorOrigem: colaboradorOrigem.nome };
              }
            } catch (error) {
              // Erro ao buscar colaborador
            }
            return { ...comentario, nomeColaboradorOrigem: 'Desconhecido' };
          })
        );
        setComentarios(comentariosComNomes);
      }
    } catch (error) {
      // Erro ao carregar comentários
    } finally {
      setCarregandoComentarios(false);
    }
  };
  
  /**
   * Adiciona um novo comentário
   */
  const adicionarComentario = async () => {
    if (!novoComentario.trim() || !currentUserId || !colaborador) return;
    
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
      } else {
        alert('Erro ao adicionar comentário.');
      }
    } catch (error) {
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
      } else {
        console.error("Falha ao adicionar a hard skill.");
      }
    }
  };

  /**
   * Formata data para exibição
   */
  const formatarData = (dateString: string) => {
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
  const corrigirTexto = (texto: string) => {
    if (!texto) return texto;
    
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
        if (match.length === 2) return 'ã';
        if (match.length === 3) return 'ção';
        if (match.length === 4) return 'ção';
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
      } else {
        console.error("Falha ao adicionar a soft skill.");
      }
    }
  };

  /**
   * Remove uma hard skill do colaborador.
   */
  const removerHardSkill = async (skillId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/hardskill/${skillId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setColaborador(prev => prev ? { ...prev, hardSkills: prev.hardSkills.filter(s => s.id !== skillId) } : null);
    } else {
      console.error("Falha ao remover a hard skill.");
    }
  };

  /**
   * Remove uma soft skill do colaborador.
   */
  const removerSoftSkill = async (skillId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/softskill/${skillId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setColaborador(prev => prev ? { ...prev, softSkills: prev.softSkills.filter(s => s.id !== skillId) } : null);
    } else {
      console.error("Falha ao remover a soft skill.");
    }
  };

  /**
   * Lida com o pressionar da tecla Enter para adicionar skills.
   */
  const aoPressionarTecla = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hard' | 'soft') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'hard') adicionarHardSkill();
      if (type === 'soft') adicionarSoftSkill();
    }
  };

  /**
   * Adiciona uma nova experiência.
   */
  const adicionarExperiencia = async () => {
    if (!colaborador || !novaExperiencia.cargo || !novaExperiencia.empresa) return;
    
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
      } else {
        alert('Erro ao adicionar experiência.');
      }
    } catch (error) {
      console.error('Erro ao adicionar experiência:', error);
      alert('Erro ao adicionar experiência.');
    }
  };

  /**
   * Recarrega as experiências do colaborador atual
   */
  const recarregarExperiencias = async () => {
    if (!id || !colaborador) return;
    
    try {
      const colaboradorId = parseInt(id);
      const experiencias = await buscarExperienciasColaborador(colaboradorId);
      
      setColaborador(prev => prev ? {
        ...prev,
        experiencias: experiencias
      } : null);
    } catch (error) {
      console.error('Erro ao recarregar experiências:', error);
    }
  };

  /**
   * Remove uma experiência.
   */
  const removerExperiencia = async (expId: number) => {
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
    } catch (error) {
      console.error('Erro ao remover experiência:', error);
      await recarregarExperiencias();
    }
  };

  /**
   * Adiciona um novo projeto.
   */
  const adicionarProjeto = async () => {
    if (!colaborador || !novoProjeto.nomeProjeto) return;
    
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
      } else {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        alert(`Erro ao adicionar projeto: ${response.status} - ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      alert('Erro ao adicionar projeto. Verifique o console para mais detalhes.');
    }
  };

  /**
   * Remove um projeto.
   */
  const removerProjeto = async (projetoId: number) => {
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
      } else {
        alert('Erro ao remover projeto.');
      }
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      alert('Erro ao remover projeto.');
    }
  };

  // Renderização condicional enquanto os dados estão sendo carregados
  if (carregando) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // Renderização condicional em caso de erro
  if (erro) {
    return <div className="min-h-screen flex items-center justify-center">Erro: {erro}</div>;
  }

  // Renderização condicional se o colaborador não for encontrado
  if (!colaborador) {
    return <div className="min-h-screen flex items-center justify-center">Nenhum dado de colaborador encontrado.</div>;
  }

  const { nome, email, cargo, apresentacao, certificacoes, experiencias, projetos = [], hardSkills, softSkills } = colaborador;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Header com botões */}
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleLogout}
          aria-label="Sair"
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-105 transition-all shadow-lg"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <button
          onClick={() => setModoEscuro(v => !v)}
          aria-label="Alternar tema"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg"
        >
          {modoEscuro ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-800" />
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Seção do perfil principal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-700">
                {colaborador.fotoUrl ? (
                  <img 
                    src={colaborador.fotoUrl} 
                    alt={nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {nome.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
                title="Alterar foto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {emEdicao ? (
                  <input
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={aoMudarPerfil}
                    className="text-3xl font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{nome}</h1>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  {emEdicao ? (
                    <select
                      name="cargo"
                      value={colaborador.cargo?.id || ''}
                      onChange={(e) => {
                        const selectedCargo = cargosDisponiveis.find(c => c.id === parseInt(e.target.value));
                        if (selectedCargo) {
                          setColaborador(prev => prev ? { ...prev, cargo: selectedCargo } : null);
                        }
                      }}
                      className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value="">Selecione um cargo</option>
                      {cargosDisponiveis.map((cargo) => (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.nomeCargo}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{cargo?.nomeCargo || 'N/A'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>{email}</span>
                </div>
              </div>
            </div>

            {emEdicao ? (
              <div className="flex gap-2">
                <button onClick={aoSalvar} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                  Salvar
                </button>
                <button onClick={aoCancelar} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={aoEditar} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg">
                <Edit3 className="h-4 w-4" />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Linha 1: SOBRE MIM - HARD SKILLS - SOFT SKILLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOBRE MIM */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Sobre mim</h2>
            </div>
            {emEdicao ? (
              <textarea
                name="apresentacao"
                value={apresentacao}
                onChange={aoMudarPerfil}
                maxLength={2000}
                className="w-full min-h-48 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm resize-vertical"
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {apresentacao}
              </p>
            )}
          </div>

          {/* HARD SKILLS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <Code className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hard Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {hardSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {skill.nomeCompetencia}
                  <button
                    onClick={() => removerHardSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3 text-blue-900 dark:text-blue-100" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex justify-center mt-auto">
              <div className="flex gap-2 w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Adicionar Hard Skill..."
                  value={novaHardSkill}
                  onChange={(e) => setNovaHardSkill(e.target.value)}
                  onKeyDown={(e) => aoPressionarTecla(e, 'hard')}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm"
                />
                <button
                  onClick={adicionarHardSkill}
                  type="button"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SOFT SKILLS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Soft Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  {skill.nomeCompetencia}
                  <button
                    onClick={() => removerSoftSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3 text-green-900 dark:text-green-100" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex justify-center mt-auto">
              <div className="flex gap-2 w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Adicionar Soft Skill..."
                  value={novaSoftSkill}
                  onChange={(e) => setNovaSoftSkill(e.target.value)}
                  onKeyDown={(e) => aoPressionarTecla(e, 'soft')}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm"
                />
                <button
                  onClick={adicionarSoftSkill}
                  type="button"
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-lg flex items-center justify-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Linha 2: CERTIFICAÇÕES - PROJETOS - COMENTÁRIOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CERTIFICAÇÕES */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Certificações ({certificacoes.length})</h2>
            </div>
            
            {/* Lista de certificações */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {certificacoes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Nenhuma certificação adicionada ainda</p>
                </div>
              ) : (
                certificacoes.map((cert) => (
                  <div key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {cert.nomeCertificacao.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">{cert.nomeCertificacao}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{cert.instituicao}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removerCertificacao(cert.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 flex-shrink-0"
                        title="Remover certificação"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Adicionar nova certificação */}
            <div className="mt-4 pt-4">
              <div className="flex flex-col gap-2">
                <select
                  value={certificacaoSelecionada}
                  onChange={(e) => setCertificacaoSelecionada(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm"
                >
                  <option value="">Selecione uma certificação</option>
                  {certificacoesDisponiveis
                    .filter(cert => !certificacoes.some(c => c.id === cert.id))
                    .map((cert) => (
                      <option key={cert.id} value={cert.id}>
                        {cert.nomeCertificacao}
                      </option>
                    ))}
                </select>
                <button
                  onClick={adicionarCertificacao}
                  disabled={!certificacaoSelecionada}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Certificação
                </button>
              </div>
            </div>
          </div>

          {/* PROJETOS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <FolderOpen className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Projetos ({projetos.length})</h2>
            </div>
            
            {/* Lista de projetos */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {projetos.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Nenhum projeto adicionado ainda</p>
                </div>
              ) : (
                projetos.map((proj) => (
                  <div key={proj.id} className="p-3 bg-green-50 dark:bg-gray-700 rounded-xl border border-green-200 dark:border-gray-600 group">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{proj.nomeProjeto}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{proj.descricao}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                          <Code className="h-3 w-3 inline mr-1" />
                          {proj.tecnologias}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {proj.dataInicio ? new Date(proj.dataInicio).toLocaleDateString() : 'N/A'} - {proj.dataFim ? new Date(proj.dataFim).toLocaleDateString() : 'Presente'}
                        </p>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:text-blue-700 underline inline-block mt-1">
                            Ver projeto →
                          </a>
                        )}
                      </div>
                      <button onClick={() => removerProjeto(proj.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 flex-shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Formulário de novo projeto */}
            <div className="mt-4 pt-4">
              <div className="flex flex-col gap-2">
                <input 
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" 
                  placeholder="Nome do Projeto" 
                  value={novoProjeto.nomeProjeto} 
                  onChange={(e)=>setNovoProjeto(v=>({...v,nomeProjeto:e.target.value}))} 
                />
                <input 
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" 
                  placeholder="Tecnologias (ex: React, Node.js, PostgreSQL)" 
                  value={novoProjeto.tecnologias} 
                  onChange={(e)=>setNovoProjeto(v=>({...v,tecnologias:e.target.value}))} 
                />
                <textarea
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm resize-none"
                  placeholder="Descrição do projeto..."
                  rows={2}
                  value={novoProjeto.descricao} 
                  onChange={(e)=>setNovoProjeto(v=>({...v,descricao:e.target.value}))} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" 
                    type="date" 
                    placeholder="Data Início"
                    value={novoProjeto.dataInicio} 
                    onChange={(e)=>setNovoProjeto(v=>({...v,dataInicio:e.target.value}))} 
                  />
                  <input 
                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" 
                    type="date" 
                    placeholder="Data Fim (opcional)"
                    value={novoProjeto.dataFim} 
                    onChange={(e)=>setNovoProjeto(v=>({...v,dataFim:e.target.value}))} 
                  />
                </div>
                <input 
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700 text-sm" 
                  placeholder="Link (opcional)" 
                  value={novoProjeto.link} 
                  onChange={(e)=>setNovoProjeto(v=>({...v,link:e.target.value}))} 
                />
                <button 
                  onClick={adicionarProjeto} 
                  disabled={!novoProjeto.nomeProjeto.trim()}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Projeto
                </button>
              </div>
            </div>
          </div>

          {/* COMENTÁRIOS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Comentários ({comentarios.length})</h2>
              </div>
            </div>
            
            {/* Lista de comentários */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {carregandoComentarios ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Carregando comentários...</p>
                </div>
              ) : comentarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Nenhum comentário ainda</p>
                </div>
              ) : (
                comentarios.map((comentario) => (
                  <div key={comentario.idComentario} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {comentario.nomeColaboradorOrigem?.substring(0, 2).toUpperCase() || 'NN'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{comentario.nomeColaboradorOrigem || 'Desconhecido'}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatarData(comentario.dataComentario)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{comentario.textoComentario}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Formulário para novo comentário (apenas para admins) */}
            {isAdmin && (
              <div className="border-t dark:border-gray-600 pt-4">
                <textarea
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Adicionar comentário sobre este colaborador..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={2}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{novoComentario.length}/500</span>
                  <button
                    onClick={adicionarComentario}
                    disabled={!novoComentario.trim()}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Experiências Editável */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Experiência Profissional</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            {experiencias.map((exp) => (
              <div key={exp.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{exp.cargo}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.empresa}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(exp.dataInicio).toLocaleDateString()} - {exp.dataFim ? new Date(exp.dataFim).toLocaleDateString() : 'Presente'}
                    </p>
                  </div>
                  <button onClick={() => removerExperiencia(exp.id)} className="text-red-600 hover:text-red-700 text-sm px-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Formulário para adicionar nova experiência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-xl">
            <input
              type="text"
              placeholder="Cargo"
              value={novaExperiencia.cargo}
              onChange={(e) => setNovaExperiencia(prev => ({ ...prev, cargo: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="text"
              placeholder="Empresa"
              value={novaExperiencia.empresa}
              onChange={(e) => setNovaExperiencia(prev => ({ ...prev, empresa: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="date"
              value={novaExperiencia.dataInicio}
              onChange={(e) => setNovaExperiencia(prev => ({ ...prev, dataInicio: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="date"
              value={novaExperiencia.dataFim}
              onChange={(e) => setNovaExperiencia(prev => ({ ...prev, dataFim: e.target.value }))}
              placeholder="Data Fim (opcional)"
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm"
            />
            <button
              onClick={adicionarExperiencia}
              className="md:col-span-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg flex items-center gap-2 justify-center"
            >
              <Plus className="h-4 w-4" />
              Adicionar Experiência
            </button>
          </div>
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Altave. Sistema de Gestão de Competências.
          </p>
        </div>
      </div>
    </div>
  );
}