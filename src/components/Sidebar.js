import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Sidebar = ({ userId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const linkClasses = (path) => {
        return location.pathname === path
            ? 'flex items-center p-3 bg-altave-primary text-white rounded-lg'
            : 'flex items-center p-3 text-gray-800 hover:bg-altave-soft-blue dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors';
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("div", { className: "w-64 h-screen bg-altave-background dark:bg-gray-800 p-4 flex flex-col shadow-lg", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-2xl font-bold text-altave-primary dark:text-blue-400", children: "Altave" }), _jsx("p", { className: "text-sm text-altave-text dark:text-gray-400", children: "Gest\u00E3o de Talentos" })] }), _jsxs("nav", { className: "flex flex-col gap-4 flex-1", children: [_jsxs(Link, { to: `/supervisor/profile/${userId}`, className: linkClasses(`/supervisor/profile/${userId}`), children: [_jsx(User, { className: "mr-3 h-6 w-6" }), _jsx("span", { children: "Meu Perfil" })] }), _jsxs(Link, { to: "/dashboard", className: linkClasses('/dashboard'), children: [_jsx(LayoutDashboard, { className: "mr-3 h-6 w-6" }), _jsx("span", { children: "Dashboard" })] })] }), _jsx("div", { className: "mt-auto pt-4", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center p-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors", children: [_jsx(LogOut, { className: "mr-3 h-6 w-6" }), _jsx("span", { children: "Sair" })] }) })] }));
};
export default Sidebar;
