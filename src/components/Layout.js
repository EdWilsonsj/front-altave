import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
const Layout = () => {
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
                // Not a supervisor, redirect to their own profile
                navigate(`/profile/${parsedColaborador.id}`);
            }
        }
        else {
            // No user data, redirect to login
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]);
    if (loading || !colaborador) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Carregando..." });
    }
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, { userId: colaborador.id }), _jsx("main", { className: "flex-1 p-8 bg-altave-background dark:bg-gray-900", children: _jsx(Outlet, {}) })] }));
};
export default Layout;
