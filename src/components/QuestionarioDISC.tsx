import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  texto: string;
  tipo: 'D' | 'I' | 'S' | 'C';
}

const questoes: Question[] = [
  // Dominância (D)
  { id: 'q1', texto: 'Sou direto e assertivo ao tomar decisões', tipo: 'D' },
  { id: 'q5', texto: 'Gosto de assumir o controle e liderar projetos', tipo: 'D' },
  { id: 'q9', texto: 'Prefiro trabalhar com desafios e competição', tipo: 'D' },
  { id: 'q13', texto: 'Valorizo resultados acima de tudo', tipo: 'D' },
  { id: 'q17', texto: 'Sou impaciente com detalhes desnecessários', tipo: 'D' },
  
  // Influência (I)
  { id: 'q2', texto: 'Sou comunicativo e adoro interagir com pessoas', tipo: 'I' },
  { id: 'q6', texto: 'Gosto de trabalhar em equipe e socializar', tipo: 'I' },
  { id: 'q10', texto: 'Sou entusiasta e otimista na maioria das situações', tipo: 'I' },
  { id: 'q14', texto: 'Busco reconhecimento e apreciação dos outros', tipo: 'I' },
  { id: 'q18', texto: 'Prefiro ambientes dinâmicos e cheios de energia', tipo: 'I' },
  
  // Estabilidade (S)
  { id: 'q3', texto: 'Valorizo estabilidade e previsibilidade', tipo: 'S' },
  { id: 'q7', texto: 'Sou paciente e gosto de ajudar os outros', tipo: 'S' },
  { id: 'q11', texto: 'Prefiro trabalhar de forma consistente e metódica', tipo: 'S' },
  { id: 'q15', texto: 'Evito conflitos e busco harmonia no trabalho', tipo: 'S' },
  { id: 'q19', texto: 'Sou leal e confiável com minha equipe', tipo: 'S' },
  
  // Conformidade (C)
  { id: 'q4', texto: 'Sou meticuloso e atento aos detalhes', tipo: 'C' },
  { id: 'q8', texto: 'Valorizo precisão e qualidade no trabalho', tipo: 'C' },
  { id: 'q12', texto: 'Prefiro seguir procedimentos e padrões estabelecidos', tipo: 'C' },
  { id: 'q16', texto: 'Analiso cuidadosamente antes de tomar decisões', tipo: 'C' },
  { id: 'q20', texto: 'Sou organizado e gosto de planejar com antecedência', tipo: 'C' },
];

interface QuestionarioDISCProps {
  usuarioId: number;
  onComplete: () => void;
}

export default function QuestionarioDISC({ usuarioId, onComplete }: QuestionarioDISCProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleResposta = (valor: number) => {
    const questaoAtual = questoes[currentQuestion];
    const novasRespostas = { ...respostas, [questaoAtual.id]: valor };
    setRespostas(novasRespostas);

    if (currentQuestion < questoes.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      enviarRespostas(novasRespostas);
    }
  };

  const enviarRespostas = async (respostasFinais: Record<string, number>) => {
    setIsSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/disc/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: usuarioId,
          respostas: respostasFinais,
        }),
      });

      if (response.ok) {
        const perfil = await response.json();
        navigate('/disc/resultado', { state: { perfil } });
        onComplete();
      } else {
        alert('Erro ao processar questionário');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar respostas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progresso = ((currentQuestion + 1) / questoes.length) * 100;
  const questaoAtual = questoes[currentQuestion];

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Calculando seu perfil DISC...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Teste de Personalidade DISC
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Questão {currentQuestion + 1} de {questoes.length}
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Card da questão */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 transform transition-all duration-300 animate-fadeIn">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">
              {questaoAtual.texto}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Como você se identifica com esta afirmação?
            </p>
          </div>

          {/* Escala de respostas */}
          <div className="space-y-3">
            {[
              { valor: 5, texto: 'Concordo Totalmente', cor: 'from-green-500 to-emerald-600' },
              { valor: 4, texto: 'Concordo', cor: 'from-blue-500 to-cyan-600' },
              { valor: 3, texto: 'Neutro', cor: 'from-yellow-400 to-orange-500' },
              { valor: 2, texto: 'Discordo', cor: 'from-orange-500 to-red-500' },
              { valor: 1, texto: 'Discordo Totalmente', cor: 'from-red-500 to-rose-600' },
            ].map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => handleResposta(opcao.valor)}
                className={`w-full py-4 px-6 rounded-xl text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r ${opcao.cor}`}
              >
                {opcao.texto}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda dos tipos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
            <div className="p-2">
              <span className="font-bold text-red-600">D</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Dominância</span>
            </div>
            <div className="p-2">
              <span className="font-bold text-yellow-600">I</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Influência</span>
            </div>
            <div className="p-2">
              <span className="font-bold text-green-600">S</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Estabilidade</span>
            </div>
            <div className="p-2">
              <span className="font-bold text-blue-600">C</span>
              <span className="text-gray-600 dark:text-gray-400 ml-1">Conformidade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
