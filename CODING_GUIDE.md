# Guia de Programação - Altave Front-end

Este documento serve como um guia para entender o funcionamento das páginas da aplicação.

## `src/pages/PaginaDashboard.tsx`

### Visão Geral

Esta página é o painel principal para usuários administrativos. Ela apresenta duas visões principais:

1.  **Dashboard Executivo**: Uma visão geral com métricas chave da plataforma.
2.  **Visão de Colaboradores**: Uma lista detalhada de todos os colaboradores, com funcionalidades de busca e visualização de perfil.

O componente gerencia o estado para alternar entre essas duas visões.

### Estrutura do Código

O componente `PaginaDashboard` é funcional e utiliza `hooks` do React (`useState`, `useEffect`) para gerenciar seu estado e ciclo de vida.

#### Estados

-   `numColaboradores` (number): Armazena o número total de colaboradores.
-   `numCompetencias` (number): Armazena o número total de competências mapeadas.
-   `numDesatualizados` (number | string): Armazena o número de perfis desatualizados (atualmente um valor fixo 'N/A').
-   `view` (string): Controla qual visão está ativa. Pode ser `'dashboard'` (padrão) ou `'colaboradores'`.

#### Ciclo de Vida (`useEffect`)

-   O `useEffect` é executado quando o componente é montado e sempre que o estado `view` é alterado.
-   **Condição**: Ele só busca os dados da API (`/api/colaborador`, `/api/competencia`) se a `view` for `'dashboard'`. Isso evita chamadas desnecessárias à API quando o usuário está na tela de colaboradores.
-   **Busca de Dados**:
    -   Faz um `fetch` no endpoint `/api/colaborador` para obter a lista de colaboradores e atualiza o estado `numColaboradores` com o tamanho da lista.
    -   Faz um `fetch` no endpoint `/api/competencia` para obter a lista de competências e atualiza o estado `numCompetencias`.
    -   As URLs são relativas (`/api/...`) pois o projeto utiliza um proxy configurado no `vite.config.ts` para redirecionar as chamadas para o backend (ex: `http://localhost:8080`).

#### Renderização Condicional

O componente utiliza uma estrutura `if` para decidir o que renderizar com base no estado `view`:

-   **`if (view === 'colaboradores')`**:
    -   Renderiza a visão de colaboradores.
    -   Mostra um botão **"Voltar ao Dashboard"** que, ao ser clicado, altera o estado `view` para `'dashboard'`, retornando à tela principal.
    -   Renderiza o componente `<VisaoColaboradores />`, que é o responsável por exibir a lista de funcionários.

-   **`return (...)` (Default)**:
    -   Se a `view` for `'dashboard'`, renderiza o painel executivo.
    -   **Header**: Título da página.
    -   **Cards de Métricas**: Três cards (`<Card>`) que exibem os estados `numColaboradores`, `numCompetencias`, e `numDesatualizados`.
    -   **Gráfico**: Uma seção para o gráfico de competências, renderizando o componente `<CompetenciasChart />`.
    -   **Footer (Ações)**:
        -   Botão **"Buscar Talentos"**: Ao ser clicado, altera o estado `view` para `'colaboradores'`, mostrando a lista de funcionários.
        -   Botão **"Relatórios Avançados"**: Atualmente sem funcionalidade definida.

### Componentes Utilizados

-   `<Card>`, `<CardContent>`, `<CardHeader>`, `<CardTitle>`: Componentes de UI para exibir as métricas.
-   `<Button>`: Componente de UI para os botões de ação.
-   `<Users>`, `<BarChart2>`, `<AlertTriangle>`, `<ArrowLeft>`: Ícones da biblioteca `lucide-react`.
-   `<CompetenciasChart>`: Componente customizado para exibir o gráfico de competências.
-   `<VisaoColaboradores>`: Componente customizado para exibir a lista e detalhes dos colaboradores.

## `src/pages/PaginaCadastro.tsx`

