import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DISCRedirectProps {
  children: React.ReactNode;
}

export default function DISCRedirect({ children }: DISCRedirectProps) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verificarPerfilDISC = async () => {
      if (!usuario) {
        setIsChecking(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_BASE_URL}/api/disc/usuario/${usuario.id}/possui-perfil`);
        
        if (response.ok) {
          const possuiPerfil = await response.json();
          
          // Se não possui perfil e não está na página do questionário ou resultado, redirecionar
          if (!possuiPerfil &&
              !window.location.pathname.includes('/disc/questionario') && 
              !window.location.pathname.includes('/disc/resultado')) {
            navigate('/disc/questionario');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar perfil DISC:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verificarPerfilDISC();
  }, [usuario, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Verificando perfil...</h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
