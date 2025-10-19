import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces
interface Usuario {
  id: number;
  email: string;
  role: string;
}

interface Colaborador {
  id: number;
  nome: string;
  email: string;
  apresentacao: string;
  perfil: number;
  cargo: {
    nomeCargo: string;
  };
}

interface AuthContextType {
  usuario: Usuario | null;
  colaborador: Colaborador | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (usuario: Usuario, colaborador: Colaborador) => void;
  logout: () => void;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsuario = localStorage.getItem('usuario');
        const storedColaborador = localStorage.getItem('colaborador');

        if (storedUsuario && storedColaborador) {
          const parsedUsuario = JSON.parse(storedUsuario);
          const parsedColaborador = JSON.parse(storedColaborador);

          // Validar se os dados são válidos e completos
          if (parsedUsuario?.id && parsedUsuario?.email && parsedUsuario?.role &&
              parsedColaborador?.id && parsedColaborador?.nome && parsedColaborador?.email) {
            
            // Validar sessão no backend antes de considerar autenticado
            try {
              const API_BASE_URL = import.meta.env.VITE_API_URL || '';
              const response = await fetch(`${API_BASE_URL}/api/colaborador/${parsedColaborador.id}`);
              
              if (response.ok) {
                // Sessão válida, restaurar autenticação
                setUsuario(parsedUsuario);
                setColaborador(parsedColaborador);
              } else {
                // Sessão inválida, limpar dados
                console.warn('Sessão expirada ou inválida, limpando dados locais');
                localStorage.removeItem('usuario');
                localStorage.removeItem('colaborador');
              }
            } catch (networkError) {
              // Falha de rede - manter dados locais mas não considerar autenticado
              console.warn('Erro de rede ao validar sessão:', networkError);
              localStorage.removeItem('usuario');
              localStorage.removeItem('colaborador');
            }
          } else {
            // Dados incompletos ou inválidos, limpar localStorage
            localStorage.removeItem('usuario');
            localStorage.removeItem('colaborador');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Em caso de erro, limpar localStorage
        localStorage.removeItem('usuario');
        localStorage.removeItem('colaborador');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Função de login
  const login = (novoUsuario: Usuario, novoColaborador: Colaborador) => {
    setUsuario(novoUsuario);
    setColaborador(novoColaborador);
    
    // Persistir no localStorage
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
    localStorage.setItem('colaborador', JSON.stringify(novoColaborador));
  };

  // Função de logout
  const logout = () => {
    setUsuario(null);
    setColaborador(null);
    
    // Limpar localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('colaborador');
    
    // Redirecionar para login (será tratado pelos componentes que usam o contexto)
  };

  // Valores computados
  const isAuthenticated = usuario !== null && colaborador !== null;
  const isAdmin = usuario?.role === 'ADMIN';

  const value: AuthContextType = {
    usuario,
    colaborador,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};