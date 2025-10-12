import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, FileText, Sun, Moon, } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export default function PaginaCadastro() {
    // Hook para navegação entre as páginas
    const navegar = useNavigate();
    // Estado para controlar o tema escuro, inicializado com o valor do localStorage
    const [modoEscuro, setModoEscuro] = useState(() => {
        if (typeof window === "undefined")
            return false;
        return localStorage.getItem("theme") === "dark";
    });
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
    // Estado para armazenar os dados do formulário de cadastro
    const [dadosFormulario, setDadosFormulario] = useState({
        nomeCompleto: "",
        email: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
    });
    // Estados para controlar a visibilidade das senhas e o status de carregamento
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [termosAceitos, setTermosAceitos] = useState(false);
    /**
     * Atualiza o estado do formulário conforme o usuário digita nos inputs.
     * Aplica formatação para campos específicos como CPF e telefone.
     */
    const aoMudarInput = (e) => {
        const { name, value } = e.target;
        let valorFormatado = value;
        if (name === "cpf") {
            valorFormatado = formatarCPF(value);
        }
        if (name === "telefone") {
            valorFormatado = formatarTelefone(value);
        }
        setDadosFormulario((prev) => ({
            ...prev,
            [name]: valorFormatado,
        }));
    };
    /**
     * Formata o valor do CPF para o padrão 000.000.000-00.
     */
    const formatarCPF = (valor) => {
        const valorNumerico = valor.replace(/\D/g, "");
        return valorNumerico
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{2})$/, "$1-$2")
            .substring(0, 14);
    };
    /**
     * Formata o valor do telefone para o padrão (00) 00000-0000.
     */
    const formatarTelefone = (valor) => {
        const valorNumerico = valor.replace(/\D/g, "");
        return valorNumerico
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .substring(0, 15);
    };
    /**
     * Lida com a submissão do formulário de cadastro.
     * Envia os dados para a API criar um novo usuário.
     */
    const aoSubmeter = async (e) => {
        e.preventDefault();
        if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        if (!termosAceitos) {
            alert("Você deve aceitar os termos de uso!");
            return;
        }
        setCarregando(true);
        const { confirmarSenha, ...dadosParaEnviar } = dadosFormulario;
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaEnviar),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha no cadastro.');
            }
            alert("Cadastro realizado com sucesso! Você será redirecionado para a página de login.");
            navegar("/login");
        }
        catch (error) {
            if (error instanceof Error) {
                alert(`Erro no cadastro: ${error.message}`);
            }
            else {
                alert("Ocorreu um erro desconhecido.");
            }
        }
        finally {
            setCarregando(false);
        }
    };
    // Variável booleana que verifica se o formulário está preenchido e válido para submissão
    const formularioValido = dadosFormulario.nomeCompleto &&
        dadosFormulario.email &&
        dadosFormulario.cpf &&
        dadosFormulario.dataNascimento &&
        dadosFormulario.telefone &&
        dadosFormulario.senha &&
        dadosFormulario.confirmarSenha &&
        termosAceitos;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4", children: [_jsx("button", { onClick: () => setModoEscuro((v) => !v), "aria-label": "Alternar tema", className: "absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow", children: modoEscuro ? (_jsx(Sun, { className: "h-5 w-5 text-yellow-400" })) : (_jsx(Moon, { className: "h-5 w-5 text-gray-800" })) }), _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2", children: "Criar Conta" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Sistema de Gest\u00E3o de Compet\u00EAncias" })] }), _jsxs("form", { onSubmit: aoSubmeter, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { htmlFor: "nomeCompleto", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Nome Completo" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(User, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "nomeCompleto", name: "nomeCompleto", type: "text", required: true, value: dadosFormulario.nomeCompleto, onChange: aoMudarInput, className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "Seu nome completo" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "E-mail" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "email", name: "email", type: "email", required: true, value: dadosFormulario.email, onChange: aoMudarInput, className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "seu.email@altave.com" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "cpf", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "CPF" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(FileText, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "cpf", name: "cpf", type: "text", required: true, value: dadosFormulario.cpf, onChange: aoMudarInput, className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "000.000.000-00" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "dataNascimento", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Data de Nascimento" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Calendar, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "dataNascimento", name: "dataNascimento", type: "date", required: true, value: dadosFormulario.dataNascimento, onChange: aoMudarInput, className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-700" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "telefone", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Telefone" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Phone, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "telefone", name: "telefone", type: "text", required: true, value: dadosFormulario.telefone, onChange: aoMudarInput, className: "w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "(11) 99999-9999" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "senha", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "senha", name: "senha", type: mostrarSenha ? "text" : "password", required: true, value: dadosFormulario.senha, onChange: aoMudarInput, className: "w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "M\u00EDnimo 6 caracteres" }), _jsx("button", { type: "button", onClick: () => setMostrarSenha(!mostrarSenha), className: "absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors", children: mostrarSenha ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmarSenha", className: "block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Confirmar Senha" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-blue-400" }) }), _jsx("input", { id: "confirmarSenha", name: "confirmarSenha", type: mostrarConfirmarSenha ? "text" : "password", required: true, value: dadosFormulario.confirmarSenha, onChange: aoMudarInput, className: "w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700", placeholder: "Repita sua senha" }), _jsx("button", { type: "button", onClick: () => setMostrarConfirmarSenha(!mostrarConfirmarSenha), className: "absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors", children: mostrarConfirmarSenha ? (_jsx(EyeOff, { className: "h-5 w-5" })) : (_jsx(Eye, { className: "h-5 w-5" })) })] })] })] }), _jsxs("div", { className: "flex items-start", children: [_jsx("input", { id: "aceitar-termos", name: "aceitar-termos", type: "checkbox", checked: termosAceitos, onChange: (e) => setTermosAceitos(e.target.checked), className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" }), _jsxs("label", { htmlFor: "aceitar-termos", className: "ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200", children: ["Eu concordo com os", " ", _jsx("button", { type: "button", onClick: () => alert("Termos de uso em desenvolvimento!"), className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "termos de uso" }), " ", "e", " ", _jsx("button", { type: "button", onClick: () => alert("Política de privacidade em desenvolvimento!"), className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "pol\u00EDtica de privacidade" })] })] }), _jsx("button", { type: "submit", disabled: !formularioValido || carregando, className: "w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg", children: carregando ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" }), "Criando conta..."] })) : ("Criar Minha Conta") })] }), _jsx("div", { className: "mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 text-center", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["J\u00E1 tem uma conta?", " ", _jsx("button", { type: "button", onClick: () => navegar("/login"), className: "font-semibold text-blue-600 hover:text-blue-500 transition-colors", children: "Fazer login" })] }) })] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\u00A9 ", new Date().getFullYear(), " Altave. Todos os direitos reservados."] }) })] })] }));
}
