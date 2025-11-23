import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export default function PaginaLogin() {
    // Hooks
    const navegar = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isAdmin, colaborador } = useAuth();
    // Estado para controlar o tema escuro, inicializado com o valor do localStorage
    const [modoEscuro, setModoEscuro] = useState(() => {
        if (typeof window === "undefined")
            return false;
        return localStorage.getItem("theme") === "dark";
    });
    // Redirecionar usuário já autenticado
    useEffect(() => {
        if (isAuthenticated && colaborador) {
            const from = location.state?.from?.pathname || (isAdmin ? '/dashboard' : `/profile/${colaborador.id}`);
            navegar(from, { replace: true });
        }
    }, [isAuthenticated, isAdmin, colaborador, navegar, location]);
    // Efeito para aplicar a classe 'dark' ao HTML e salvar a preferência no localStorage
    useEffect(() => {
        const root = document.documentElement;
        if (modoEscuro) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [modoEscuro]);
    // Estados do formulário
    const [dadosFormulario, setDadosFormulario] = useState({ email: "", password: "" });
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [lembrarDeMim, setLembrarDeMim] = useState(false);
    const [carregando, setCarregando] = useState(false);
    /**
     * Atualiza o estado do formulário conforme o usuário digita.
     */
    const aoMudarInput = (e) => {
        const { name, value } = e.target;
        setDadosFormulario((prev) => ({ ...prev, [name]: value }));
    };
    /**
     * Limpa manualmente a sessão local se houver problemas.
     */
    const limparSessao = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('colaborador');
        window.location.reload();
    };
    /**
     * Lida com a submissão do formulário de login.
     * Autentica o usuário e o redireciona para a página de perfil ou dashboard.
     */
    const aoSubmeter = async (e) => {
        e.preventDefault();
        setCarregando(true);
        // Lógica unificada para todos os usuários
        try {
            const loginResponse = await fetch(`${API_BASE_URL}/api/usuario/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario),
            });
            if (loginResponse.status === 401) {
                throw new Error('Credenciais inválidas. Verifique seu email e senha.');
            }
            if (!loginResponse.ok) {
                throw new Error('Ocorreu um erro durante o login.');
            }
            const usuario = await loginResponse.json();
            const colaboradorResponse = await fetch(`${API_BASE_URL}/api/colaborador/by-email/${usuario.email}`);
            if (!colaboradorResponse.ok) {
                throw new Error('Perfil de colaborador não encontrado para este usuário.');
            }
            const colaboradorData = await colaboradorResponse.json();
            // Usar o contexto de autenticação para fazer login
            login(usuario, colaboradorData);
            alert("Login realizado com sucesso!");
            // O redirecionamento será feito automaticamente pelo useEffect
            // que detecta a mudança no estado de autenticação
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert("Ocorreu um erro desconhecido.");
            }
        }
        finally {
            setCarregando(false);
        }
    };
    const formularioValido = dadosFormulario.email && dadosFormulario.password;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4", children: [_jsxs("div", { className: "absolute top-4 left-4 flex gap-2", children: [_jsx("button", { onClick: () => setModoEscuro((v) => !v), "aria-label": "Alternar tema", className: "p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) }), isAuthenticated && (_jsx("button", { onClick: limparSessao, title: "Limpar sess\u00E3o e recarregar", className: "p-2 rounded-full bg-red-500 hover:bg-red-600 text-white hover:scale-105 transition-all shadow text-xs", children: "\uD83D\uDD04" }))] }), _jsxs("div", { className: "w-full max-w-lg", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2", children: "Bem-vindo" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Sistema de Gest\u00E3o de Compet\u00EAncias" })] }), _jsxs("form", { onSubmit: aoSubmeter, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "E-mail Corporativo" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: dadosFormulario.email, onChange: aoMudarInput, placeholder: "seu.email@altave.com", className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "password", name: "password", type: mostrarSenha ? "text" : "password", required: true, value: dadosFormulario.password, onChange: aoMudarInput, placeholder: "Digite sua senha", className: "w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700" }), _jsx("button", { type: "button", onClick: () => setMostrarSenha((v) => !v), className: "absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors", children: mostrarSenha ? _jsx(EyeOff, { className: "h-5 w-5" }) : _jsx(Eye, { className: "h-5 w-5" }) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", checked: lembrarDeMim, onChange: (e) => setLembrarDeMim(e.target.checked), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200", children: "Lembrar-me" })] }), _jsx("button", { type: "button", onClick: () => alert("Funcionalidade em desenvolvimento!"), className: "text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "Esqueci minha senha" })] }), _jsx("button", { type: "submit", disabled: !formularioValido || carregando, className: "w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg", children: carregando ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" }), "Entrando..."] })) : ("Entrar no Sistema") })] }), _jsxs("div", { className: "mt-6 text-center", children: [_jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: ["N\u00E3o tem uma conta?", " ", _jsx("button", { type: "button", onClick: () => navegar("/cadastro"), className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "Criar conta" })] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-2", children: ["Precisa de ajuda?", " ", _jsx("button", { type: "button", onClick: () => alert("Contato: suporte@altave.com"), className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "Entre em contato" })] })] })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " Altave. Todos os direitos reservados."] }) })] })] }));
}
