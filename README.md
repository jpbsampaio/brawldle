# 🎮 Brawldle

Um jogo diário inspirado no Globle/Termo onde você precisa adivinhar o Brawler secreto do Brawl Stars em até 6 tentativas.

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Jogar](#-como-jogar)
- [Melhorias Futuras](#-melhorias-futuras)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

Brawldle é um jogo de adivinhação diário onde os jogadores tentam descobrir o Brawler secreto do Brawl Stars usando dicas sobre raridade, função, gênero e ano de lançamento. Cada dia apresenta um novo desafio com um Brawler diferente.

## 💻 Tecnologias

- Next.js 15
- TypeScript
- Tailwind CSS
- React 19
- Radix UI
- Lucide React (Ícones)
- Class Variance Authority

## ✨ Funcionalidades

- ✅ Jogo diário com Brawler diferente
- ✅ Sistema de dicas por cores (Verde/Amarelo/Cinza)
- ✅ Autocomplete com sugestões de Brawlers
- ✅ Persistência de progresso no localStorage
- ✅ Sistema de compartilhamento de resultados
- ✅ Feedback visual com toasts

## 📁 Estrutura do Projeto

```
brawldle/
├── src/
│   ├── app/              # Páginas e rotas
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes de UI base
│   │   ├── Header.tsx   # Cabeçalho do jogo
│   │   ├── GuessInput.tsx # Input de palpites
│   │   ├── GuessRow.tsx # Linha de palpite
│   │   └── ...          # Outros componentes
│   ├── data/            # Dados dos Brawlers
│   └── lib/             # Utilitários
├── public/              # Arquivos estáticos
└── ...
```

## 🎮 Como Jogar

1. **Objetivo**: Adivinhe o Brawler secreto do dia em até 6 tentativas
2. **Palpites**: Digite o nome de um Brawler válido
3. **Dicas por Cores**:
    - 🟢 **Verde**: Atributo correto
    - 🟡 **Amarelo**: Ano maior/menor que o correto
    - ⚪ **Cinza**: Atributo incorreto
4. **Atributos**: Nome, Raridade, Função, Gênero, Ano de Lançamento

## 🚀 Melhorias Futuras

1. **Modos de Jogo**
    - Modo endless (sem limite de tentativas)
    - Modo speed (tempo limitado)
    - Modo por imagem

2. **Estatísticas**
    - Streak de vitórias
    - Percentual de acerto

3. **Interface**
    - Melhoria geral de UI
    - Animações com Framer Motion
    - internacionalização (i18n)
    - Melhores indicadores visuais
    - Melhoria na sugestão de palpite
    - Ajuste de responsividade

4. **Acessibilidade**
    - Suporte a leitores de tela
    - Navegação por teclado

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Made with ❤️ by [jpbsampaio](https://github.com/jpbsampaio)