### Visão Geral

Esta página é responsável pelo cadastro de novos usuários no sistema. Ela contém um formulário completo com validações, formatação de campos e feedback visual para o usuário. A página também inclui uma funcionalidade para alternar entre os modos claro e escuro.

### Estrutura do Código

O componente `PaginaCadastro` é construído com React e utiliza `hooks` para gerenciar o estado do formulário, a lógica de submissão e a aparência da interface.

#### Estados

-   `modoEscuro` (boolean): Controla o tema da aplicação (claro/escuro). A preferência é salva no `localStorage` do navegador.
-   `dadosFormulario` (object): Armazena todos os dados inseridos pelo usuário nos campos do formulário (nome, email, cpf, etc.).
-   `mostrarSenha` (boolean): Controla a visibilidade do campo de senha.
-   `mostrarConfirmarSenha` (boolean): Controla a visibilidade do campo de confirmação de senha.
-   `carregando` (boolean): Indica se o formulário está sendo submetido para a API. Usado para desabilitar o botão de submit e mostrar um indicador de carregamento.
-   `termosAceitos` (boolean): Armazena se o usuário marcou a caixa de "termos de uso".

#### Funções Principais

-   `useEffect`: Monitora o estado `modoEscuro` e aplica a classe `dark` ao elemento `<html>` da página, permitindo que o Tailwind CSS aplique os estilos do tema escuro.
-   `aoMudarInput`: É chamada toda vez que o usuário digita em um campo do formulário.
    -   Atualiza o estado `dadosFormulario` com o novo valor.
    -   Chama funções de formatação (`formatarCPF`, `formatarTelefone`) para os campos específicos, aplicando máscaras em tempo real.
-   `formatarCPF` e `formatarTelefone`: Funções utilitárias que recebem uma string e retornam o valor formatado com a máscara apropriada (ex: `123.456.789-00`).
-   `aoSubmeter`: Função executada quando o usuário envia o formulário.
    1.  Previne o comportamento padrão do formulário (recarregar a página).
    2.  Verifica se as senhas digitadas são iguais.
    3.  Verifica se os termos de uso foram aceitos.
    4.  Define `carregando` como `true`.
    5.  Monta o objeto de dados a ser enviado para a API, removendo campos desnecessários (`confirmarSenha`).
    6.  Faz uma requisição `POST` para o endpoint `/api/usuario` com os dados do novo usuário.
    7.  Em caso de sucesso, exibe um alerta e redireciona o usuário para a página de login (`/login`) usando o hook `useNavigate`.
    8.  Em caso de erro, exibe um alerta com a mensagem de erro retornada pela API.
    9.  Define `carregando` como `false` ao final da requisição (sucesso ou erro).

#### Renderização e UI

-   **Botão de Tema**: Um botão no canto superior esquerdo permite alternar o `modoEscuro`.
-   **Formulário**:
    -   O formulário é organizado com `divs` e estilizado com Tailwind CSS para criar um layout responsivo (`grid`, `md:grid-cols-2`).
    -   Cada campo de input é associado a um ícone (`lucide-react`) para melhorar a experiência visual.
    -   Os campos de senha possuem um botão para alternar a visibilidade do texto.
    -   **Validação**: O botão de "Criar Minha Conta" é desabilitado (`disabled`) se a variável `formularioValido` for `false` ou se `carregando` for `true`. A variável `formularioValido` checa se todos os campos obrigatórios estão preenchidos e se os termos foram aceitos.
    -   **Feedback de Carregamento**: Quando `carregando` é `true`, o texto do botão de submit muda para "Criando conta..." e um ícone de "spinner" é exibido.
-   **Links**: A página contém links para "Fazer login" (que navega para la rota `/login`) e botões para os "termos de uso" e "política de privacidade" (que atualmente mostram um alerta).

### Navegação

