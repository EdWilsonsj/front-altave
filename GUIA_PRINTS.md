# Guia para Captura de Prints de Tela

Este documento lista todos os prints necessários para completar os manuais do sistema Altave.

---

## Como Capturar Prints no Windows

**Opção 1: Ferramenta de Captura (Recomendado)**
1. Pressione `Windows + Shift + S`
2. Selecione a área desejada
3. O print é copiado para a área de transferência
4. Cole em um editor de imagens e salve

**Opção 2: Print Screen**
1. Pressione `PrtScn` para capturar a tela inteira
2. Ou `Alt + PrtScn` para capturar apenas a janela ativa
3. Cole em um editor de imagens e salve

---

## Organização dos Arquivos

Salve todos os prints na pasta: `docs/imagens/`

**Nomenclatura:**
- `print_01_cadastro.png`
- `print_02_login.png`
- E assim por diante

**Formato:** PNG ou JPG  
**Resolução mínima:** 1280x720

---

## Lista de Prints Necessários

### PRINT 1: Tela de Cadastro Completa

**Página:** `/cadastro`

**O que mostrar:**
- Formulário completo de cadastro
- Todos os campos visíveis:
  - Nome completo
  - E-mail
  - CPF (com máscara aplicada)
  - Telefone (com máscara aplicada)
  - Data de nascimento
  - Senha
  - Confirmação de senha
- Checkbox de termos de uso marcada
- Botão "Criar Minha Conta"
- Link para "Fazer login"
- Tema claro ou escuro (capturar ambos se possível)

**Estado ideal:**
- Campos preenchidos com dados fictícios
- Nenhuma mensagem de erro
- Interface limpa

---

### PRINT 2: Tela de Login

**Página:** `/login`

**O que mostrar:**
- Logo ou título do sistema
- Campo de e-mail
- Campo de senha
- Checkbox "Lembrar-me"
- Link "Esqueci minha senha"
- Botão "Entrar no Sistema"
- Link "Criar uma conta"
- Botão de alternar tema (canto superior)

**Estado ideal:**
- Interface vazia (sem dados preenchidos)
- Layout limpo e centralizado

---

### PRINT 3: Tela de Perfil Completa

**Página:** `/profile/:id`

**O que mostrar:**
- Cabeçalho com nome do colaborador
- Seção "Sobre mim" com texto de apresentação
- Seção "Certificações" com exemplos
- Seção "Hard Skills" com várias competências
- Seção "Soft Skills" com várias habilidades
- Seção "Experiência Profissional"
- Botão "Editar Perfil" no canto superior
- Botão de tema no canto oposto

**Estado ideal:**
- Perfil completo com dados realistas
- Pelo menos 5 hard skills
- Pelo menos 5 soft skills
- Pelo menos 2 certificações
- Histórico de experiência preenchido

---

### PRINT 4: Tela de Perfil em Modo de Edição

**Página:** `/profile/:id` (em edição)

**O que mostrar:**
- Mesma página do PRINT 3, mas em modo de edição
- Campos de texto transformados em inputs editáveis
- Botões "Salvar" e "Cancelar" em vez de "Editar Perfil"
- Cursor visível em algum campo (opcional)

**Como obter:**
1. Acesse o perfil
2. Clique em "Editar Perfil"
3. Capture a tela

---

### PRINT 5: Seção de Competências com Exemplo de Adição/Remoção

**Página:** `/profile/:id` (seção específica)

**O que mostrar:**
- Seção "Hard Skills" em foco
- Várias competências já adicionadas
- Campo de entrada para nova competência
- Botão "+" ao lado do campo
- Mouse sobre uma competência (mostrando o "X" de remoção)

**Dica de captura:**
- Zoom na seção de competências
- Mostrar interação de hover

---

### PRINT 6: Tela Minha Equipe (Visão Colaborador)

**Página:** `/minha-equipe`

**Login como:** Colaborador comum (não supervisor nem diretor)

**O que mostrar:**
- Título "Minha Equipe"
- Saudação com nome do colaborador
- Seção "Meu Supervisor" com card do supervisor
- Seção "Meus Colegas de Equipe" com múltiplos cards
- Cada card mostrando:
  - Nome
  - Cargo
  - E-mail

---

### PRINT 7: Tela Minha Equipe (Visão Supervisor)

**Página:** `/minha-equipe`

**Login como:** Supervisor

**O que mostrar:**
- Seção "Meu Diretor" com card
- Seção "Minha Equipe" com cards dos subordinados
- Contador de membros da equipe
- Seção "Outros Supervisores"
- Badge "SUPERVISOR" nos cards apropriados

---

### PRINT 8: Tela Minha Equipe (Visão Diretor)

**Página:** `/minha-equipe`

**Login como:** Diretor

**O que mostrar:**
- Seção "Supervisores" com todos os supervisores
- Contador de supervisores
- Seção "Todos os Colaboradores"
- Contador total de colaboradores
- Badges identificando os supervisores

---

### PRINT 9: Dashboard com Métricas e Gráfico

**Página:** `/dashboard`

**Login como:** Admin

**O que mostrar:**
- Três cards de métricas:
  - Total de colaboradores
  - Total de competências
  - Perfis desatualizados
- Gráfico de competências (BarChart)
- Dois botões na parte inferior:
  - "Buscar Talentos"
  - "Relatórios Avançados"

**Estado ideal:**
- Sistema com dados suficientes para gráfico significativo
- Números realistas nas métricas

