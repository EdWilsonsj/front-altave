# Manual de Programação - Sistema Altave

## Sobre este Manual

Este documento técnico descreve a arquitetura, estrutura de código e guias de desenvolvimento do sistema Altave. Destinado a desenvolvedores que irão manter ou expandir o sistema.

---

## 1. Visão Geral do Sistema

### 1.1 Tecnologias Principais

**Frontend**
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.2
- React Router DOM 7.9.2
- Tailwind CSS 4.1.13

**UI Components**
- Radix UI (componentes acessíveis)
- Lucide React (ícones)
- Recharts (gráficos)

**Bibliotecas Auxiliares**
- jsPDF (geração de relatórios PDF)
- class-variance-authority (variantes de estilo)
- tailwind-merge (merge de classes CSS)

---

### 1.2 Estrutura de Diretórios

```
front-altave/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── dashboard/   # Componentes específicos do dashboard
│   │   └── ui/          # Componentes base de interface
│   ├── contexts/        # Contextos React (Auth, Theme)
│   ├── lib/             # Utilitários e helpers
│   ├── pages/           # Páginas principais da aplicação
│   ├── App.tsx          # Componente raiz
│   └── main.tsx         # Ponto de entrada
├── index.html
├── vite.config.ts       # Configuração do Vite
├── tailwind.config.js   # Configuração do Tailwind
└── tsconfig.json        # Configuração do TypeScript
```

---

## 2. Arquitetura da Aplicação

### 2.1 Fluxo de Autenticação

O sistema utiliza o contexto `AuthContext` para gerenciar autenticação:

**AuthContext (src/contexts/AuthContext.tsx)**
- Armazena dados do usuário autenticado
- Gerencia estado de autenticação
- Provê funções de login/logout
- Verifica se o usuário é administrador

**Fluxo:**
1. Usuário faz login na `PaginaLogin`
2. Sistema valida credenciais via API
3. Dados do usuário são armazenados no contexto
4. Rotas protegidas verificam autenticação via `ProtectedRoute`
5. Usuário é redirecionado conforme permissões

---

### 2.2 Sistema de Rotas

**Rotas Públicas**
- `/` e `/login`: Página de login
- `/cadastro`: Página de cadastro

**Rotas Protegidas (Usuários)**
- `/profile/:id`: Perfil do colaborador autenticado

**Rotas Protegidas (Administradores)**
- `/dashboard`: Dashboard executivo
- `/supervisor/profile/:id`: Perfil de colaborador (visão admin)
- `/minha-equipe`: Visualização hierárquica da equipe

**Componente ProtectedRoute**
- Verifica autenticação antes de renderizar
- Propriedade `requireAdmin` restringe acesso a administradores
- Redireciona para login se não autenticado

---

### 2.3 Comunicação com Backend

**Base URL**: Configurada via variável de ambiente `VITE_API_URL`

**Endpoints Utilizados:**

```
POST   /api/usuario              # Cadastro de usuário
POST   /api/usuario/login        # Autenticação
GET    /api/colaborador          # Lista todos colaboradores
GET    /api/colaborador/:id      # Busca colaborador por ID
GET    /api/colaborador/by-email/:email  # Busca por email
PUT    /api/colaborador/:id      # Atualiza colaborador
GET    /api/competencia          # Lista competências
POST   /api/hardskill            # Adiciona hard skill
DELETE /api/hardskill/:id        # Remove hard skill
POST   /api/softskill            # Adiciona soft skill
DELETE /api/softskill/:id        # Remove soft skill
GET    /api/equipe/minha/:id     # Dados da equipe do colaborador
```

**Padrão de Requisições:**
- Utiliza `fetch` nativo do JavaScript
- Headers: `Content-Type: application/json`
- Tratamento de erros via try/catch
- Feedback ao usuário via `alert` (considerar substituir por toast)

---

## 3. Componentes Principais

### 3.1 Páginas

#### PaginaLogin (src/pages/PaginaLogin.tsx)

**Responsabilidades:**
- Renderizar formulário de login
- Validar credenciais do usuário
- Gerenciar estado de carregamento
- Redirecionar conforme tipo de usuário

**Estados:**
- `dadosFormulario`: email e password
- `mostrarSenha`: controle de visibilidade da senha
- `lembrarDeMim`: persistência de sessão
- `carregando`: estado de submissão
- `modoEscuro`: tema da interface

**Lógica de Login:**
```typescript
// Admin hardcoded
if (email === 'admin@altave.com' && password === 'altave123') {
  navigate('/dashboard')
}

// Usuário comum via API
const response = await fetch('/api/usuario/login', {
  method: 'POST',
  body: JSON.stringify({ email, senha: password })
})
```

**PRINT 13**: Fluxograma do processo de login

---

