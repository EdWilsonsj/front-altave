import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
const Layout = () => {
    const [colaborador, setColaborador] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario');
        const storedColaborador = localStorage.getItem('colaborador');
        if (storedUsuario && storedColaborador) {
            const parsedUsuario = JSON.parse(storedUsuario);
            const parsedColaborador = JSON.parse(storedColaborador);
            // Apenas usuários ADMIN podem acessar o layout com sidebar
            if (parsedUsuario.role === 'ADMIN') {
                setColaborador(parsedColaborador);
            }
            else {
                // Redireciona usuários não-admin para seu perfil
                navigate(`/profile/${parsedColaborador.id}`);
            }
        }
        else {
            // Sem dados de usuário, redireciona para login
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
