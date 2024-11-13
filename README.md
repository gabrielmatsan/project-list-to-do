# Projeto To-Do

Este projeto é uma aplicação de lista de tarefas (to-do) construída para gerenciar e acompanhar tarefas com um sistema de autenticação e integração com um banco de dados PostgreSQL. Ele inclui testes automatizados configurados via GitHub Actions, garantindo que todas as funcionalidades estejam operando conforme esperado.

## Sumário

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Configuração](#configuração)
- [Rodando o Projeto](#rodando-o-projeto)
- [Executando os Testes](#executando-os-testes)
- [CI/CD com GitHub Actions](#ci-cd-com-github-actions)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Tecnologias

- Node.js 20.x
- PostgreSQL 13
- pnpm
- GitHub Actions

## Funcionalidades

- Adicionar, editar e remover tarefas.
- Marcar tarefas como concluídas.
- Autenticação para garantir que cada usuário acesse apenas suas próprias tarefas.
- Testes automatizados para verificar o funcionamento correto da aplicação.

## Configuração

1. **Pré-requisitos**: 
   - Instale o [Node.js](https://nodejs.org/) (20.x).
   - Instale o [pnpm](https://pnpm.io/) para gerenciar as dependências.
   - Instale o [Docker](https://www.docker.com) para criar contâiners
