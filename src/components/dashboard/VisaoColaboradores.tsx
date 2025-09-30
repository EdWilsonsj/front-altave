import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';

// Mock de dados, será substituído pela API
const colaboradoresMock = [
  { id: 1, nome: 'Pedro Mattos', cargo: { nomeCargo: 'Desenvolvedor Java' }, email: 'pedro.mattos@altave.com.br' },
  { id: 2, nome: 'Ana Silva', cargo: { nomeCargo: 'Analista de QA' }, email: 'ana.silva@altave.com.br' },
  { id: 3, nome: 'Carlos Pereira', cargo: { nomeCargo: 'Designer UX' }, email: 'carlos.pereira@altave.com.br' },
];

interface Colaborador {
  id: number;
  nome: string;
  cargo: {
    nomeCargo: string;
  } | null;
  email: string;
}

export default function VisaoColaboradores() {
  const [listaColaboradores, setListaColaboradores] = useState<Colaborador[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Função "abrasileirada" para buscar os dados
  const pegaTodaAGalerinha = async () => {
    setCarregando(true);
    try {
      const response = await fetch('/api/colaborador');
      const data = await response.json();
      setListaColaboradores(data);
    } catch (erro) {
      console.error("Deu ruim ao buscar colaboradores:", erro);
      // Opcional: mostrar um estado de erro na tela
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    pegaTodaAGalerinha();
  }, []);

  // Filtra a lista de colaboradores com base no termo de busca
  const colaboradoresFiltrados = listaColaboradores.filter(c => 
    c.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Cabeçalho e Barra de Busca */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Visão de Colaboradores</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pesquise e visualize os perfis dos colaboradores.</p>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Pesquisar por nome..."
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
            className="w-full max-w-lg pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Conteúdo Principal: Lista e Painel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Colaboradores */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Todos os Colaboradores</h3>
          {carregando ? (
            <p>Carregando...</p>
          ) : (
            <ul className="space-y-3">
              {colaboradoresFiltrados.map(colab => (
                <li 
                  key={colab.id} 
                  onClick={() => setColaboradorSelecionado(colab)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${colaboradorSelecionado?.id === colab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600'}`}>
                  <p className="font-semibold">{colab.nome}</p>
                  <p className={`text-sm ${colaboradorSelecionado?.id === colab.id ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{colab.cargo?.nomeCargo}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Painel de Detalhes do Colaborador */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {colaboradorSelecionado ? (
            <div>
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {colaboradorSelecionado.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{colaboradorSelecionado.nome}</h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">{colaboradorSelecionado.cargo?.nomeCargo}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{colaboradorSelecionado.email}</p>
                    </div>
                </div>
                {/* Aqui podem ser adicionados mais detalhes do colaborador */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">Ações</h4>
                    <button 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-lg"
                        onClick={() => window.open(`/profile/${colaboradorSelecionado.id}`, '_blank')}
                    >
                        <User className="h-4 w-4"/>
                        Ver Perfil Completo
                    </button>
                </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <User className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold">Selecione um colaborador</h3>
              <p>Clique em um nome na lista para ver os detalhes aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
