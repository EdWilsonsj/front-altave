import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface PerfilDISC {
  id: number;
  usuarioId: number;
  pontuacaoD: number;
  pontuacaoI: number;
  pontuacaoS: number;
  pontuacaoC: number;
  tipoDominante: string;
  dataCriacao: string;
}

const descricoesTipos = {
  D: {
    nome: 'Dominância',
    cor: 'red',
    descricao: 'Você é direto, assertivo e orientado para resultados. Gosta de assumir o controle e não tem medo de desafios. Valoriza a eficiência e prefere um ambiente de trabalho dinâmico.',
    caracteristicas: ['Decisivo', 'Direto', 'Orientado a resultados', 'Competitivo', 'Líder natural'],
    fortalezas: 'Capacidade de tomar decisões rápidas, determinação em alcançar metas, coragem para enfrentar desafios',
    areas_desenvolvimento: 'Desenvolver paciência, melhorar escuta ativa, considerar mais as opiniões dos outros'
  },
  I: {
    nome: 'Influência',
    cor: 'yellow',
    descricao: 'Você é comunicativo, entusiasta e gosta de interagir com pessoas. Prefere ambientes sociais e dinâmicos. Busca reconhecimento e valoriza relacionamentos.',
    caracteristicas: ['Comunicativo', 'Otimista', 'Entusiasta', 'Persuasivo', 'Sociável'],
    fortalezas: 'Excelente comunicação, capacidade de inspirar outros, criar networking facilmente',
    areas_desenvolvimento: 'Foco em detalhes, gestão de tempo, seguir processos estabelecidos'
  },
  S: {
    nome: 'Estabilidade',
    cor: 'green',
    descricao: 'Você é paciente, leal e valoriza harmonia. Prefere trabalhar de forma consistente e confiável. É um excelente membro de equipe que busca estabilidade.',
    caracteristicas: ['Paciente', 'Confiável', 'Leal', 'Colaborativo', 'Calmo'],
    fortalezas: 'Trabalho em equipe excepcional, estabilidade emocional, capacidade de ouvir',
    areas_desenvolvimento: 'Adaptar-se a mudanças mais rapidamente, tomar iniciativa, expressar opiniões próprias'
  },
  C: {
    nome: 'Conformidade',
    cor: 'blue',
    descricao: 'Você é analítico, preciso e atento aos detalhes. Valoriza qualidade e padrões elevados. Prefere trabalhar com dados e informações concretas.',
    caracteristicas: ['Analítico', 'Preciso', 'Organizado', 'Meticuloso', 'Sistemático'],
    fortalezas: 'Atenção aos detalhes, pensamento analítico, comprometimento com qualidade',
    areas_desenvolvimento: 'Tomar decisões mais rápidas, ser mais flexível, lidar com ambiguidade'
  }
};

const corPorTipo = {
  D: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-500' },
  I: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500' },
  S: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-500' },
  C: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500' },
};

export default function PaginaResultadoDISC() {
  const location = useLocation();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<PerfilDISC | null>(null);

  useEffect(() => {
    if (location.state?.perfil) {
      setPerfil(location.state.perfil);
    } else {
      // Se não há perfil no state, redirecionar
      navigate('/');
    }
  }, [location, navigate]);

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const descricao = descricoesTipos[perfil.tipoDominante as keyof typeof descricoesTipos];
  const cores = corPorTipo[perfil.tipoDominante as keyof typeof corPorTipo];
  const maxPontuacao = Math.max(perfil.pontuacaoD, perfil.pontuacaoI, perfil.pontuacaoS, perfil.pontuacaoC);

  const pontuacoes = [
    { tipo: 'D', valor: perfil.pontuacaoD, label: 'Dominância', cor: 'bg-red-500' },
    { tipo: 'I', valor: perfil.pontuacaoI, label: 'Influência', cor: 'bg-yellow-500' },
    { tipo: 'S', valor: perfil.pontuacaoS, label: 'Estabilidade', cor: 'bg-green-500' },
    { tipo: 'C', valor: perfil.pontuacaoC, label: 'Conformidade', cor: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className={`inline-block ${cores.bg} ${cores.text} px-6 py-3 rounded-full text-xl font-bold mb-4`}>
            Seu Perfil: Tipo {perfil.tipoDominante}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {descricao.nome}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {descricao.descricao}
          </p>
        </div>

        {/* Gráfico de pontuações */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Suas Pontuações</h2>
          <div className="space-y-6">
            {pontuacoes.map((item) => {
              const porcentagem = (item.valor / maxPontuacao) * 100;
              const isDominante = item.tipo === perfil.tipoDominante;
              
              return (
                <div key={item.tipo} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {item.label} {isDominante && '⭐'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-mono">
                      {item.valor} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div
                      className={`${item.cor} h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                      style={{ width: `${porcentagem}%` }}
                    >
                      {isDominante && (
                        <span className="text-white text-xs font-bold">DOMINANTE</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Características */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Características Principais
            </h2>
            <ul className="space-y-3">
              {descricao.caracteristicas.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className={`${cores.text} mr-3 text-xl`}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Fortalezas
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {descricao.fortalezas}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Áreas de Desenvolvimento
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {descricao.areas_desenvolvimento}
              </p>
            </div>
          </div>
        </div>

        {/* Botão continuar */}
        <div className="text-center animate-fadeIn">
          <button
            onClick={() => navigate(`/profile/${perfil.usuarioId}`)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Continuar para o Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
