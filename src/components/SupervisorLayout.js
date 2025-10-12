import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
const SupervisorLayout = () => {
    const [colaborador, setColaborador] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedColaborador = localStorage.getItem('colaborador');
        if (storedColaborador) {
            const parsedColaborador = JSON.parse(storedColaborador);
            if (parsedColaborador.perfil >= 1) {
                setColaborador(parsedColaborador);
            }
            else {
                // Should not happen if login navigation is correct, but as a safeguard:
                navigate(`/profile/${parsedColaborador.id}`);
            }
        }
        else {
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]);
    if (loading || !colaborador) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Carregando..." });
    }
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, { userId: colaborador.id }), _jsx("main", { className: "flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900", children: _jsx(Outlet, {}) })] }));
};
export default SupervisorLayout;
