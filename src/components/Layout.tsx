import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Usuario {
  id: number;
  role: string;
}

interface Colaborador {
  id: number;
  perfil: number;
}

const Layout: React.FC = () => {
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsuario = localStorage.getItem('usuario');
    const storedColaborador = localStorage.getItem('colaborador');
    
    if (storedUsuario && storedColaborador) {
      const parsedUsuario: Usuario = JSON.parse(storedUsuario);
      const parsedColaborador: Colaborador = JSON.parse(storedColaborador);
      
      // Apenas usuários ADMIN podem acessar o layout com sidebar
      if (parsedUsuario.role === 'ADMIN') {
        setColaborador(parsedColaborador);
      } else {
        // Redireciona usuários não-admin para seu perfil
        navigate(`/profile/${parsedColaborador.id}`);
      }
    } else {
      // Sem dados de usuário, redireciona para login
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
