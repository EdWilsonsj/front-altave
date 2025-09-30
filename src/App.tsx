import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

        {/* Rotas "Privadas" */}
        <Route path="/profile/:id" element={<PaginaPerfil />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />

        {/* Rota coringa para evitar tela branca */}
        <Route path="*" element={<PaginaLogin />} />
      </Routes>
    </Router>
  );
}

export default App;