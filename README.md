# 🛒 Shoppe Car 2026 - Carrinho de Compras Backend & CLI

[![Node Version](https://img.shields.io/badge/node-%3E%3D24.0.0-green.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Testing](https://img.shields.io/badge/tests-native%20runner-brightgreen.svg)](https://nodejs.org/api/test.html)

Uma simulação robusta de carrinho de compras controlada inteiramente no backend, estruturada em **Arquitetura MVC** usando **Node.js** e **Express**. O projeto conta com um **Cliente CLI Interativo** avançado (com cores e tabelas customizadas) que pode se conectar diretamente à API REST ou rodar localmente caso o servidor esteja offline.

---

## 📋 Visão Geral

Este projeto demonstra o funcionamento de regras de negócio de e-commerce gerenciadas de forma centralizada pelo backend. Ele implementa o ciclo de vida completo de um carrinho de compras: **adição, modificação de quantidade, remoção de itens e esvaziamento**, além do cálculo automático do subtotal por produto, quantidade de itens no carrinho e preço total geral.

A interação simula um fluxo de e-commerce real, mas sem a necessidade de uma interface gráfica web (GUI), utilizando um console dinâmico e amigável.

---

## 🛠️ Tecnologias Utilizadas

A stack do projeto foi projetada para ter **zero dependências externas complexas**, priorizando recursos nativos modernos do Node.js:

- **Node.js (v24.11.1)**: Execução rápida, suporte a fetch nativo e APIs modernas.
- **Express.js (v5.2.1)**: Framework web minimalista para construção da API REST.
- **ES Modules (ESM)**: Uso de padrão oficial de importação (`import`/`export`) configurado no Node.
- **Node Test Runner (`node:test`)**: Framework nativo de testes assíncronos de alto desempenho.
- **Readline (Nativo)**: Gerenciamento assíncrono de entradas e saídas do console no CLI.

---

## 📂 Estrutura do Projeto

O código é separado por responsabilidades seguindo o padrão MVC no backend e a separação de interesses (HTML, CSS, JS) no frontend estático:

```
shoppe_cart-2026/
├── src/
│   ├── controllers/      # Controladores que gerenciam requisições e respostas da API
│   ├── middlewares/      # Validadores de dados e tratamento centralizado de erros
│   ├── routes/           # Rotas da API (/api/cart)
│   ├── services/         # Entidades de negócio (Cart, Item) contendo a lógica central
│   ├── public/           # Dashboard visual do desenvolvedor e playground
│   │   ├── css/
│   │   │   └── style.css # Estilos, design (glow, layouts e tabela)
│   │   ├── js/
│   │   │   └── app.js    # Inteligência do cliente (fetch, DOM e logs de console)
│   │   └── index.html    # Marcação estrutural limpa e sem scripts/estilos inline
│   ├── server.js         # Ponto de entrada do servidor Express
│   └── cli.js            # Ponto de entrada do cliente CLI interativo
├── tests/                # Testes automatizados do negócio
├── package.json          # Metadados do projeto e scripts npm
└── README.md             # Esta documentação
```

---

## ⚙️ Pré-requisitos & Instalação

Para rodar o projeto localmente, você precisa ter instalado:

- **Node.js** (versão 18.0.0 ou superior recomendada. Testado na v24.11).
- **Git** (para clonar o repositório).

### 1. Clonar o Repositório

Abra o seu terminal e execute:

```bash
git clone https://github.com/seu-usuario/shoppe_car2026.git
cd shoppe_car2026
```

### 2. Instalar as Dependências

Instale o Express.js necessário para o funcionamento da API:

```bash
npm install
```

---

## 🚀 Como Executar

O projeto possui scripts dedicados para inicialização do servidor, testes e CLI.

### 🧪 Executar Testes Unitários

Os testes verificam se as regras de cálculo e manipulação de produtos estão 100% corretas antes do deployment:

```bash
npm test
```

### 🖥️ Iniciar o Servidor Backend (API)

Inicia a API REST na porta **3001** com reinicialização em tempo real nativa ao alterar o código:

```bash
npm run dev
```

### 🛒 Iniciar o CLI Cliente Interativo

Com o servidor rodando (ou desligado se quiser simular offline), execute em **outro terminal**:

```bash
npm run cli
```

---

## 🔌 Rotas da API REST

A API responde no endereço `http://localhost:3001/api/cart`.

- **`GET /api/cart`**: Retorna a lista de itens, o total de produtos e a soma total em dinheiro.
- **`POST /api/cart/items`**: Adiciona um produto ao carrinho. Se o produto já existir, sua quantidade é incrementada.
    - _Exemplo de body:_ `{"name": "Mouse Gamer", "price": 149.90, "quantity": 1}`
- **`PATCH /api/cart/items/:name`**: Altera a quantidade absoluta do produto. Se a nova quantidade for `0`, o item é deletado do carrinho.
    - _Exemplo de body:_ `{"quantity": 3}`
- **`DELETE /api/cart/items/:name`**: Remove um produto do carrinho.
- **`DELETE /api/cart`**: Esvazia o carrinho de compras.

---

## ✨ Melhorias Implementadas & Próximos Passos

### 📈 Melhorias que já foram feitas

1. **Agrupamento de Itens**: Adicionar um produto já existente altera sua quantidade em vez de criar uma linha duplicada na listagem.
2. **Validação de Payload**: Validação estrita contra valores nulos, strings vazias, preços negativos ou frações numéricas nos campos de quantidade.
3. **CLI Inteligente (Dual-Mode)**: O terminal tenta se conectar à API backend, mas chaveia de forma transparente para rodar a lógica local na memória caso detecte que o servidor está offline, exibindo um status visual amigável (`🟢 CONECTADO` vs `🟡 MODO LOCAL`).
4. **Tratamento de Exceções**: Retornos padronizados no padrão JSON para erros 400 (Bad Request) e 404 (Not Found).
5. **Modernização para ESM**: Migração completa para ES Modules sem uso de bundlers adicionais.
6. **Modularização de Frontend (HTML, CSS, JS)**: Refatoração do dashboard visual para separar a estrutura HTML dos estilos CSS externos e comportamentos dinâmicos Javascript, seguindo as boas práticas de cacheabilidade, reuso de código e legibilidade.

### 🔮 Melhorias sugeridas para o futuro

- **Banco de Dados Persistente**: Substituir a instância na memória do servidor por um banco leve como SQLite, PostgreSQL ou MongoDB.
- **Múltiplos Carrinhos**: Suportar o gerenciamento de múltiplos carrinhos por ID de sessão de usuário.
- **Autenticação de Usuários**: Proteger as rotas da API com autenticação JWT.
- **Documentação Interativa (Swagger/OpenAPI)**: Gerar uma rota visual com a documentação interativa dos endpoints.
