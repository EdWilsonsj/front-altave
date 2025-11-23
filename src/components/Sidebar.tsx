import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const linkClasses = (path: string) => {
    return location.pathname === path
      ? 'flex items-center p-3 bg-blue-600 text-white rounded-lg'
      : 'flex items-center p-3 text-gray-800 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-altave-background dark:bg-gray-800 p-4 flex flex-col shadow-lg">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-altave-primary dark:text-blue-400">Altave</h1>
        <p className="text-sm text-altave-text dark:text-gray-400">Gestão de Talentos</p>
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {/* Menu de navegação */}
        <Link to={`/supervisor/profile/${userId}`} className={linkClasses(`/supervisor/profile/${userId}`)}>
          <User className="mr-3 h-6 w-6" />
          <span>Meu Perfil</span>
        </Link>
        <Link to="/minha-equipe" className={linkClasses('/minha-equipe')}>
          <Users className="mr-3 h-6 w-6" />
          <span>Minha Equipe</span>
        </Link>
        <Link to="/dashboard" className={linkClasses('/dashboard')}>
          <LayoutDashboard className="mr-3 h-6 w-6" />
          <span>Dashboard</span>
        </Link>
      </nav>
      
      {/* Botão de Logout */}
      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-6 w-6" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;