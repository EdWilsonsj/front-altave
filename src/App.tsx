import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import SupervisorLayout from "./components/SupervisorLayout";

// Páginas
import PaginaLogin from "./pages/PaginaLogin";
import PaginaCadastro from "./pages/PaginaCadastro";
import PaginaPerfil from "./pages/PaginaPerfil";
import PaginaDashboard from "./pages/PaginaDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<PaginaLogin />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/cadastro" element={<PaginaCadastro />} />

        {/* Rota para perfil de usuário normal (sem layout) */}
        <Route path="/profile/:id" element={<PaginaPerfil />} />

        {/* Rotas de Supervisor (com layout de sidebar) */}
        <Route element={<SupervisorLayout />}>
          <Route path="/dashboard" element={<PaginaDashboard />} />
          <Route path="/supervisor/profile/:id" element={<PaginaPerfil />} />
        </Route>

        {/* Rota coringa para evitar tela branca */}
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
