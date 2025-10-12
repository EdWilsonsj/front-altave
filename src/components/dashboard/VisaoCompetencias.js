import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
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
    // ainda temos que ler isso do banco
    const carregarDadosDoGrafico = async () => {
        setCarregando(true);
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
    return (_jsxs("div", { className: "h-full flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 dark:text-gray-100", children: "An\u00E1lise de Compet\u00EAncias" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: "Visualize a distribui\u00E7\u00E3o de compet\u00EAncias por setor (cargo)." })] }), _jsx("div", { className: "flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700", children: carregando ? (_jsx("p", { children: "Montando o gr\u00E1fico..." })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: dados, margin: {
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "setor" }), _jsx(YAxis, {}), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(0, 0, 0, 0.1)'
                                } }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "Java", stackId: "a", fill: "#3b82f6" }), _jsx(Bar, { dataKey: "React", stackId: "a", fill: "#8884d8" }), _jsx(Bar, { dataKey: "SQL", stackId: "a", fill: "#82ca9d" }), _jsx(Bar, { dataKey: "Selenium", stackId: "a", fill: "#ffc658" }), _jsx(Bar, { dataKey: "Figma", stackId: "a", fill: "#ff8042" })] }) })) })] }));
}
