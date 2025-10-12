import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Layout
import SupervisorLayout from "./components/SupervisorLayout";
// Páginas
import PaginaLogin from "./pages/PaginaLogin";
import PaginaCadastro from "./pages/PaginaCadastro";
import PaginaPerfil from "./pages/PaginaPerfil";
import PaginaDashboard from "./pages/PaginaDashboard";
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(PaginaLogin, {}) }), _jsx(Route, { path: "/login", element: _jsx(PaginaLogin, {}) }), _jsx(Route, { path: "/cadastro", element: _jsx(PaginaCadastro, {}) }), _jsx(Route, { path: "/profile/:id", element: _jsx(PaginaPerfil, {}) }), _jsxs(Route, { element: _jsx(SupervisorLayout, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(PaginaDashboard, {}) }), _jsx(Route, { path: "/supervisor/profile/:id", element: _jsx(PaginaPerfil, {}) })] }), _jsx(Route, { path: "*", element: _jsx(PaginaLogin, {}) })] }) }));
}
export default App;
