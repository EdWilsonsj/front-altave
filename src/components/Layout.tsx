import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Colaborador {
  id: number;
  perfil: number;
}

const Layout: React.FC = () => {
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
        // Not a supervisor, redirect to their own profile
        navigate(`/profile/${parsedColaborador.id}`);
      }
    } else {
      // No user data, redirect to login
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
      <main className="flex-1 p-8 bg-altave-background dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
