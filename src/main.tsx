import React from 'react'
import ReactDOM from 'react-dom/client'
// @ts-expect-error - Dynamic App import
import App from './App.tsx';
import './index.css'


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);