#### PaginaCadastro (src/pages/PaginaCadastro.tsx)

**Responsabilidades:**
- Renderizar formulário de cadastro completo
- Aplicar máscaras em CPF e telefone
- Validar senha e confirmação
- Criar novo usuário via API

**Validações Implementadas:**
- Todos os campos obrigatórios preenchidos
- Senhas coincidem
- Termos de uso aceitos

**Formatação Automática:**
```typescript
function formatarCPF(valor: string): string {
  const numeros = valor.replace(/\D/g, '')
  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
```

---

#### PaginaPerfil (src/pages/PaginaPerfil.tsx)

Página mais complexa do sistema.

**Responsabilidades:**
- Exibir informações completas do colaborador
- Permitir edição de dados pessoais
- Gerenciar competências (CRUD)
- Exibir certificações e experiências

**Estados Principais:**
- `colaborador`: dados completos do perfil
- `colaboradorOriginal`: backup para cancelar edição
- `emEdicao`: modo de edição ativo/inativo
- `novaHardSkill/novaSoftSkill`: inputs temporários
- `carregando`: estado de busca inicial
- `erro`: mensagens de erro

**Interfaces TypeScript:**
```typescript
interface Colaborador {
  id: number
  nome: string
  email: string
  telefone?: string
  cargo?: string
  dataNascimento?: string
  apresentacao?: string
  hardSkills: HardSkill[]
  softSkills: SoftSkill[]
  certificacoes: Certificacao[]
  experiencias: Experiencia[]
}
```

**Fluxo de Edição:**
1. Usuário clica "Editar Perfil"
2. `colaboradorOriginal` armazena estado atual
3. Campos tornam-se editáveis
4. Usuário modifica dados
5. Ao salvar: PUT para API e atualiza estado
6. Ao cancelar: restaura `colaboradorOriginal`

**PRINT 14**: Diagrama de estados do perfil

---

#### PaginaDashboard (src/pages/PaginaDashboard.tsx)

**Responsabilidades:**
- Exibir métricas executivas
- Renderizar gráfico de competências
- Alternar para visão de colaboradores
- Buscar dados agregados

**Estados:**
- `numColaboradores`: total de colaboradores
- `numCompetencias`: total de competências
- `numDesatualizados`: perfis desatualizados (fixo 'N/A')
- `view`: controla visão ativa ('dashboard' ou 'colaboradores')

**Renderização Condicional:**
```typescript
if (view === 'colaboradores') {
  return <VisaoColaboradores />
}

return <DashboardExecutivo />
```

**PRINT 15**: Estrutura de componentes do dashboard

---

#### MinhaEquipe (src/pages/MinhaEquipe.tsx)

**Responsabilidades:**
- Exibir hierarquia organizacional
- Renderizar diferentes visões por perfil
- Permitir navegação para perfis de membros

**Visões Condicionais:**

**Diretor:**
- Lista de supervisores
- Lista completa de colaboradores

**Supervisor:**
- Informações do diretor
- Membros da própria equipe
- Outros supervisores

**Colaborador:**
- Informações do supervisor
- Colegas de equipe

**Navegação:**
```typescript
const handleCardClick = (id: number) => {
  navigate(`/supervisor/profile/${id}`)
}
```

---

### 3.2 Componentes de Dashboard

#### CompetenciasChart (src/components/dashboard/CompetenciasChart.tsx)

**Responsabilidades:**
- Buscar dados de competências da API
- Processar e agrupar dados
- Renderizar gráfico de barras

**Biblioteca:** Recharts

**Processamento de Dados:**
1. Busca todas competências via API
2. Conta ocorrências de cada competência
3. Ordena por frequência
4. Limita aos top 10
5. Renderiza com BarChart

---

#### VisaoColaboradores (src/components/dashboard/VisaoColaboradores.tsx)

**Responsabilidades:**
- Listar todos os colaboradores
- Implementar busca/filtro
- Exibir cards clicáveis
- Navegar para perfil detalhado

**Filtros:**
- Por nome
- Por email
- Por cargo
- Por competências

---

### 3.3 Componentes de Layout

#### SupervisorLayout (src/components/SupervisorLayout.tsx)

**Responsabilidades:**
- Renderizar barra lateral de navegação
- Gerenciar tema (claro/escuro)
- Fornecer estrutura para páginas admin

**Estrutura:**
```
┌─────────────┬──────────────────┐
│   Sidebar   │   Main Content   │
│             │                  │
│  Dashboard  │   <children>     │
│  Minha Equipe                  │
│  Meu Perfil │                  │
│             │                  │
│   Sair      │                  │
└─────────────┴──────────────────┘
```

---

#### Sidebar (src/components/Sidebar.tsx)

**Elementos:**
- Logo/título da aplicação
- Links de navegação principais
- Indicador de página ativa
- Botão de logout

