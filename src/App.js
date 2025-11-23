import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import SupervisorLayout from "./components/SupervisorLayout";
import { lazy } from "react";
// @ts-expect-error
const PaginaLogin = lazy(() => import(/* @vite-ignore */ "./pages/PaginaLogin.tsx"));
// @ts-expect-error
const PaginaCadastro = lazy(() => import(/* @vite-ignore */ "./pages/PaginaCadastro.tsx"));
// @ts-expect-error
const PaginaPerfil = lazy(() => import(/* @vite-ignore */ "./pages/PaginaPerfil.tsx"));
// @ts-expect-error
const PaginaDashboard = lazy(() => import(/* @vite-ignore */ "./pages/PaginaDashboard.tsx"));
// @ts-expect-error
const MinhaEquipe = lazy(() => import(/* @vite-ignore */ "./pages/MinhaEquipe.tsx"));
// Componente interno para aguardar inicialização do Auth
function AppContent() {
    const { isLoading } = useAuth();
    // Mostrar loading inicial enquanto verifica autenticação
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2", children: "Altave" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Inicializando sistema..." })] }) }));
    }
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PaginaLogin, {}) }), _jsx(Route, { path: "/login", element: _jsx(PaginaLogin, {}) }), _jsx(Route, { path: "/cadastro", element: _jsx(PaginaCadastro, {}) }), _jsx(Route, { path: "/profile/:id", element: _jsx(ProtectedRoute, { children: _jsx(PaginaPerfil, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { requireAdmin: true, children: _jsx(SupervisorLayout, { children: _jsx(PaginaDashboard, {}) }) }) }), _jsx(Route, { path: "/supervisor/profile/:id", element: _jsx(ProtectedRoute, { requireAdmin: true, children: _jsx(SupervisorLayout, { children: _jsx(PaginaPerfil, {}) }) }) }), _jsx(Route, { path: "/minha-equipe", element: _jsx(ProtectedRoute, { requireAdmin: true, children: _jsx(SupervisorLayout, { children: _jsx(MinhaEquipe, {}) }) }) }), _jsx(Route, { path: "*", element: _jsx(PaginaLogin, {}) })] }) }));
}
function App() {
    return (_jsx(AuthProvider, { children: _jsx(AppContent, {}) }));
}
export default App;
