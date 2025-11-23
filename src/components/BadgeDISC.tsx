import { useEffect, useState } from 'react';

interface BadgeDISCProps {
  usuarioId: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const estilosPorTipo = {
  D: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500',
    label: 'Dominância'
  },
  I: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500',
    label: 'Influência'
  },
  S: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500',
    label: 'Estabilidade'
  },
  C: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
    label: 'Conformidade'
  },
};

const tamanhos = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function BadgeDISC({ usuarioId, size = 'md', showLabel = false }: BadgeDISCProps) {
  const [tipoDominante, setTipoDominante] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPerfil = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${API_BASE_URL}/api/disc/usuario/${usuarioId}`);
        
        if (response.ok) {
          const perfil = await response.json();
          setTipoDominante(perfil.tipoDominante);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil DISC:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarPerfil();
  }, [usuarioId]);

  if (loading) {
    return (
      <div className={`inline-flex items-center justify-center ${tamanhos[size]} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse`}>
        <span className="text-gray-400">...</span>
      </div>
    );
  }

  if (!tipoDominante) {
    return null;
  }

  const estilo = estilosPorTipo[tipoDominante as keyof typeof estilosPorTipo];

  return (
    <div 
      className={`inline-flex items-center justify-center ${tamanhos[size]} ${estilo.bg} ${estilo.text} rounded-full font-semibold border ${estilo.border}`}
      title={`Perfil DISC: ${estilo.label}`}
    >
      {showLabel ? `${tipoDominante} - ${estilo.label}` : tipoDominante}
    </div>
  );
}
