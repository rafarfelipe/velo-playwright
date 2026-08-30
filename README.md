<h1 align="center">Velo E2E Testing Automation</h1>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge">
  <img alt="Playwright" src="https://img.shields.io/badge/Playwright-E2E_Tests-2EAD33?style=for-the-badge&logo=playwright">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
</p>

<br>

## 📌 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Stack de Tecnologias](#-stack-de-tecnologias)
- [Como Executar](#-como-executar)
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

## 🛠 Stack de Tecnologias

O projeto e os testes foram construídos utilizando as seguintes ferramentas:

### Automação de Testes
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 

### Aplicação Principal
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

---

## 🚀 Como Executar

Siga as instruções abaixo para rodar o projeto e os testes automatizados localmente em sua máquina.

### Pré-requisitos
Certifique-se de ter os seguintes itens instalados:
- [Node.js](https://nodejs.org/) (Versão 18+)
- Gerenciador de pacotes ([Yarn](https://yarnpkg.com/) ou npm)

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/rafarfelipe/velo-playwright.git
cd velo-playwright
```

2. **Instale as dependências:**
```bash
yarn install
# ou npm install
```

3. **Instale os navegadores do Playwright:**
```bash
yarn playwright install
# ou npx playwright install
```

4. **Execute os testes em modo Headless (padrão):**
```bash
yarn playwright test
# ou npx playwright test
```

5. **Execute os testes com a Interface Gráfica (UI Mode) do Playwright:**
```bash
yarn playwright test --ui
# ou npx playwright test --ui
```

6. **Para visualizar o relatório de testes (HTML Report):**
```bash
yarn playwright show-report
# ou npx playwright show-report
```

---

## 📁 Estrutura do Projeto

Abaixo apresento a organização arquitetural do repositório, separando claramente o código da aplicação e a suíte de automação:

```text
velo-playwright/
│
├── playwright/                  # 🤖 Suíte de testes automatizados E2E
│   ├── e2e/                     # Especificações dos testes de ponta-a-ponta (Specs)
│   └── support/                 # Arquivos de suporte (Fixtures, Utils, Page Objects)
│
├── src/                         # 💻 Código-fonte da aplicação React
├── supabase/                    # 🗄️ Configurações e migrations do banco de dados
│
├── playwright.config.ts         # ⚙️ Configurações globais do Playwright (Navegadores, Retries, Timeouts)
├── vite.config.ts               # ⚙️ Configurações do bundler Vite
├── tailwind.config.ts           # 🎨 Configurações de estilização do Tailwind
├── package.json                 # 📦 Dependências e scripts do projeto
└── README.md                    # 📄 Documentação (Você está aqui!)
```

---

## 📞 Contato

Ficou com alguma dúvida ou gostaria de debater sobre automação e qualidade de software? Vamos nos conectar!

**Autor:** Rafael Felipe

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafaelrfelipe/) 
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rafarfelipe)