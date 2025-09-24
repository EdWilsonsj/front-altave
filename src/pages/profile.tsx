"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Award, 
  Code, 
  Plus, 
  X, 
  Sun, 
  Moon,
  Edit3,
  Target,
  BookOpen,
  Heart
} from "lucide-react";

interface Certificacao {
  nome: string;
  instituicao: string;
  ano: string;
}

interface Projeto {
  nome: string;
  tecnologias: string[];
  status: string;
}

interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  localizacao: string;
  dataAdmissao: string;
  nivel: string;
  biografia: string;
  objetivos: string;
  avatar: string;
}

export default function Profile() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Dados do usuário
  const [user] = useState<Usuario>({
    nome: "Pedro Henrique Santos",
    email: "pedro.santos@altave.com",
    cargo: "Desenvolvedor Full Stack Sênior",
    departamento: "Tecnologia da Informação",
    localizacao: "São Paulo, SP - Brasil",
    dataAdmissao: "Janeiro 2022",
    nivel: "Sênior",
    biografia: "Desenvolvedor apaixonado por tecnologia com mais de 5 anos de experiência em desenvolvimento full stack. Especialista em React, Node.js e arquiteturas modernas. Sempre em busca de novos desafios e oportunidades de crescimento. Acredito na importância do trabalho em equipe e na construção de soluções que fazem a diferença na vida das pessoas.",
    objetivos: "Tornar-me Tech Lead nos próximos 2 anos, contribuindo para projetos inovadores e mentorando desenvolvedores juniores.",
    avatar: "PH"
  });

  const [hardSkills, setHardSkills] = useState([
    "JavaScript/TypeScript", 
    "React.js", 
    "Node.js", 
    "Python", 
    "Java", 
    "Spring Boot",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Git/GitHub",
    "REST APIs"
  ]);

  const [softSkills, setSoftSkills] = useState([
    "Comunicação efetiva", 
    "Trabalho em equipe", 
    "Liderança",
    "Resolução de problemas",
    "Pensamento crítico",
    "Adaptabilidade",
    "Gestão de tempo",
    "Mentoria"
  ]);

  const [certificacoes] = useState<Certificacao[]>([
    { nome: "AWS Certified Developer", instituicao: "Amazon Web Services", ano: "2024" },
    { nome: "React Professional", instituicao: "Meta", ano: "2023" },
    { nome: "Scrum Master Certified", instituicao: "Scrum Alliance", ano: "2023" }
  ]);

  const [projetos] = useState<Projeto[]>([
    { nome: "Sistema de Gestão de Competências", tecnologias: ["React", "Node.js", "MongoDB"], status: "Em desenvolvimento" },
    { nome: "E-commerce Altave", tecnologias: ["Next.js", "PostgreSQL", "AWS"], status: "Concluído" },
    { nome: "API de Integração", tecnologias: ["Python", "FastAPI", "Docker"], status: "Concluído" }
  ]);

  const [newHardSkill, setNewHardSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  const addHardSkill = () => {
    if (newHardSkill.trim() && !hardSkills.includes(newHardSkill.trim())) {
      setHardSkills([...hardSkills, newHardSkill.trim()]);
      setNewHardSkill("");
    }
  };

  const addSoftSkill = () => {
    if (newSoftSkill.trim() && !softSkills.includes(newSoftSkill.trim())) {
      setSoftSkills([...softSkills, newSoftSkill.trim()]);
      setNewSoftSkill("");
    }
  };

  const removeHardSkill = (index: number) => {
    setHardSkills(hardSkills.filter((_, i) => i !== index));
  };

  const removeSoftSkill = (index: number) => {
    setSoftSkills(softSkills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hard' | 'soft') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'hard') addHardSkill();
      if (type === 'soft') addSoftSkill();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Botão Dark/Light */}
      <button
        onClick={() => setDarkMode(v => !v)}
        aria-label="Alternar tema"
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform shadow-lg z-10"
      >
        {darkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-800" />
        )}
      </button>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header com informações principais */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {user.avatar}
              </div>
            </div>

            {/* Informações principais */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{user.nome}</h1>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {user.nivel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <span>{user.cargo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>{user.localizacao}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span>Desde {user.dataAdmissao}</span>
                </div>
              </div>
            </div>

            {/* Botão de editar */}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg">
              <Edit3 className="h-4 w-4" />
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da esquerda */}
          <div className="space-y-6">
            {/* Sobre mim */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Sobre mim</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {user.biografia}
              </p>
            </div>

            {/* Objetivos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Objetivos</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {user.objetivos}
              </p>
            </div>

            {/* Certificações */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Certificações</h2>
              </div>
              <div className="space-y-3">
                {certificacoes.map((cert, index) => (
                  <div key={index} className="p-3 bg-blue-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{cert.nome}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{cert.instituicao} • {cert.ano}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna do meio - Hard Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Code className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hard Skills</h2>
            </div>

            {/* Lista de skills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {hardSkills.map((skill, index) => (
                <span
                  key={index}
                  className="group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeHardSkill(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Adicionar nova skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar Hard Skill..."
                value={newHardSkill}
                onChange={(e) => setNewHardSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'hard')}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                           bg-white dark:bg-gray-700 text-sm"
              />
              <button
                onClick={addHardSkill}
                type="button"
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Coluna da direita - Soft Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Soft Skills</h2>
            </div>

            {/* Lista de skills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSoftSkill(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Adicionar nova skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar Soft Skill..."
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'soft')}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                           text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                           bg-white dark:bg-gray-700 text-sm"
              />
              <button
                onClick={addSoftSkill}
                type="button"
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Projetos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Projetos Recentes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projetos.map((projeto, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{projeto.nome}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    projeto.status === 'Concluído' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {projeto.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {projeto.tecnologias.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Altave. Sistema de Gestão de Competências.
          </p>
        </div>
      </div>
    </div>
  );
}