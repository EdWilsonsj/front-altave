import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    senha: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aceitarTermos, setAceitarTermos] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = formatCPF(value);
    }

    if (name === "telefone") {
      formattedValue = formatTelefone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{2})$/, "$1-$2")
      .substring(0, 14);
  };

  const formatTelefone = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!aceitarTermos) {
      alert("Você deve aceitar os termos de uso!");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("Cadastro attempt:", formData);
      alert(
        `Cadastro realizado com sucesso!\n\nNome: ${formData.nomeCompleto}\nEmail: ${formData.email}\nCPF: ${formData.cpf}`
      );
      setIsLoading(false);
      navigate("/login"); // redireciona após cadastro
    }, 2000);
  };

  const isFormValid =
    formData.nomeCompleto &&
    formData.email &&
    formData.cpf &&
    formData.dataNascimento &&
    formData.telefone &&
    formData.senha &&
    formData.confirmarSenha &&
    aceitarTermos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card de Cadastro */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
              Criar Conta
            </h2>
            <p className="text-gray-500">Sistema de Gestão de Competências</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome Completo */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nomeCompleto"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    type="text"
                    required
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  E-mail
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
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="seu.email@altave.com"
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label
                  htmlFor="cpf"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  CPF
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <label
                  htmlFor="dataNascimento"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Data de Nascimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    required
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="telefone"
                    name="telefone"
                    type="text"
                    required
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Senha + Confirmar Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.senha}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-14 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="Repita sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Termos */}
            <div className="flex items-start">
              <input
                id="aceitar-termos"
                name="aceitar-termos"
                type="checkbox"
                checked={aceitarTermos}
                onChange={(e) => setAceitarTermos(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label
                htmlFor="aceitar-termos"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Eu concordo com os{" "}
                <button
                  type="button"
                  onClick={() => alert("Termos de uso em desenvolvimento!")}
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  termos de uso
                </button>{" "}
                e{" "}
                <button
                  type="button"
                  onClick={() =>
                    alert("Política de privacidade em desenvolvimento!")
                  }
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  política de privacidade
                </button>
              </label>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Criando conta...
                </div>
              ) : (
                "Criar Minha Conta"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        {/* Footer geral */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Altave. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}