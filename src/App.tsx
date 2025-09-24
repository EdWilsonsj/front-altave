import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas
import LoginPage from "./pages/loginpage"; 
import Cadastro from "./pages/cadastro";
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login acessível tanto em "/" quanto em "/login" */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Perfil */}
        <Route path="/profile" element={<Profile />} />

        {/* Rota coringa para evitar tela branca */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;