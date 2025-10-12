import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';


export default function PaginaLogin() {
  // Hook para navegação entre as páginas
  const navegar = useNavigate();

  // Estado para controlar o tema escuro, inicializado com o valor do localStorage
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // Efeito para aplicar a classe 'dark' ao HTML e salvar a preferência no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (modoEscuro) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
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
  const aoMudarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Lida com a submissão do formulário de login.
   * Autentica o usuário e o redireciona para a página de perfil ou dashboard.
   */
  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    // Lógica especial para o admin
    if (dadosFormulario.email === 'admin@altave.com') {
        if (dadosFormulario.password === 'altave123') {
            const adminColaborador = {
              id: 1, // ID estático para o admin
              nome: 'Administrador',
              email: 'admin@altave.com',
              perfil: 2, // Perfil de super-admin
              apresentacao: 'Administrador do sistema.',
              cargo: { nomeCargo: 'Admin' }
            };
            localStorage.setItem('colaborador', JSON.stringify(adminColaborador));
            alert("Bem-vindo, Admin!");
            navegar('/dashboard');
        } else {
            alert('Senha de administrador incorreta.');
            setCarregando(false);
        }
        return;
    }

    // Lógica para usuários normais
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

      const colaborador = await colaboradorResponse.json();

      // Salvar dados do colaborador no localStorage
      localStorage.setItem('colaborador', JSON.stringify(colaborador));

      alert("Login realizado com sucesso!");

      if (colaborador.perfil >= 1) {
        navegar('/dashboard');
      } else {
        navegar(`/profile/${colaborador.id}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const formularioValido = dadosFormulario.email && dadosFormulario.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <button
        onClick={() => setModoEscuro((v) => !v)}
        aria-label="Alternar tema"
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow"
      >
        {modoEscuro ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800" />
        )}
      </button>

      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2">
              Bem-vindo
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Sistema de Gestão de Competências
            </p>
          </div>

          <form onSubmit={aoSubmeter} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={dadosFormulario.email}
                  onChange={aoMudarInput}
                  placeholder="seu.email@altave.com"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={mostrarSenha ? "text" : "password"}
                  required
                  value={dadosFormulario.password}
                  onChange={aoMudarInput}
                  placeholder="Digite sua senha"
                  className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={lembrarDeMim}
                  onChange={(e) => setLembrarDeMim(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Lembrar-me
                </label>
              </div>
              <button
                type="button"
                onClick={() => alert("Funcionalidade em desenvolvimento!")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={!formularioValido || carregando}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {carregando ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navegar("/cadastro")}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Criar conta
              </button>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Precisa de ajuda?{" "}
              <button
                type="button"
                onClick={() => alert("Contato: suporte@altave.com")}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Entre em contato
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Altave. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
