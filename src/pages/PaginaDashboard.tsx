import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BarChart2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompetenciasChart from '../components/dashboard/CompetenciasChart';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';

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
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    const storedColaborador = localStorage.getItem('colaborador');
    
    if (storedUsuario && storedColaborador) {
      const parsedUsuario = JSON.parse(storedUsuario);
      const parsedColaborador = JSON.parse(storedColaborador);
      
      // Apenas usuários ADMIN podem acessar o dashboard
      if (parsedUsuario.role === 'ADMIN') {
        setColaborador(parsedColaborador);
        setLoading(false);
      } else {
        // Redireciona usuários não-admin para seu perfil
        navigate(`/profile/${parsedColaborador.id}`);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (view === 'dashboard' && colaborador) {
      console.log('Carregando dados do dashboard...');
      
      // Fetch collaborators
      fetch(`${API_BASE_URL}/api/colaborador`)
        .then(response => {
          console.log('Response colaboradores:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('Dados colaboradores:', data);
          setNumColaboradores(data.length);
          // TODO: Implementar a lógica de desatualizados
        })
        .catch(error => {
          console.error('Erro ao buscar colaboradores:', error);
          setNumColaboradores(0);
        });

      // Fetch competencies
      fetch(`${API_BASE_URL}/api/competencia`)
        .then(response => {
          console.log('Response competências:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('Dados competências:', data);
          setNumCompetencias(data.length);
        })
        .catch(error => {
          console.error('Erro ao buscar competências:', error);
          setNumCompetencias(0);
        });
    }
  }, [view, colaborador]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando acesso...</div>;
  }

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
    <div className="min-h-screen bg-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Executivo</h1>
        <h2 className="text-2xl text-center text-gray-600 mt-4">📊 Painel de Gestão de Talentos</h2>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            <Users className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numColaboradores}</div>
            <p className="text-xs text-gray-500">+10 esse mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competências</CardTitle>
            <BarChart2 className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numCompetencias}</div>
            <p className="text-xs text-gray-500">Mapeadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desatualizados</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">{numDesatualizados}</div>
            <p className="text-xs text-gray-500">Requer atenção</p>
          </CardContent>
        </Card>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Gráfico Interativo: Top 10 Competências por Equipe</h3>
        <CompetenciasChart />
      </div>

      <footer className="flex justify-between">
        <Button onClick={() => setView('colaboradores')} className="bg-blue-600 hover:bg-blue-700 text-white">
          🔍 Buscar Talentos
        </Button>
        <Button variant="outline" className="text-gray-600">
          📄 Relatórios Avançados
        </Button>
      </footer>
    </div>
  );
}
