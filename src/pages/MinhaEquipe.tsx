import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon } from 'lucide-react';
import BadgeDISC from '../components/BadgeDISC';
import './MinhaEquipe.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  perfil?: number;
}

interface EquipeData {
  isDiretor: boolean;
  isSupervisor: boolean;
  nome: string;
  supervisores?: Colaborador[];
  colaboradores?: Colaborador[];
  diretor?: Colaborador;
  minhaEquipe?: Colaborador[];
  outrosSupervisores?: Colaborador[];
  supervisor?: Colaborador;
  colegas?: Colaborador[];
  success: boolean;
}

export default function MinhaEquipe() {
  const [equipe, setEquipe] = useState<EquipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();
  const { colaborador } = useAuth();
  
  const colaboradorId = colaborador?.id;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (modoEscuro) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [modoEscuro]);

  useEffect(() => {
    async function loadEquipe() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/equipe/minha/${colaboradorId}`);
        const data = await response.json();
        
        if (data.success) {
          setEquipe(data);
        }
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
      } finally {
        setLoading(false);
      }
    }

    if (colaboradorId) {
      loadEquipe();
    }
  }, [colaboradorId]);

  const handleCardClick = (id: number) => {
    navigate(`/supervisor/profile/${id}`);
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!equipe) return <div className="error">Erro ao carregar equipe</div>;

  return (
    <div className="minha-equipe-container">
      {/* Botão de tema */}
      <button
        onClick={() => setModoEscuro(v => !v)}
        aria-label="Alternar tema"
        className="fixed top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg z-10"
      >
        {modoEscuro ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800" />
        )}
      </button>

      <h1>Minha Equipe</h1>
      <p className="subtitle">Olá, {equipe.nome}!</p>

      {/* VISUALIZAÇÃO PARA DIRETOR */}
      {equipe.isDiretor && (
        <>
          <section className="secao-equipe">
            <h2>📊 Supervisores ({equipe.supervisores?.length || 0})</h2>
            <div className="grid-cards">
              {equipe.supervisores?.map((sup) => (
                <div 
                  key={sup.id} 
                  className="card-colaborador supervisor"
                  onClick={() => handleCardClick(sup.id)}
                >
                  <div className="card-header">
                    <span className="badge">SUPERVISOR</span>
                  </div>
                  <h3>{sup.nome}</h3>
                  <p className="cargo">{sup.cargo}</p>
                  <p className="email">{sup.email}</p>
                  {sup.perfil && (
                    <div className="mt-2">
                      <BadgeDISC usuarioId={sup.perfil} size="sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="secao-equipe">
            <h2>👥 Todos os Colaboradores ({equipe.colaboradores?.length || 0})</h2>
            <div className="grid-cards">
              {equipe.colaboradores?.map((colab) => (
                <div 
                  key={colab.id} 
                  className="card-colaborador"
                  onClick={() => handleCardClick(colab.id)}
                >
                  <h3>{colab.nome}</h3>
                  <p className="cargo">{colab.cargo}</p>
                  <p className="email">{colab.email}</p>
                  {colab.perfil && (
                    <div className="mt-2">
                      <BadgeDISC usuarioId={colab.perfil} size="sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* VISUALIZAÇÃO PARA SUPERVISOR */}
      {equipe.isSupervisor && !equipe.isDiretor && (
        <>
          <section className="secao-equipe">
            <h2>👔 Meu Diretor</h2>
            <div className="card-colaborador diretor" onClick={() => handleCardClick(equipe.diretor!.id)}>
              <div className="card-header">
                <span className="badge diretor-badge">DIRETOR</span>
              </div>
              <h3>{equipe.diretor?.nome}</h3>
              <p className="cargo">{equipe.diretor?.cargo}</p>
              <p className="email">{equipe.diretor?.email}</p>
            </div>
          </section>

          <section className="secao-equipe">
            <h2>🎯 Minha Equipe ({equipe.minhaEquipe?.length || 0})</h2>
            <div className="grid-cards">
              {equipe.minhaEquipe?.map((colab) => (
                <div 
                  key={colab.id} 
                  className="card-colaborador"
                  onClick={() => handleCardClick(colab.id)}
                >
                  <h3>{colab.nome}</h3>
                  <p className="cargo">{colab.cargo}</p>
                  <p className="email">{colab.email}</p>
                  {colab.perfil && (
                    <div className="mt-2">
                      <BadgeDISC usuarioId={colab.perfil} size="sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="secao-equipe">
            <h2>👥 Outros Supervisores</h2>
            <div className="grid-cards">
              {equipe.outrosSupervisores?.map((sup) => (
                <div 
                  key={sup.id} 
                  className="card-colaborador supervisor"
                  onClick={() => handleCardClick(sup.id)}
                >
                  <div className="card-header">
                    <span className="badge">SUPERVISOR</span>
                  </div>
                  <h3>{sup.nome}</h3>
                  <p className="cargo">{sup.cargo}</p>
                  <p className="email">{sup.email}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* VISUALIZAÇÃO PARA COLABORADOR */}
      {!equipe.isDiretor && !equipe.isSupervisor && (
        <>
          <section className="secao-equipe">
            <h2>👔 Meu Supervisor</h2>
            <div className="card-colaborador supervisor" onClick={() => handleCardClick(equipe.supervisor!.id)}>
              <div className="card-header">
                <span className="badge">SUPERVISOR</span>
              </div>
              <h3>{equipe.supervisor?.nome}</h3>
              <p className="cargo">{equipe.supervisor?.cargo}</p>
              <p className="email">{equipe.supervisor?.email}</p>
            </div>
          </section>

          <section className="secao-equipe">
            <h2>👥 Meus Colegas de Equipe ({equipe.colegas?.length || 0})</h2>
            <div className="grid-cards">
              {equipe.colegas?.map((colega) => (
                <div 
                  key={colega.id} 
                  className="card-colaborador"
                  onClick={() => handleCardClick(colega.id)}
                >
                  <h3>{colega.nome}</h3>
                  <p className="cargo">{colega.cargo}</p>
                  <p className="email">{colega.email}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
