import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';

interface SupervisorLayoutProps {
  children: React.ReactNode;
}

const SupervisorLayout: React.FC<SupervisorLayoutProps> = ({ children }) => {
  const { colaborador } = useAuth();

  // O ProtectedRoute já garante que o usuário está autenticado e é admin
  // Então aqui só precisamos renderizar o layout
  return (
    <div className="flex min-h-screen">
      <Sidebar userId={colaborador!.id} />
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 w-full md:w-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default SupervisorLayout;
