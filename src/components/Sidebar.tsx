import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut, Users, ChevronLeft, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ userId }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);
      if (!isMobileNow) {
        setIsMobileOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const linkClasses = (path: string) => {
    const baseClasses = 'flex items-center p-3 rounded-lg transition-colors';
    const activeClasses = 'bg-blue-600 text-white';
    const inactiveClasses = 'text-gray-800 hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700';
    
    let finalClasses = `${baseClasses} ${location.pathname === path ? activeClasses : inactiveClasses}`;
    if (isCollapsed) {
      finalClasses += ' justify-center';
    }
    return finalClasses;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Botão toggle mobile (hamburger) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-altave-primary text-white rounded-lg shadow-lg md:hidden hover:bg-blue-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`
          h-screen bg-altave-background dark:bg-gray-800 p-4 flex flex-col shadow-lg transition-all duration-300
          ${isMobile ? 'fixed top-0 left-0 w-64 z-40' : `relative ${isCollapsed ? 'w-20' : 'w-64'}`}
        `}
        style={isMobile ? {
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'
        } : undefined}
      >
        <div className="mb-10 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold text-altave-primary dark:text-blue-400">Altave</h1>
              <p className="text-sm text-altave-text dark:text-gray-400">Gestão de Talentos</p>
            </div>
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className={`h-6 w-6 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        
        <nav className="flex flex-col gap-4 flex-1">
          {/* Menu de navegação */}
          <Link 
            to={`/supervisor/profile/${userId}`} 
            className={linkClasses(`/supervisor/profile/${userId}`)} 
            title="Meu Perfil"
            onClick={closeMobileSidebar}
          >
            <User className={`h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span>Meu Perfil</span>}
          </Link>
          <Link 
            to="/minha-equipe" 
            className={linkClasses('/minha-equipe')} 
            title="Minha Equipe"
            onClick={closeMobileSidebar}
          >
            <Users className={`h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span>Minha Equipe</span>}
          </Link>
          <Link 
            to="/dashboard" 
            className={linkClasses('/dashboard')} 
            title="Dashboard"
            onClick={closeMobileSidebar}
          >
            <LayoutDashboard className={`h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
        </nav>
        
        {/* Botão de Logout */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title="Sair"
          >
            <LogOut className={`h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;