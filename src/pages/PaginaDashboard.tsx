import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BarChart2, AlertTriangle, ArrowLeft, Sun, Moon, Award, Code, User as UserIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';


interface HardSkillItem {
  id: number;
  nomeCompetencia: string;
  colaboradorId?: number;
}

interface SoftSkillItem {
  id: number;
  nomeCompetencia: string;
}

export default function PaginaDashboard() {
  const [numColaboradores, setNumColaboradores] = useState(0);
  const [numCompetencias, setNumCompetencias] = useState(0);
  const [numDesatualizados] = useState<number | string>('N/A');
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'colaboradores'
  const { colaborador } = useAuth();
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();

  // dados de skills
  const [hardSkills, setHardSkills] = useState<HardSkillItem[]>([]);
  const [softSkills, setSoftSkills] = useState<SoftSkillItem[]>([]);
  const [loadingKpis, setLoadingKpis] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [topCerts] = useState<Array<[string, number]>>([]);

  useEffect(() => {
    if (view !== 'dashboard' || !colaborador) return;
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
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      if (!root || !root.classList) return;
  
      if (modoEscuro) {
        root.classList.add('dark');
        if (typeof window !== 'undefined' && window.localStorage?.setItem) {
          window.localStorage.setItem('theme', 'dark');
        }
      } else {
        root.classList.remove('dark');
        if (typeof window !== 'undefined' && window.localStorage?.setItem) {
          window.localStorage.setItem('theme', 'light');
        }
      }
    } catch (err) {
      // Em caso de erro, loga e continua renderizando a UI
      console.error('Theme effect error:', err);
    }
  }, [modoEscuro]);
  
  // carregar listas de skills para gráficos reais
  useEffect(() => {
    if (view !== 'dashboard' || !colaborador) return;
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
  const contarPorNome = (items: { nomeCompetencia: string }[]) => {
    const map = new Map<string, number>();
    for (const it of items) {
      const key = (it.nomeCompetencia || '').trim();
      if (!key) continue;
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
    return (
      <div className="p-8">
        <Button onClick={() => setView('dashboard')} className="mb-4 bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
        <VisaoColaboradores />
      </div>
    );
  }

  return (
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <button
          onClick={() => setModoEscuro(v => !v)}
          aria-label="Alternar tema"
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow"
        >
          {modoEscuro ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-800" />
          )}
        </button>

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Dashboard Executivo</h1>
            <h2 className="text-lg text-gray-600 dark:text-gray-300 mt-2">📊 Visão geral de competências e talentos</h2>
          </div>
          {colaborador && (
            <Button onClick={() => navigate(`/perfil/${colaborador.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserIcon className="mr-2 h-4 w-4" /> Meu Perfil
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100 mb-4">Colaboradores</CardTitle>
            <Users className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{loadingKpis ? '—' : numColaboradores}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total na organização</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100 mb-4">Competências Mapeadas</CardTitle>
            <BarChart2 className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">{loadingKpis ? '—' : numCompetencias}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Do catálogo corporativo</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100 mb-4">Desatualizados</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numDesatualizados}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Competências Reais */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-semibold dark:text-gray-100">Top 10 Hard Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSkills ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Carregando…</div>
            ) : topHard.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Sem dados de hard skills.</div>
            ) : (
              <div className="space-y-3">
                {topHard.map(([nome, qtd]) => (
                  <div key={nome} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-4 truncate text-xs md:text-sm text-gray-700 dark:text-gray-200">{nome}</div>
                    <div className="col-span-7">
                      <div className="h-3 bg-blue-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 dark:bg-blue-600"
                          style={{ width: `${Math.max(8, (qtd / maxHardCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 text-right text-xs text-gray-600 dark:text-gray-300">{qtd}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base font-semibold dark:text-gray-100">Top 10 Soft Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSkills ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Carregando…</div>
            ) : topSoft.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Sem dados de soft skills.</div>
            ) : (
              <div className="space-y-3">
                {topSoft.map(([nome, qtd]) => (
                  <div key={nome} className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-4 truncate text-xs md:text-sm text-gray-700 dark:text-gray-200">{nome}</div>
                    <div className="col-span-7">
                      <div className="h-3 bg-green-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 dark:bg-green-600"
                          style={{ width: `${Math.max(8, (qtd / maxSoftCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-1 text-right text-xs text-gray-600 dark:text-gray-300">{qtd}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Certificações do Time */}
      <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-xl rounded-2xl mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-base font-semibold dark:text-gray-100">Top 3 Certificações</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {topCerts.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400">Sem dados de certificações.</div>
          ) : (
            <div className="space-y-3">
              {topCerts.map(([nome, qtd]) => (
                <div key={nome} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{nome}</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">{qtd}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Removido: Ranking de Colaboradores por Competências */}

      <footer className="flex justify-start">
        <Button onClick={() => setView('colaboradores')} className="bg-blue-600 hover:bg-blue-700 text-white">
          🔍 Buscar Talentos
        </Button>
      </footer>
    </div>
  );
}
