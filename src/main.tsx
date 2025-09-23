import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.tsx";
import LoginPage from "./pages/loginpage.tsx";
import Cadastro from "./pages/cadastro.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página inicial pode apontar pro login ou pra um dashboard futuramente */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);