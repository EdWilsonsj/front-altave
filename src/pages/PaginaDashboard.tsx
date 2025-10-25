import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BarChart2, AlertTriangle, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';
import { lazy, Suspense } from 'react';
// @ts-expect-error – importando com extensão de propósito
const CompetenciasChart = lazy(() => import(/* @vite-ignore */ '../components/dashboard/CompetenciasChart.tsx'));

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Interfaces que espelham os modelos do backend
interface Cargo {
  nomeCargo: string;
}

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  apresentacao: string;
  perfil: number;
  cargo: Cargo;
}

export default function PaginaDashboard() {
  const [numColaboradores, setNumColaboradores] = useState(0);
  const [numCompetencias, setNumCompetencias] = useState(0);
  const [numDesatualizados, _setNumDesatualizados] = useState<number | string>('N/A');
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'colaboradores'
  const { colaborador } = useAuth();
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });
  

  useEffect(() => {
    if (view === 'dashboard' && colaborador) {
      // Fetch collaborators
      fetch(`${API_BASE_URL}/api/colaborador`)
        .then(response => response.json())
        .then(data => {
          setNumColaboradores(data.length);
          // TODO: Implementar a lógica de desatualizados
        })
        .catch(() => {
          setNumColaboradores(0);
        });

      // Fetch competencies
      fetch(`${API_BASE_URL}/api/competencia`)
        .then(response => response.json())
        .then(data => {
          setNumCompetencias(data.length);
        })
        .catch(() => {
          setNumCompetencias(0);
        });
    }
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
  
  
  // O ProtectedRoute já garante que o usuário é admin e está autenticado

  if (view === 'colaboradores') {
    return (
      <div className="p-8">
        <Button onClick={() => setView('dashboard')} className="mb-4 bg-gray-600 hover:bg-gray-700 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
        <VisaoColaboradores />
      </div>
    );
  }

  return (
      <div className="relative min-h-screen bg-white dark:bg-gray-900 p-8">
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
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Dashboard Executivo</h1>
        <h2 className="text-2xl text-center text-gray-600 dark:text-gray-300 mt-4">📊 Painel de Gestão de Talentos</h2>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100 mb-4">Colaboradores</CardTitle>
            <Users className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numColaboradores}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+10 esse mês</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-100 mb-4">Competências</CardTitle>
            <BarChart2 className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numCompetencias}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mapeadas</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center mb-8">
      + <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">📈 Gráfico Interativo: Top 10 Competências por Equipe</h3>
      <Suspense fallback={null}>
        <CompetenciasChart />
      </Suspense>
      </div>

      <footer className="flex justify-between">
        <Button onClick={() => setView('colaboradores')} className="bg-blue-600 hover:bg-blue-700 text-white">
          🔍 Buscar Talentos
        </Button>
        <Button
          variant="outline"
          className="text-gray-600 dark:text-gray-100 border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          📄 Relatórios Avançados
        </Button>
      </footer>
    </div>
  );
}
