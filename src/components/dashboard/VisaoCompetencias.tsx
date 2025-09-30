import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock de dados para o gráfico
const dadosGraficoMock = [
  { setor: 'Desenvolvimento', Java: 8, React: 6, SQL: 7 },
  { setor: 'QA', TestesManuais: 9, Selenium: 5, Jira: 8 },
  { setor: 'Design', Figma: 9, Photoshop: 7, Prototipacao: 8 },
  { setor: 'Gestão', Scrum: 7, Lideranca: 8, Budget: 6 },
];

export default function VisaoCompetencias() {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função para carregar e processar os dados para o gráfico.
  // TODO: Substituir o mock pela lógica de busca na API.
  const carregarDadosDoGrafico = async () => {
    setCarregando(true);
    // Simula uma chamada de API e o processamento dos dados.
    setTimeout(() => {
        // A constante `dadosGraficoMock` é usada aqui para fins de demonstração.
        setDados(dadosGraficoMock);
        setCarregando(false);
    }, 1000);
    // A lógica real a ser implementada está descrita abaixo:
    // 1. Buscar os dados da API, por exemplo: fetch('/api/colaborador')
    // 2. Processar os dados recebidos para agrupar as competências por setor/cargo.
    // 3. Atualizar o estado 'dados' com os dados processados: setDados(dadosProcessados)
  };

  useEffect(() => {
    carregarDadosDoGrafico();
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Análise de Competências</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize a distribuição de competências por setor (cargo).</p>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        {carregando ? (
          <p>Montando o gráfico...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="setor" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="Java" stackId="a" fill="#3b82f6" />
              <Bar dataKey="React" stackId="a" fill="#8884d8" />
              <Bar dataKey="SQL" stackId="a" fill="#82ca9d" />
              <Bar dataKey="Selenium" stackId="a" fill="#ffc658" />
              <Bar dataKey="Figma" stackId="a" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