**Navegação:**
```typescript
<Link to="/dashboard">Dashboard</Link>
<Link to="/minha-equipe">Minha Equipe</Link>
<Link to={`/supervisor/profile/${colaboradorId}`}>Meu Perfil</Link>
```

---

### 3.4 Componentes UI Base

Localizados em `src/components/ui/`:

**Button**: Botão estilizado com variantes
**Card**: Container para conteúdo agrupado
**Checkbox**: Caixa de seleção acessível
**Input**: Campo de entrada de texto
**Label**: Rótulo de formulário

Todos utilizam Radix UI como base e são estilizados com Tailwind CSS.

**PRINT 16**: Catálogo de componentes UI

---

## 4. Contextos React

### 4.1 AuthContext

**Localização:** `src/contexts/AuthContext.tsx`

**Provê:**
```typescript
interface AuthContextType {
  colaborador: Colaborador | null
  isAdmin: boolean
  isLoading: boolean
  login: (colaborador: Colaborador) => void
  logout: () => void
}
```

**Uso:**
```typescript
const { colaborador, isAdmin, logout } = useAuth()
```

---

### 4.2 ThemeContext

**Localização:** `src/contexts/ThemeContext.tsx`

**Responsabilidades:**
- Gerenciar tema global (claro/escuro)
- Persistir preferência no localStorage
- Aplicar classe 'dark' no documento

**Implementação:**
```typescript
useEffect(() => {
  if (modoEscuro) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}, [modoEscuro])
```

---

## 5. Guia de Desenvolvimento

### 5.1 Configuração do Ambiente

**Pré-requisitos:**
- Node.js 18+ 
- npm ou yarn
- Git

**Instalação:**
```bash
# Clonar repositório
git clone [url-do-repositorio]

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Editar .env com URL do backend
VITE_API_URL=http://localhost:8080

# Executar em desenvolvimento
npm run dev

# Acessar em http://localhost:5173
```

---

### 5.2 Scripts Disponíveis

```json
{
  "dev": "vite",              // Servidor de desenvolvimento
  "build": "tsc && vite build", // Build para produção
  "lint": "eslint .",         // Verificar qualidade de código
  "preview": "vite preview"   // Preview do build
}
```

---

### 5.3 Padrões de Código

**Nomenclatura de Componentes:**
- PascalCase para componentes: `PaginaLogin`, `VisaoColaboradores`
- camelCase para funções: `aoSubmeter`, `buscarColaborador`
- UPPER_CASE para constantes: `API_BASE_URL`

**Estrutura de Componente:**
```typescript
// 1. Imports
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Interfaces/Types
interface Props {
  id: number
}

// 3. Componente
export default function MeuComponente({ id }: Props) {
  // 3.1 Hooks
  const [estado, setEstado] = useState()
  const navigate = useNavigate()
  
  // 3.2 Effects
  useEffect(() => {
    // lógica
  }, [id])
  
  // 3.3 Funções
  function aoClicar() {
    // lógica
  }
  
  // 3.4 Render
  return (
    <div></div>
  )
}
```

**Gerenciamento de Estado:**
- useState para estado local
- useContext para estado compartilhado
- Evitar prop drilling com contextos

**Tratamento de Erros:**
```typescript
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Erro na requisição')
  const data = await response.json()
  // processar
} catch (error) {
  console.error('Erro:', error)
  alert('Mensagem amigável ao usuário')
}
```

---

### 5.4 Estilização

**Tailwind CSS:**
- Utilizar classes utilitárias
- Variantes dark: automaticamente aplicadas
- Breakpoints responsivos: `md:`, `lg:`, etc

**Exemplo:**
```tsx
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Título
  </h1>
</div>
```

**Arquivos CSS:**
- Evitar CSS customizado quando possível
- Se necessário, usar CSS Modules ou arquivos .css específicos
- Exemplo: `MinhaEquipe.css` para estilos específicos

---

### 5.5 TypeScript

**Tipagem de Props:**
```typescript
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}
```

**Tipagem de Estado:**
```typescript
const [colaborador, setColaborador] = useState<Colaborador | null>(null)
```

**Tipagem de Respostas de API:**
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

---

### 5.6 Boas Práticas

**Performance:**
- Lazy loading de páginas (já implementado com React.lazy)
- Evitar re-renders desnecessários
- Usar useCallback e useMemo quando apropriado

**Acessibilidade:**
- Usar componentes Radix UI (já acessíveis)
- Adicionar aria-labels em botões de ícone
- Garantir contraste adequado de cores

**Segurança:**
- Nunca expor credenciais no código
- Validar entradas do usuário
- Sanitizar dados antes de enviar à API

