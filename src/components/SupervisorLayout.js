import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
const SupervisorLayout = () => {
    const [colaborador, setColaborador] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario');
        const storedColaborador = localStorage.getItem('colaborador');
        console.log('=== SUPERVISOR LAYOUT DEBUG ===');
        console.log('storedUsuario:', storedUsuario);
        console.log('storedColaborador:', storedColaborador);
        if (storedUsuario && storedColaborador) {
            const parsedUsuario = JSON.parse(storedUsuario);
            const parsedColaborador = JSON.parse(storedColaborador);
            console.log('parsedUsuario:', parsedUsuario);
            console.log('parsedUsuario.role:', parsedUsuario.role);
            console.log('parsedColaborador:', parsedColaborador);
            // Apenas usuários ADMIN podem acessar o layout de supervisor
            if (parsedUsuario.role === 'ADMIN') {
                console.log('USUÁRIO É ADMIN - Permitindo acesso ao dashboard');
                setColaborador(parsedColaborador);
            }
            else {
                console.log(`USUÁRIO NÃO É ADMIN (role: ${parsedUsuario.role}) - Redirecionando para profile`);
                // Redireciona usuários não-admin para seu perfil
                navigate(`/profile/${parsedColaborador.id}`);
            }
        }
        else {
            console.log('SEM DADOS DE USUÁRIO - Redirecionando para login');
            // Sem dados de usuário, redireciona para login
            navigate('/login');
        }
        console.log('===============================');
        setLoading(false);
    }, [navigate]);
    if (loading || !colaborador) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Carregando..." });
    }
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, { userId: colaborador.id }), _jsx("main", { className: "flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900", children: _jsx(Outlet, {}) })] }));
};
export default SupervisorLayout;