-   O hook `useNavigate` da biblioteca `react-router-dom` é utilizado para redirecionar o usuário para outras páginas da aplicação de forma programática (ex: após o cadastro bem-sucedido).

## `src/pages/PaginaLogin.tsx`

### Visão Geral

Esta página permite que os usuários acessem o sistema. Ela fornece um formulário para email e senha, com uma lógica de autenticação que diferencia usuários administradores de usuários comuns. A página também inclui opções como "Lembrar-me", "Esqueci minha senha" e um link para a página de cadastro.

### Estrutura do Código

Assim como as outras páginas, `PaginaLogin` é um componente funcional React que utiliza `hooks` para gerenciar o estado e a interação do usuário.

#### Estados

-   `modoEscuro` (boolean): Controla o tema da aplicação (claro/escuro), com a preferência salva no `localStorage`.
-   `dadosFormulario` (object): Armazena o `email` e a `password` digitados pelo usuário.
-   `mostrarSenha` (boolean): Controla a visibilidade da senha no campo de input.
-   `lembrarDeMim` (boolean): Armazena o estado da checkbox "Lembrar-me" (atualmente sem funcionalidade implementada).
-   `carregando` (boolean): Indica se o login está em andamento, desabilitando o botão de submit e mostrando um feedback visual.

#### Funções Principais

-   `useEffect`: Gerencia a alternância do tema (claro/escuro) de forma idêntica à `PaginaCadastro`.
-   `aoMudarInput`: Atualiza o estado `dadosFormulario` conforme o usuário digita nos campos.
-   `aoSubmeter`: É a função central que lida com a lógica de login quando o formulário é enviado.
    1.  Previne o comportamento padrão do formulário.
    2.  Define `carregando` como `true`.
    3.  **Lógica de Admin**:
        -   Verifica se o email é `admin@altave.com`.
        -   Se for, faz uma verificação de senha local (sem chamar a API).
        -   Se a senha estiver correta (`altave123`), redireciona o admin para o `/dashboard`.
        -   Caso contrário, exibe um alerta de senha incorreta.
    4.  **Lógica de Usuário Comum**:
        -   Chama o endpoint da API `/api/usuario/login` via `POST` para autenticar o usuário.
        -   Se a autenticação for bem-sucedida, a API retorna os dados do usuário.
        -   Em seguida, faz uma segunda chamada `GET` para `/api/colaborador/by-email/{email}` para obter o ID do colaborador associado àquele usuário.
        -   Com o ID do colaborador em mãos, redireciona o usuário para a sua página de perfil (`/profile/{id}`).
    5.  **Tratamento de Erros**: Captura e exibe alertas para diferentes tipos de erro (ex: credenciais inválidas, perfil não encontrado, erro genérico).
    6.  Define `carregando` como `false` no final do processo.

#### Renderização e UI

-   **Layout**: A página possui um layout similar à de cadastro, com um design limpo e centralizado.
-   **Formulário de Login**:
    -   Contém campos para email e senha, com ícones e botão para mostrar/ocultar a senha.
    -   Inclui uma checkbox para "Lembrar-me" e um link para "Esqueci minha senha" (atualmente com funcionalidade de alerta).
    -   O botão "Entrar no Sistema" é desabilitado se o formulário não for válido (`formularioValido`) ou se o login estiver em andamento (`carregando`).
-   **Navegação**:
    -   Um link na parte inferior permite que novos usuários naveguem para a página de cadastro (`/cadastro`).
    -   O hook `useNavigate` é usado para redirecionar os usuários para as páginas `/dashboard` (admin) ou `/profile/{id}` (usuário comum) após o login bem-sucedido).

## `src/pages/PaginaPerfil.tsx`

### Visão Geral

Esta é a página de perfil do colaborador, uma das mais complexas da aplicação. Ela exibe todas as informações detalhadas de um colaborador, como dados pessoais, apresentação, certificações, experiências e competências (Hard e Soft Skills). Além disso, permite a edição dessas informações.

