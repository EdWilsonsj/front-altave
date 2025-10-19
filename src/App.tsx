import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import SupervisorLayout from "./components/SupervisorLayout";

// Páginas
import PaginaLogin from "./pages/PaginaLogin";
import PaginaCadastro from "./pages/PaginaCadastro";
import PaginaPerfil from "./pages/PaginaPerfil";
import PaginaDashboard from "./pages/PaginaDashboard";

// Componente interno para aguardar inicialização do Auth
function AppContent() {
  const { isLoading } = useAuth();

  // Mostrar loading inicial enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Altave</h2>
          <p className="text-gray-500 dark:text-gray-400">Inicializando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<PaginaLogin />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/cadastro" element={<PaginaCadastro />} />

          {/* Rota para perfil de usuário (protegida) */}
          <Route 
            path="/profile/:id" 
            element={
              <ProtectedRoute>
                <PaginaPerfil />
              </ProtectedRoute>
            } 
          />

          {/* Rotas de Supervisor (protegidas e requerem admin) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <SupervisorLayout>
                  <PaginaDashboard />
                </SupervisorLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supervisor/profile/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <SupervisorLayout>
                  <PaginaPerfil />
                </SupervisorLayout>
              </ProtectedRoute>
            } 
          />

          {/* Rota coringa para evitar tela branca */}
          <Route path="*" element={<PaginaLogin />} />
        </Routes>
      </Router>
    );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