---

### PRINT 10: Tela de Busca de Colaboradores

**Página:** `/dashboard` (após clicar em "Buscar Talentos")

**O que mostrar:**
- Botão "Voltar ao Dashboard"
- Barra de pesquisa no topo
- Lista de cards de colaboradores
- Cada card com:
  - Nome
  - Cargo
  - E-mail
  - Competências (se visíveis)

**Dica:**
- Pode mostrar um termo de busca aplicado
- Resultados filtrados visíveis

---

### PRINT 11: Barra Lateral Completa

**Página:** Qualquer página administrativa

**O que mostrar:**
- Barra lateral expandida
- Logo/título "Altave"
- Menu com três itens:
  - Dashboard (com ícone)
  - Minha Equipe (com ícone)
  - Meu Perfil (com ícone)
- Item ativo destacado
- Botão "Sair" no rodapé

**Como capturar:**
- Foco na barra lateral
- Pode ser um recorte da tela

---

### PRINT 12: Comparação entre Tema Claro e Escuro

**Página:** Qualquer página (sugestão: login ou perfil)

**O que mostrar:**
- Duas imagens lado a lado:
  - Mesma tela em modo claro
  - Mesma tela em modo escuro
- Destacar diferenças visuais
- Botão de alternância de tema visível

**Como criar:**
1. Capture a tela em modo claro
2. Alterne para modo escuro
3. Capture novamente
4. Use editor para colocar lado a lado

---

### PRINT 13: Fluxograma do Processo de Login

**Tipo:** Diagrama técnico

**O que criar:**
- Fluxograma mostrando:
  1. Usuário acessa `/login`
  2. Digita credenciais
  3. Sistema valida
  4. Decisão: Admin ou Usuário comum?
  5. Redireciona para `/dashboard` ou `/profile/:id`
  6. Tratamento de erro

**Ferramenta sugerida:**
- Draw.io (https://app.diagrams.net)
- Lucidchart
- Mermaid
- Microsoft Visio

**Formato:**
- PNG ou SVG
- Fundo branco para impressão

---

### PRINT 14: Diagrama de Estados do Perfil

**Tipo:** Diagrama técnico

**O que criar:**
- Diagrama de estados mostrando:
  - Estado inicial: Visualização
  - Ação: Clique "Editar Perfil"
  - Estado: Edição ativa
  - Ações possíveis:
    - Salvar (volta para Visualização com dados atualizados)
    - Cancelar (volta para Visualização com dados originais)

**Formato:**
- Diagrama de máquina de estados
- PNG ou SVG

---

### PRINT 15: Estrutura de Componentes do Dashboard

**Tipo:** Diagrama técnico

**O que criar:**
- Diagrama hierárquico mostrando:
  - `PaginaDashboard` (raiz)
    - `Card` (Colaboradores)
    - `Card` (Competências)
    - `Card` (Desatualizados)
    - `CompetenciasChart`
    - `Button` (Buscar Talentos)
    - `Button` (Relatórios)
  - Quando view = 'colaboradores':
    - `VisaoColaboradores`

**Formato:**
- Árvore de componentes
- PNG ou SVG

---

### PRINT 16: Catálogo de Componentes UI

**Tipo:** Showcase de componentes

**O que criar:**
- Página ou imagem mostrando todos os componentes base:
  - Botões (variantes: default, primary, secondary, outline)
  - Cards (diferentes estilos)
  - Inputs (vazio, preenchido, com erro)
  - Checkboxes (marcado, desmarcado)
  - Labels

**Como criar:**
1. Criar página temporária no sistema exibindo todos os componentes
2. Ou usar ferramenta de design (Figma, Sketch)
3. Capturar todos em uma única imagem organizada

---

## Checklist Final

Após capturar todos os prints:

- [ ] Todos os 16 prints estão salvos
- [ ] Nomes de arquivo seguem o padrão
- [ ] Imagens têm boa resolução
- [ ] Não há informações sensíveis visíveis
- [ ] Dados fictícios foram usados
- [ ] Imagens estão na pasta `docs/imagens/`

---

## Inserindo Prints nos Manuais

Após capturar todos os prints:

1. Abra os arquivos `MANUAL_USUARIO.md` e `MANUAL_PROGRAMACAO.md`
2. Localize os marcadores de print (ex: **PRINT 1**)
3. Adicione a imagem logo após:

```markdown
**PRINT 1**: Tela de cadastro completa

![Tela de cadastro](docs/imagens/print_01_cadastro.png)
```

Ou, se preferir formato HTML para controle de tamanho:

```markdown
**PRINT 1**: Tela de cadastro completa

<img src="docs/imagens/print_01_cadastro.png" alt="Tela de cadastro" width="800">
```

---

## Dicas Gerais

**Qualidade:**
- Use resolução mínima de 1280x720
- Prefira PNG para melhor qualidade
- Evite JPEG com alta compressão

**Conteúdo:**
- Use dados fictícios realistas
- Evite informações sensíveis
- Mantenha interface limpa

**Consistência:**
- Use o mesmo tema em prints relacionados
- Mantenha o mesmo nível de zoom
- Use fonte e idioma consistentes

**Acessibilidade:**
- Garanta bom contraste
- Texto legível mesmo em impressão
- Alternativas em texto (atributo alt)

---

**Data de Criação**: Novembro 2025  
**Revisão**: 1.0
