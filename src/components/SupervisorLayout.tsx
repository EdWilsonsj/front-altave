import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Colaborador {
  id: number;
  perfil: number;
}

const SupervisorLayout: React.FC = () => {
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedColaborador = localStorage.getItem('colaborador');
    if (storedColaborador) {
      const parsedColaborador = JSON.parse(storedColaborador);
      if (parsedColaborador.perfil >= 1) {
        setColaborador(parsedColaborador);
      } else {
        // Should not happen if login navigation is correct, but as a safeguard:
        navigate(`/profile/${parsedColaborador.id}`);
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  if (loading || !colaborador) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex">
      <Sidebar userId={colaborador.id} />
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default SupervisorLayout;
