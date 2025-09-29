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
  Heart,
  Building,
  Star
} from "lucide-react";

// Interfaces matching backend models
interface Cargo {
  nomeCargo: string;
}

interface Certificacao {
  id: number;
  nomeCertificacao: string;
  instituicao: string;
}

interface Experiencia {
  id: number;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim: string;
}

interface HardSkill {
  id: number;
  nomeCompetencia: string;
}

interface SoftSkill {
  id: number;
  nomeCompetencia: string;
}

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  apresentacao: string;
  cargo: Cargo;
  certificacoes: Certificacao[];
  experiencias: Experiencia[];
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
}

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newHardSkill, setNewHardSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchColaborador = async () => {
    try {
      const response = await fetch('/api/colaborador/1');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Colaborador = await response.json();
      setColaborador(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColaborador();
  }, []);

  const addHardSkill = async () => {
    if (newHardSkill.trim() && colaborador) {
      const newSkill = {
        nomeCompetencia: newHardSkill.trim(),
        colaborador: { id: colaborador.id }
      };
      const response = await fetch('/api/hardskill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      if (response.ok) {
        const addedSkill = await response.json();
        setColaborador(prev => prev ? { ...prev, hardSkills: [...prev.hardSkills, addedSkill] } : null);
        setNewHardSkill("");
      } else {
        console.error("Failed to add hard skill");
      }
    }
  };

  const addSoftSkill = async () => {
    if (newSoftSkill.trim() && colaborador) {
      const newSkill = {
        nomeCompetencia: newSoftSkill.trim(),
        colaborador: { id: colaborador.id } // Assuming soft skill also needs collaborator id
      };
      const response = await fetch('/api/softskill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });
      if (response.ok) {
        const addedSkill = await response.json();
        setColaborador(prev => prev ? { ...prev, softSkills: [...prev.softSkills, addedSkill] } : null);
        setNewSoftSkill("");
      } else {
        console.error("Failed to add soft skill");
      }
    }
  };

  const removeHardSkill = async (skillId: number) => {
    const response = await fetch(`/api/hardskill/${skillId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setColaborador(prev => prev ? { ...prev, hardSkills: prev.hardSkills.filter(s => s.id !== skillId) } : null);
    } else {
      console.error("Failed to remove hard skill");
    }
  };

  const removeSoftSkill = async (skillId: number) => {
    const response = await fetch(`/api/softskill/${skillId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setColaborador(prev => prev ? { ...prev, softSkills: prev.softSkills.filter(s => s.id !== skillId) } : null);
    } else {
      console.error("Failed to remove soft skill");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type: 'hard' | 'soft') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'hard') addHardSkill();
      if (type === 'soft') addSoftSkill();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  if (!colaborador) {
    return <div className="min-h-screen flex items-center justify-center">No collaborator data found.</div>;
  }

  const { nome, email, cargo, apresentacao, certificacoes, experiencias, hardSkills, softSkills } = colaborador;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {nome.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{nome}</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <span>{cargo.nomeCargo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>{email}</span>
                </div>
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg">
              <Edit3 className="h-4 w-4" />
              Editar Perfil
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Sobre mim</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {apresentacao}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Certificações</h2>
              </div>
              <div className="space-y-3">
                {certificacoes.map((cert) => (
                  <div key={cert.id} className="p-3 bg-blue-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{cert.nomeCertificacao}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{cert.instituicao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Code className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hard Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {hardSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="group px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {skill.nomeCompetencia}
                  <button
                    onClick={() => removeHardSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar Hard Skill..."
                value={newHardSkill}
                onChange={(e) => setNewHardSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'hard')}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm"
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

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Soft Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {softSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="group px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  {skill.nomeCompetencia}
                  <button
                    onClick={() => removeSoftSkill(skill.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
             <div className="flex gap-2">
              <input
                type="text"
                placeholder="Adicionar Soft Skill..."
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'soft')}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-sm"
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

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Experiência Profissional</h2>
            </div>
            <div className="space-y-4">
                {experiencias.map((exp) => (
                    <div key={exp.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{exp.cargo}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.empresa}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(exp.dataInicio).toLocaleDateString()} - {exp.dataFim ? new Date(exp.dataFim).toLocaleDateString() : 'Presente'}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="text-center py-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Altave. Sistema de Gestão de Competências.
          </p>
        </div>
      </div>
    </div>
  );
}