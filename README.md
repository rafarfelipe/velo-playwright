<h1 align="center">Velo E2E Testing Automation</h1>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/Status-Concluído-success?style=flat">
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-E2E_Tests-2EAD33?style=flat&logo=playwright">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=flat">
</p>

<br>

## 📌 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Regras de Negócio e Funcionalidades](#-regras-de-negócio-e-funcionalidades)
- [Stack de Tecnologias](#-stack-de-tecnologias)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Como Executar](#-como-executar)
- [Configuração do Supabase](#-configuração-do-supabase)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

Este projeto tem como foco principal garantir a qualidade da aplicação **Velo**, desenvolvida em React e Supabase, através de testes **End-to-End (E2E)** utilizando o **Playwright**.

A abordagem adotada visa simular o comportamento real do usuário ponta-a-ponta, prevenindo regressões, validando a integração entre o frontend e backend (Supabase), e atestando a confiabilidade das principais jornadas de uso.

**O que foi testado e por quê:**
- **Fluxos Críticos de Negócio:** Validamos a experiência do usuário desde o login até as ações principais, garantindo que o coração da aplicação funcione sem interrupções.
- **Resiliência de UI/UX:** Verificação de carregamento de componentes assíncronos e estados de tela (loading, sucesso, erro), reduzindo possíveis falhas de interface.
- **Validação de Formulários:** Uso de dados dinâmicos para assegurar que regras de validação (Zod) e bloqueios funcionem conforme os requisitos de negócio.

---

## 💼 Regras de Negócio e Funcionalidades

O projeto Velo possui fluxos específicos de venda e configuração de veículos, os quais foram alvos fundamentais da automação.

### Fluxo Principal
`Landing` → `Configurador` → `Checkout` → `Análise de Crédito` → `Confirmação`

### Modelo de Preços
- **Preço base:** R$ 40.000
- **Rodas Sport:** + R$ 2.000
- **Precision Park:** + R$ 5.500
- **Flux Capacitor:** + R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

### Análise de Crédito (Mockada)
A aplicação aplica regras automáticas para aprovação do financiamento:

| Score | Resultado | Observação |
|---|---|---|
| **> 700** | Aprovado | - |
| **501 a 700** | Em análise | Se a entrada for ≥ 50% do total, aprova direto. |
| **≤ 500** | Reprovado | Se a entrada for ≥ 50% do total, aprova direto. |

---

## 🛠 Stack de Tecnologias

O projeto e os testes foram construídos utilizando as seguintes ferramentas:

### Automação de Testes
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) 

### Aplicação Principal
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=flat&logo=supabase&logoColor=white)

---

## 🗺️ Rotas da Aplicação

| Rota | Descrição |
|---|---|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout / Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## 🚀 Como Executar

Siga as instruções abaixo para rodar o projeto e os testes automatizados localmente.

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Versão 18+)
- Gerenciador de pacotes ([Yarn](https://yarnpkg.com/) ou npm)

### Executando a Aplicação React

1. Instale as dependências:
```bash
yarn install
```

2. Rode o servidor de desenvolvimento:
```bash
yarn dev
# A aplicação estará disponível em http://localhost:5173
```

**Outros scripts úteis:**
```bash
npm run build # Build de produção
npm run lint  # Verificar código
```

### Executando os Testes E2E (Playwright)

```bash
# Instalar navegadores do Playwright
yarn playwright install

# Executar testes em modo Headless
yarn playwright test

# Executar com a Interface Gráfica (UI Mode)
yarn playwright test --ui

# Visualizar o relatório (HTML)
yarn playwright show-report
```

---

## 🗄️ Configuração do Supabase

### 1. Criar Projeto
- Acesse [supabase.com](https://supabase.com/) e crie uma conta.
- Clique em **New Project**, escolha um nome e senha para o banco.
- Aguarde a criação (~2 minutos).

### 2. Variáveis de Ambiente
Crie o arquivo `.env` na raiz do projeto com as seguintes chaves (encontradas em *Project Settings → API*):
```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

### 3. Deploy (Banco e Edge Functions)
```bash
# Instalar a CLI do Supabase (se ainda não tiver)
yarn add supabase -D

# Fazer login e vincular seu projeto
yarn supabase login
yarn supabase link --project-ref ylhtbnzypxtmlvvhbtyo

# Aplicar migrações (cria tabelas e Políticas RLS)
yarn supabase db push

# Deploy das Edge Functions
yarn supabase functions deploy
```
*(A tabela principal de ordens `orders` contém campos como `order_number` no formato `VLO-XXXXXX`, dados do veículo, dados do cliente e `status` de pagamento).*

---

## 📁 Estrutura do Projeto

Abaixo apresento a organização arquitetural combinando o código da aplicação e a suíte de automação:

```text
velo-playwright/
│
├── playwright/                  # 🤖 Suíte de testes automatizados E2E
│   ├── e2e/                     # Especificações dos testes (Specs)
│   └── support/                 # Arquivos de suporte (Fixtures, Utils, Page Objects)
│
├── src/                         # 💻 Código-fonte da aplicação React
│   ├── components/              # Componentes React
│   │   ├── configurator/        # Configurador do carro
│   │   ├── landing/             # Landing page
│   │   └── ui/                  # Componentes base (shadcn/ui)
│   ├── hooks/                   # Hooks customizados
│   ├── integrations/            # Cliente e setup do Supabase
│   ├── pages/                   # Páginas da aplicação
│   └── store/                   # Estado global (Zustand)
│
├── supabase/                    # 🗄️ Configurações e Edge Functions
│
├── playwright.config.ts         # ⚙️ Configurações do Playwright
├── vite.config.ts               # ⚙️ Configurações do Vite
├── package.json                 # 📦 Dependências do projeto
└── README.md                    # 📄 Documentação
```

---

## 📞 Contato

Ficou com alguma dúvida ou gostaria de debater sobre automação e qualidade de software? Vamos nos conectar!

**Autor:** Rafael Felipe

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafaelrfelipe/) 
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/rafarfelipe)