**Manutenibilidade:**
- Componentes pequenos e focados
- Funções com responsabilidade única
- Comentários apenas quando necessário
- Código autoexplicativo

---

## 6. Testes

### 6.1 Estratégia de Testes

**Recomendações:**
- Testes unitários: componentes isolados
- Testes de integração: fluxos completos
- Testes E2E: jornadas de usuário

**Ferramentas Sugeridas:**
- Jest + React Testing Library
- Cypress ou Playwright para E2E

**Exemplo de Teste:**
```typescript
describe('PaginaLogin', () => {
  it('deve exibir mensagem de erro com credenciais inválidas', async () => {
    render(<PaginaLogin />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const senhaInput = screen.getByLabelText(/senha/i)
    const submitButton = screen.getByText(/entrar/i)
    
    fireEvent.change(emailInput, { target: { value: 'teste@test.com' } })
    fireEvent.change(senhaInput, { target: { value: 'senha123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
    })
  })
})
```

---

## 7. Deploy

### 7.1 Build para Produção

```bash
# Executar build
npm run build

# Diretório de saída: dist/
```

**Arquivos Gerados:**
- HTML minificado
- CSS otimizado
- JavaScript bundled e minificado
- Assets com hash para cache busting

---

### 7.2 Variáveis de Ambiente

**Desenvolvimento (.env):**
```
VITE_API_URL=http://localhost:8080
```

**Produção:**
```
VITE_API_URL=https://api.altave.com
```

**Nota:** Variáveis devem começar com `VITE_` para serem expostas ao código.

---

### 7.3 Configurações de Deploy

**Vercel (vercel.json):**
- Redireciona todas rotas para index.html
- Necessário para SPA com client-side routing

**Railway (railway.toml):**
- Configurações específicas para Railway
- Build command e start command

**Nginx (nginx.conf):**
- Configuração para servir arquivos estáticos
- Fallback para index.html

---

## 8. Manutenção e Evolução

### 8.1 Adicionar Nova Página

1. Criar componente em `src/pages/NovaPagina.tsx`
2. Adicionar rota em `src/App.tsx`:
```typescript
<Route path="/nova-pagina" element={<NovaPagina />} />
```
3. Adicionar link na navegação (se necessário)

---

### 8.2 Adicionar Novo Endpoint de API

1. Criar função de requisição:
```typescript
async function buscarDados() {
  const response = await fetch(`${API_BASE_URL}/api/novo-endpoint`)
  return response.json()
}
```
2. Integrar no componente com useEffect
3. Atualizar interfaces TypeScript
4. Tratar erros apropriadamente

---

### 8.3 Adicionar Novo Componente UI

1. Criar em `src/components/ui/NovoComponente.tsx`
2. Usar Radix UI como base (se aplicável)
3. Estilizar com Tailwind CSS
4. Exportar com tipagem TypeScript
5. Documentar props e uso

---

### 8.4 Modificar Tema

**Cores:**
Editar `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#...',
        secondary: '#...'
      }
    }
  }
}
```

**Fontes:**
Adicionar em `index.html` e configurar no Tailwind.

---

## 9. Troubleshooting

### 9.1 Problemas Comuns

**Erro: "Failed to fetch"**
- Verificar se backend está rodando
- Conferir VITE_API_URL no .env
- Verificar CORS no backend

**Erro de compilação TypeScript**
- Executar `npm install` novamente
- Verificar versões de dependências
- Limpar cache: `rm -rf node_modules package-lock.json && npm install`

**Página em branco após build**
- Verificar configuração de rotas
- Conferir base URL no vite.config.ts
- Verificar console do navegador para erros

**Tema não muda**
- Verificar se classe 'dark' está no HTML
- Confirmar configuração do Tailwind
- Verificar localStorage do navegador

---

### 9.2 Logs e Debug

**Console do Navegador:**
- Erros de JavaScript
- Requisições de rede (tab Network)
- Estado de componentes (React DevTools)

**Vite Dev Server:**
- Erros de compilação
- Hot Module Replacement status
- Warnings de dependências

**Adicionar Logs:**
```typescript
console.log('Estado atual:', colaborador)
console.error('Erro na requisição:', error)
```

**Remover em Produção:**
Usar ferramentas como `vite-plugin-remove-console`

---

## 10. Referências

### 10.1 Documentação Oficial

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Radix UI: https://www.radix-ui.com

### 10.2 Ferramentas Úteis

- VS Code: editor recomendado
- React DevTools: extensão de browser
- ESLint: linting de código
- Prettier: formatação de código

### 10.3 Convenções de Commit

Seguir padrão Conventional Commits:
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração sem mudança de comportamento
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

---

**Versão do Manual**: 1.0  
**Data de Atualização**: Novembro 2025  
**Sistema**: Altave Front-end  
**Tecnologia**: React + TypeScript + Vite
