import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isAdmin, isLoading, colaborador } = useAuth();
  const location = useLocation();
  const params = useParams();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Verificar se está autenticado
  if (!isAuthenticated) {
    // Salvar a localização atual para redirecionar após login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Verificar se é necessário ser admin
  if (requireAdmin && !isAdmin) {
    // Se não é admin, redirecionar para o perfil do usuário
    return <Navigate to={`/profile/${colaborador?.id}`} replace />;
  }

  // Se a rota NÃO exige admin (ex.: /profile/:id), garantir que o usuário só acesse o próprio perfil
  if (!requireAdmin && params?.id) {
    const requestedId = Number(params.id);
    if (colaborador?.id != null && requestedId !== colaborador.id) {
      return <Navigate to={`/profile/${colaborador.id}`} replace />;
    }
  }

  // Se todas as verificações passaram, renderizar os children
  return <>{children}</>;
};

export default ProtectedRoute;