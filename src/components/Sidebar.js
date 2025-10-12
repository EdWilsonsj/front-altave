import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { User, LayoutDashboard } from 'lucide-react';
const Sidebar = ({ userId }) => {
    const location = useLocation();
    const linkClasses = (path) => {
        return location.pathname === path
            ? 'flex items-center p-3 bg-altave-primary text-white rounded-lg'
            : 'flex items-center p-3 text-altave-text hover:bg-altave-soft-blue dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors';
    };
    return (_jsxs("div", { className: "w-64 h-screen bg-altave-background dark:bg-gray-800 p-4 flex flex-col shadow-lg", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-2xl font-bold text-altave-primary dark:text-blue-400", children: "Altave" }), _jsx("p", { className: "text-sm text-altave-text dark:text-gray-400", children: "Gest\u00E3o de Talentos" })] }), _jsxs("nav", { className: "flex flex-col gap-4", children: [_jsxs(Link, { to: `/supervisor/profile/${userId}`, className: linkClasses(`/supervisor/profile/${userId}`), children: [_jsx(User, { className: "mr-3 h-6 w-6" }), _jsx("span", { children: "Meu Perfil" })] }), _jsxs(Link, { to: "/dashboard", className: linkClasses('/dashboard'), children: [_jsx(LayoutDashboard, { className: "mr-3 h-6 w-6" }), _jsx("span", { children: "Dashboard" })] })] })] }));
};
export default Sidebar;