A página é dinâmica e carrega os dados do colaborador com base no `id` presente na URL (ex: `/profile/1`).

### Estrutura do Código

#### Interfaces TypeScript

No início do arquivo, várias `interfaces` (Cargo, Certificacao, Colaborador, etc.) são definidas para garantir a tipagem dos dados recebidos da API, espelhando a estrutura dos modelos de dados do backend.

#### Estados

-   `modoEscuro` (boolean): Gerencia o tema da página.
-   `colaborador` (Colaborador | null): Armazena o objeto com todos os dados do colaborador.
-   `carregando` (boolean): Indica se os dados do perfil estão sendo carregados.
-   `erro` (string | null): Armazena mensagens de erro caso a busca na API falhe.
-   `novaHardSkill` / `novaSoftSkill` (string): Armazenam o valor dos inputs para adicionar novas competências.
-   `emEdicao` (boolean): Controla o modo de edição do perfil. Quando `true`, os campos de texto se tornam inputs editáveis.
-   `colaboradorOriginal` (Colaborador | null): Salva uma cópia do estado do colaborador antes de entrar no modo de edição, para permitir o cancelamento das alterações.

#### Funções Principais

-   `useParams`: Hook do `react-router-dom` para extrair o `id` do colaborador da URL.
-   `buscarColaborador`: Função assíncrona que faz um `fetch` no endpoint `/api/colaborador/{id}` para buscar os dados do perfil e atualizar os estados `colaborador`, `carregando` e `erro`.
-   `useEffect` (com `[id]`): Dispara a função `buscarColaborador` sempre que o `id` na URL muda, garantindo que o perfil correto seja carregado.
-   **Funções de Edição**:
    -   `aoEditar`: Ativa o modo de edição (`setEmEdicao(true)`) e guarda o estado atual do perfil.
    -   `aoCancelar`: Desativa o modo de edição e restaura os dados originais do perfil.
    -   `aoMudarPerfil`: Atualiza o estado `colaborador` conforme o usuário edita os campos.
    -   `aoSalvar`: Envia uma requisição `PUT` para `/api/colaborador/{id}` com os dados atualizados. Se sucesso, atualiza o estado local e desativa o modo de edição.
-   **Funções de CRUD para Skills**:
    -   `adicionarHardSkill` / `adicionarSoftSkill`: Enviam uma requisição `POST` para `/api/hardskill` ou `/api/softskill` para criar uma nova competência associada ao colaborador.
    -   `removerHardSkill` / `removerSoftSkill`: Enviam uma requisição `DELETE` para `/api/hardskill/{skillId}` ou `/api/softskill/{skillId}` para remover uma competência.
    -   Após cada operação, o estado `colaborador` é atualizado para refletir a mudança na UI sem precisar recarregar a página.
-   `aoPressionarTecla`: Permite que o usuário adicione uma skill pressionando a tecla "Enter" no input.

#### Renderização e UI

-   **Carregamento e Erro**: O componente exibe mensagens de "Carregando...", "Erro" ou "Nenhum dado encontrado" com base nos estados `carregando`, `erro` e `colaborador`.
-   **Layout do Perfil**: A página é dividida em seções (cards) para "Sobre mim", "Certificações", "Hard Skills", "Soft Skills" e "Experiência Profissional".
-   **Modo de Edição**:
    -   A UI muda drasticamente quando `emEdicao` é `true`.
    -   Textos (`<h1>`, `<p>`) são substituídos por inputs (`<input>`, `<textarea>`).
    -   O botão "Editar Perfil" é substituído pelos botões "Salvar" e "Cancelar".
-   **Interatividade das Skills**:
    -   As skills são exibidas como "pílulas" (tags).
    -   Ao passar o mouse sobre uma skill, um botão "X" aparece, permitindo a remoção (`removerHardSkill`/`removerSoftSkill`).
    -   Um campo de input e um botão "+" permitem a adição de novas skills.