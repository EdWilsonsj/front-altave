import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
const SupervisorLayout = ({ children }) => {
    const { colaborador } = useAuth();
    // O ProtectedRoute já garante que o usuário está autenticado e é admin
    // Então aqui só precisamos renderizar o layout
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, { userId: colaborador.id }), _jsx("main", { className: "flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900", children: children })] }));
};
export default SupervisorLayout;
