import React, { useState, useEffect, useMemo } from 'react';
import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';



interface Colaborador {
  id: number;
  nome: string;
  cargo: {
    nomeCargo: string;
  } | null;
  email: string;
}

export default function VisaoColaboradores() {
  const navigate = useNavigate();
  const [listaColaboradores, setListaColaboradores] = useState<Colaborador[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [hardPorColab, setHardPorColab] = useState<Map<number, number>>(new Map());
  const [softPorColab, setSoftPorColab] = useState<Map<number, number>>(new Map());
  const [detalhesSelecionado, setDetalhesSelecionado] = useState<{ hard: string[]; soft: string[] } | null>(null);
  const [hardPorColabNomes, setHardPorColabNomes] = useState<Map<number, Set<string>>>(new Map());
  const [softPorColabNomes, setSoftPorColabNomes] = useState<Map<number, Set<string>>>(new Map());
  const [certPorColabNomes, setCertPorColabNomes] = useState<Map<number, Set<string>>>(new Map());
  const [filtroHard, setFiltroHard] = useState('');
  const [filtroSoft, setFiltroSoft] = useState('');
  const [filtroCert, setFiltroCert] = useState('');
  const [hardOpcoes, setHardOpcoes] = useState<string[]>([]);
  const [softOpcoes, setSoftOpcoes] = useState<string[]>([]);
  const [certOpcoes, setCertOpcoes] = useState<string[]>([]);


  const pegaTodaAGalerinha = async () => {
    setCarregando(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/colaborador`);
      const data = await response.json();
      setListaColaboradores(data);
      // montar mapa de certificacoes por colaborador (se vierem no payload)
      const certMap = new Map<number, Set<string>>();
      for (const c of data) {
        const lista = Array.isArray(c?.certificacoes) ? c.certificacoes : [];
        for (const cert of lista) {
          if (!cert?.nomeCertificacao) continue;
          const set = certMap.get(c.id) || new Set<string>();
          set.add(cert.nomeCertificacao);
          certMap.set(c.id, set);
        }
      }
      setCertPorColabNomes(certMap);
    } catch (erro) {
      console.error("Falha ao buscar colaboradores:", erro);
      // mostrar um estado de erro na tela no futuro
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    pegaTodaAGalerinha();
  }, []);

  // Carrega contagem de skills por colaborador para visão clara
  useEffect(() => {
    const carregarContagens = async () => {
      try {
        const [hardRes, softRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/hardskill`),
          fetch(`${API_BASE_URL}/api/softskill`)
        ]);
        const hard = hardRes.ok ? await hardRes.json() : [];
        const soft = softRes.ok ? await softRes.json() : [];

        const hMap = new Map<number, number>();
        const hNames = new Map<number, Set<string>>();
        for (const h of hard) {
          const id = h?.colaborador?.id;
          if (typeof id === 'number') hMap.set(id, (hMap.get(id) || 0) + 1);
          if (typeof id === 'number' && h?.nomeCompetencia) {
            const set = hNames.get(id) || new Set<string>();
            set.add(h.nomeCompetencia);
            hNames.set(id, set);
          }
        }
        const sMap = new Map<number, number>();
        const sNames = new Map<number, Set<string>>();
        for (const s of soft) {
          const id = s?.colaborador?.id;
          if (typeof id === 'number') sMap.set(id, (sMap.get(id) || 0) + 1);
          if (typeof id === 'number' && s?.nomeCompetencia) {
            const set = sNames.get(id) || new Set<string>();
            set.add(s.nomeCompetencia);
            sNames.set(id, set);
          }
        }
        setHardPorColab(hMap);
        setSoftPorColab(sMap);
        setHardPorColabNomes(hNames);
        setSoftPorColabNomes(sNames);

        // opções de filtro
        const hardOpts = Array.from(new Set(hard.map((x: any) => x?.nomeCompetencia).filter((v): v is string => typeof v === 'string' && v.length > 0))).sort();
        const softOpts = Array.from(new Set(soft.map((x: any) => x?.nomeCompetencia).filter((v): v is string => typeof v === 'string' && v.length > 0))).sort();
        setHardOpcoes(hardOpts);
        setSoftOpcoes(softOpts);
      } catch (_) {
        setHardPorColab(new Map());
        setSoftPorColab(new Map());
        setHardPorColabNomes(new Map());
        setSoftPorColabNomes(new Map());
      }
    };
    carregarContagens();
  }, []);

  // Ao selecionar colaborador, buscar detalhes de skills para painel
  useEffect(() => {
    const carregarDetalhes = async () => {
      if (!colaboradorSelecionado) { setDetalhesSelecionado(null); return; }
      try {
        const res = await fetch(`${API_BASE_URL}/api/colaborador/${colaboradorSelecionado.id}`);
        if (!res.ok) { setDetalhesSelecionado(null); return; }
        const data = await res.json();
        const hard = Array.isArray(data?.hardSkills) ? data.hardSkills.map((s: any) => s.nomeCompetencia) : [];
        const soft = Array.isArray(data?.softSkills) ? data.softSkills.map((s: any) => s.nomeCompetencia) : [];
        setDetalhesSelecionado({ hard, soft });
      } catch (_) {
        setDetalhesSelecionado(null);
      }
    };
    carregarDetalhes();
  }, [colaboradorSelecionado]);

  const handleProfileClick = () => {
    if (!colaboradorSelecionado) return;
    const profileId = colaboradorSelecionado.email === 'admin@altave.com.br' ? 1 : colaboradorSelecionado.id;
    navigate(`/supervisor/profile/${profileId}`);
  };

  // opções de certificações para filtro (derivado dos colaboradores carregados)
  useEffect(() => {
    const all = new Set<string>();
    for (const set of certPorColabNomes.values()) {
      for (const name of set.values()) all.add(name);
    }
    setCertOpcoes(Array.from(all.values()).sort());
  }, [certPorColabNomes]);

  // Filtra a lista de colaboradores com base no termo e filtros
  const colaboradoresFiltrados = useMemo(() => {
    return listaColaboradores.filter(c => {
      const termoOk = c.nome.toLowerCase().includes(termoBusca.toLowerCase());
      if (!termoOk) return false;
      if (filtroHard) {
        const set = hardPorColabNomes.get(c.id);
        if (!set || !set.has(filtroHard)) return false;
      }
      if (filtroSoft) {
        const set = softPorColabNomes.get(c.id);
        if (!set || !set.has(filtroSoft)) return false;
      }
      if (filtroCert) {
        const set = certPorColabNomes.get(c.id);
        if (!set || !set.has(filtroCert)) return false;
      }
      return true;
    });
  }, [listaColaboradores, termoBusca, filtroHard, filtroSoft, filtroCert, hardPorColabNomes, softPorColabNomes, certPorColabNomes]);

  return (
    <div className="h-full flex flex-col gap-6">
    
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Visão de Colaboradores</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pesquise e visualize os perfis dos colaboradores.</p>
        <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Pesquisar por nome..."
              value={termoBusca}
              onChange={e => setTermoBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
            />
          </div>
          <select value={filtroHard} onChange={e=>setFiltroHard(e.target.value)} className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <option value="">Filtrar por Hard Skill</option>
            {hardOpcoes.map(op => (<option key={op} value={op}>{op}</option>))}
          </select>
          <select value={filtroSoft} onChange={e=>setFiltroSoft(e.target.value)} className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <option value="">Filtrar por Soft Skill</option>
            {softOpcoes.map(op => (<option key={op} value={op}>{op}</option>))}
          </select>
          <select value={filtroCert} onChange={e=>setFiltroCert(e.target.value)} className="px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <option value="">Filtrar por Certificação</option>
            {certOpcoes.map(op => (<option key={op} value={op}>{op}</option>))}
          </select>
        </div>
      </div>

      {/* Conteúdo Principal: Lista e Painel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Colaboradores */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Todos os Colaboradores</h3>
          {carregando ? (
            <p>Carregando...</p>
          ) : (
            <ul className="space-y-3">
              {colaboradoresFiltrados.map(colab => {
                const hard = hardPorColab.get(colab.id) || 0;
                const soft = softPorColab.get(colab.id) || 0;
                return (
                <li 
                    key={colab.id} 
                    onClick={() => setColaboradorSelecionado(colab)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${colaboradorSelecionado?.id === colab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{colab.nome}</p>
                        <p className={`${colaboradorSelecionado?.id === colab.id ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'} text-sm`}>{colab.cargo?.nomeCargo}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${colaboradorSelecionado?.id === colab.id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'}`}>Hard {hard}</span>
                        <span className={`px-2 py-1 rounded-full ${colaboradorSelecionado?.id === colab.id ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>Soft {soft}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Painel de Detalhes do Colaborador */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {colaboradorSelecionado ? (
            <div>
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {colaboradorSelecionado.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{colaboradorSelecionado.nome}</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">{colaboradorSelecionado.cargo?.nomeCargo}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{colaboradorSelecionado.email}</p>
                    </div>
                </div>
        
                {/* Perfil resumido do colaborador selecionado */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Sobre</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{(detalhesSelecionado as any)?.apresentacao || 'Sem apresentação.'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Hard Skills</h4>
                    {detalhesSelecionado?.hard?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {detalhesSelecionado.hard.map((h, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">{h}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-300">Sem hard skills cadastradas.</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Soft Skills</h4>
                    {detalhesSelecionado?.soft?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {detalhesSelecionado.soft.map((s, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-300">Sem soft skills cadastradas.</p>
                    )}
                  </div>
                </div>
                {/* Certificações resumidas */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Certificações</h4>
                  {(() => {
                    const set = certPorColabNomes.get(colaboradorSelecionado.id);
                    if (!set || set.size === 0) return <p className="text-sm text-gray-500 dark:text-gray-300">Sem certificações.</p>;
                    return <div className="flex flex-wrap gap-2">{Array.from(set.values()).map((n, idx)=>(<span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">{n}</span>))}</div>;
                  })()}
                </div>

                {/* Ações removidas: exibição direta do perfil resumido aqui */}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <User className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold">Selecione um colaborador</h3>
              <p>Clique em um nome na lista para ver os detalhes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
