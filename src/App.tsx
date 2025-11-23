import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import SupervisorLayout from "./components/SupervisorLayout";
import DISCRedirect from "./components/DISCRedirect";

import { lazy } from "react";


 // @ts-expect-error - Dynamic import for code splitting
const PaginaLogin = lazy(() => import(/* @vite-ignore */ "./pages/PaginaLogin.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const PaginaCadastro = lazy(() => import(/* @vite-ignore */ "./pages/PaginaCadastro.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const PaginaPerfil = lazy(() => import(/* @vite-ignore */ "./pages/PaginaPerfil.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const PaginaDashboard = lazy(() => import(/* @vite-ignore */ "./pages/PaginaDashboard.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const MinhaEquipe = lazy(() => import(/* @vite-ignore */ "./pages/MinhaEquipe.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const PaginaQuestionarioDISC = lazy(() => import(/* @vite-ignore */ "./pages/PaginaQuestionarioDISC.tsx"));
// @ts-expect-error - Dynamic import for code splitting
const PaginaResultadoDISC = lazy(() => import(/* @vite-ignore */ "./pages/PaginaResultadoDISC.tsx"));
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
    <BrowserRouter>
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
              <DISCRedirect>
                <PaginaPerfil />
              </DISCRedirect>
            </ProtectedRoute>
          } 
        />

        {/* Rotas do DISC (protegidas) */}
        <Route 
          path="/disc/questionario" 
          element={
            <ProtectedRoute>
              <PaginaQuestionarioDISC />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/disc/resultado" 
          element={
            <ProtectedRoute>
              <PaginaResultadoDISC />
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
        <Route 
          path="/minha-equipe" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <SupervisorLayout>
                <MinhaEquipe />
              </SupervisorLayout>
            </ProtectedRoute>
          } 
        />

        {/* Rota coringa para evitar tela branca */}
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </BrowserRouter>
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
