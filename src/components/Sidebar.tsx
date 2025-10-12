import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  userId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ userId }) => {
  const location = useLocation();

  const linkClasses = (path: string) => {
    return location.pathname === path
      ? 'flex items-center p-3 bg-altave-primary text-white rounded-lg'
      : 'flex items-center p-3 text-altave-text hover:bg-altave-soft-blue dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors';
  };

  return (
    <div className="w-64 h-screen bg-altave-background dark:bg-gray-800 p-4 flex flex-col shadow-lg">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-altave-primary dark:text-blue-400">Altave</h1>
        <p className="text-sm text-altave-text dark:text-gray-400">Gestão de Talentos</p>
      </div>
      <nav className="flex flex-col gap-4">
        <Link to={`/supervisor/profile/${userId}`} className={linkClasses(`/supervisor/profile/${userId}`)}>
          <User className="mr-3 h-6 w-6" />
          <span>Meu Perfil</span>
        </Link>
        <Link to="/dashboard" className={linkClasses('/dashboard')}>
          <LayoutDashboard className="mr-3 h-6 w-6" />
          <span>Dashboard</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;