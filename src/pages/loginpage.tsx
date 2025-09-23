import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  // Carregar estado inicial do tema só do localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // Aplicar/remover classe dark no <html> e salvar no localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log("Login attempt:", formData);
      alert(
        `Login realizado!\nEmail: ${formData.email}\nSenha: ${formData.password}`
      );
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Toggle Dark/Light */}
      <button
        onClick={() => setDarkMode((v) => !v)}
        aria-label="Alternar tema"
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow"
      >
        {darkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800" />
        )}
      </button>

      <div className="w-full max-w-lg">
        {/* Card de Login */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2">
              Bem-vindo
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Sistema de Gestão de Competências
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                  placeholder="seu.email@altave.com"
                />
              </div>
            </div>

            {/* Campo Senha */}
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me e Esqueci senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Lembrar-me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => alert("Funcionalidade em desenvolvimento!")}
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          {/* Link para cadastro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Criar conta
              </button>
            </p>
          </div>

          {/* Footer do Card */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
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

        {/* Credenciais de Teste */}
        <div className="mt-6 bg-blue-50 dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center">
            🚀 Credenciais para Teste
          </h3>
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              <span className="font-semibold">Email:</span> admin@altave.com
            </p>
            <p>
              <span className="font-semibold">Senha:</span> altave123
            </p>
            <p className="mt-2 italic text-blue-600 dark:text-blue-400">
              * Apenas para desenvolvimento - será removido em produção
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Altave. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}