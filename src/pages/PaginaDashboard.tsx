import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart2 } from 'lucide-react';
import VisaoColaboradores from '../components/dashboard/VisaoColaboradores';
import VisaoCompetencias from '../components/dashboard/VisaoCompetencias';

// Componente de Navegação Lateral
interface NavItemProps {
  icone: React.ElementType;
  texto: string;
  ativo: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icone: Icone, texto, ativo, onClick }) => (
  <li
    className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
      ativo
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
    }`}
    onClick={onClick}
  >
    <Icone className="h-6 w-6 mr-4" />
    <span className="font-semibold text-lg">{texto}</span>
  </li>
);

// Página Principal do Dashboard
export default function PaginaDashboard() {
  const [abaAtiva, setAbaAtiva] = useState('colaboradores');

  const renderizaConteudo = () => {
    switch (abaAtiva) {
      case 'colaboradores':
        return <VisaoColaboradores />;
      case 'competencias':
        return <VisaoCompetencias />;
      default:
        return <VisaoColaboradores />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Barra Lateral de Navegação */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
          <LayoutDashboard className="h-8 w-8 text-blue-600" />
          <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        </div>
        <nav className="flex-1 mt-6">
          <ul>
            <NavItem
              icone={Users}
              texto="Colaboradores"
              ativo={abaAtiva === 'colaboradores'}
              onClick={() => setAbaAtiva('colaboradores')}
            />
            <NavItem
              icone={BarChart2}
              texto="Competências"
              ativo={abaAtiva === 'competencias'}
              onClick={() => setAbaAtiva('competencias')}
            />
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className='text-xs text-center text-gray-500 dark:text-gray-400'>© {new Date().getFullYear()} Altave</p>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderizaConteudo()}
      </main>
    </div>
  );
}
