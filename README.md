# Diretório de usuários

Aplicação React que lista os usuários da API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/users), com **busca tolerante a erros**, **modal de detalhes** e um **globo 3D** que mostra onde cada usuário está.

Feito como desafio técnico para vaga de Desenvolvedor Front-End Júnior (React + Vite + TypeScript).

### 🔗 [Ver online](https://react-typescript-technical-test-mu.vercel.app/)

Publicado na Vercel, com deploy automático a cada push na `main`.

<!-- Para adicionar uma imagem: salve um print em docs/preview.png e descomente a linha abaixo -->
<!-- ![Tela principal: lista de usuários à esquerda e globo à direita](docs/preview.png) -->

![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/testes-Vitest%20%2B%20RTL-6e9f18?logo=vitest&logoColor=white)

---

## Sumário

- [Como rodar](#como-rodar)
- [Funcionalidades](#funcionalidades)
- [Requisitos do desafio](#requisitos-do-desafio)
- [Busca inteligente](#busca-inteligente)
- [Arquitetura](#arquitetura)
- [Decisões técnicas](#decisões-técnicas)
- [Testes](#testes)
- [Observações](#observações)

---

## Como rodar

**Pré-requisito:** Node.js **22.12 ou superior** (há um `.nvmrc`; com nvm, rode `nvm use`).

```bash
git clone https://github.com/Thiago-Tolosa/react-typescript-technical-test.git
cd react-typescript-technical-test
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

| Script               | O que faz                             |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento           |
| `npm test`           | Roda os testes uma vez                |
| `npm run test:watch` | Testes em modo watch                  |
| `npm run typecheck`  | Checagem de tipos                     |
| `npm run lint`       | ESLint                                |
| `npm run build`      | Checagem de tipos + build de produção |
| `npm run preview`    | Serve o build de produção localmente  |

---

## Funcionalidades

- **Lista de usuários** com nome, email, cidade e empresa
- **Busca por nome** que ignora acentos, pontuação e ordem das palavras, aceita erros de digitação e ordena por relevância
- **Modal de detalhes** com nome completo, email, telefone, empresa, cidade, endereço, website e um mini-globo focado no usuário
- **Globo 3D** com todos os usuários:
  - ao passar o mouse (ou focar com <kbd>Tab</kbd>) num registro, o globo gira até ele e mostra a cidade
  - ao passar o mouse num ponto do globo, a linha do usuário é destacada na lista (e rolada até ficar visível)
  - clicar num ponto abre o modal do usuário, igual a clicar na lista
  - arrastar gira o globo; com o cursor sobre ele, a rotação automática pausa para os pontos não fugirem
  - quando a busca deixa um único resultado, o globo centraliza nele
- **Estados de carregamento** (skeleton com o mesmo formato das linhas), **erro** (com botão "Tentar novamente") e **busca sem resultados**
- **Atalhos:** <kbd>/</kbd> foca a busca, <kbd>Esc</kbd> limpa a busca ou fecha o modal
- **Responsivo:** no celular o painel do globo some e o globo aparece só dentro do modal
- **Acessível:**
  - modal com `<dialog>` nativo (foco preso, Esc e clique fora para fechar)
  - navegação por teclado e rótulos para leitores de tela
  - respeita `prefers-reduced-motion`

---

## Requisitos do desafio

### Obrigatórios

| Requisito                                                           | Status | Onde                                       |
| ------------------------------------------------------------------- | :----: | ------------------------------------------ |
| Listar usuários do endpoint `/users`                                |   ✅   | `features/users/api/fetchUsers.ts`         |
| Exibir nome e email                                                 |   ✅   | `features/users/components/UserRow`        |
| Campo de busca filtrando pelo nome                                  |   ✅   | `lib/search` + `UsersToolbar`              |
| Detalhes ao clicar: nome completo, email, telefone, empresa, cidade |   ✅   | `features/users/components/UserDetails`    |
| Estados visuais de carregando e erro                                |   ✅   | `UserListSkeleton`, `UsersResults`         |
| Código organizado, componentizado e tipado                          |   ✅   | ver [Arquitetura](#arquitetura)            |
| Roda com `npm install` e `npm run dev`                              |   ✅   |                                            |

### Diferenciais

| Diferencial                           | Status | Como                                                      |
| ------------------------------------- | :----: | --------------------------------------------------------- |
| CSS Modules / Tailwind / Styled       |   ✅   | CSS Modules + design tokens em variáveis CSS              |
| Melhorias de UI/UX                    |   ✅   | globo, busca tolerante, atalhos, skeleton, acessibilidade |
| Testes (Jest / React Testing Library) |   ✅   | Vitest + React Testing Library, 41 testes                 |

> O Vitest foi usado no lugar do Jest por ser o padrão do ecossistema Vite: ele usa a mesma configuração do projeto e tem API compatível com a do Jest (`describe`, `it`, `expect`).

---

## Busca inteligente

Implementada do zero em [`src/lib/search`](src/lib/search), sem biblioteca externa. É genérica: serve para qualquer lista, e a feature de usuários só informa qual texto comparar.

| Busca              | Encontra                      | Por quê                                 |
| ------------------ | ----------------------------- | --------------------------------------- |
| `mrs dennis`       | Mrs. Dennis Schulist          | pontuação é ignorada                    |
| `dennis mrs`       | Mrs. Dennis Schulist          | ordem das palavras não importa          |
| `nich run`         | Nicholas Runolfsdottir V      | palavras incompletas contam             |
| `jose`             | José                          | acentos e maiúsculas são ignorados      |
| `denis`, `schulst` | Mrs. Dennis Schulist          | tolera erros de digitação               |
| `clementina`       | Clementina, depois Clementine | resultado exato vem antes do aproximado |

**Como funciona**

1. Busca e nome viram listas de palavras normalizadas, sem acento, sem pontuação e em minúsculas (`tokenize`).
2. **Toda** palavra da busca precisa corresponder a alguma palavra do nome. Cada correspondência tem um custo:
   - início de palavra: `den` → `dennis` (custo 0)
   - trecho no meio: `nnis` → `dennis` (custo 1)
   - erro de digitação: `denis` → `dennis` (custo 2, medido pela [distância de Levenshtein](https://pt.wikipedia.org/wiki/Dist%C3%A2ncia_Levenshtein))
3. Os resultados são ordenados pelo custo total; empates mantêm a ordem original.

**Quantos erros são tolerados**

O limite cresce com o tamanho de cada palavra digitada:

| Tamanho do termo | Erros aceitos | Exemplo                        |
| ---------------- | :-----------: | ------------------------------ |
| 1 a 3 letras     |       0       | `jse` não encontra `jose`      |
| 4 a 7 letras     |       1       | `denis` → `dennis`             |
| 8 ou mais letras |       2       | `clemetnine` → `clementine`    |

Em palavras curtas, um único erro muda boa parte da palavra: aceitar `ana` com 1 erro traria `ava`, `ama`, `anna`… Em palavras longas, 1 erro é pouco, porque é mais fácil errar duas letras digitando rápido. Os limites ficam em `allowedTypos`, em [`searchByText.ts`](src/lib/search/searchByText.ts).

Cada "erro" é uma letra inserida, removida ou trocada. O termo é comparado com o **início** da palavra em três tamanhos (o tamanho do termo, uma letra a menos e uma a mais). Assim o erro é aceito mesmo com a palavra ainda incompleta: `schulst` casa com `schulist` porque, comparado com as 8 primeiras letras, falta só o "i".

---

## Arquitetura

O código é organizado **por feature**: cada pasta agrupa o que muda junto. As features não importam umas das outras, e quem as conecta é a camada `app/`.

```
src/
├── app/                        # Composição: monta a página e conecta as features
│   ├── App.tsx
│   ├── components/
│   │   ├── LocationPanel/      # Painel lateral: globo + dados do usuário em foco
│   │   └── GlobeSlot/          # Globo com fallback de carregamento (Suspense)
│   └── mappers/
│       └── usersToGlobePoints.ts   # Converte User → GlobePoint
│
├── features/
│   ├── users/                  # Domínio "usuários"
│   │   ├── api/                # fetchUsers
│   │   ├── hooks/              # useUsers: loading / error / success
│   │   ├── types/              # Tipos da resposta da API
│   │   ├── utils/              # busca, iniciais, coordenadas (+ testes)
│   │   ├── components/         # UserList, UserRow, UserDetails, UsersToolbar...
│   │   └── index.ts            # API pública da feature
│   │
│   └── globe/                  # Globo genérico: não conhece "usuário", só pontos
│       ├── hooks/
│       │   ├── useCobeGlobe.ts     # Parte imperativa (WebGL + animação)
│       │   └── useGlobePointer.ts  # Hover, clique e arraste nos pontos
│       ├── utils/
│       │   ├── rotation.ts         # Ângulos para centralizar um ponto (+ testes)
│       │   └── projection.ts       # lat/lng → posição na tela; ponto sob o cursor (+ testes)
│       ├── config.ts               # Raio, elevação e área de clique compartilhados
│       ├── components/Globe/
│       └── index.ts
│
├── components/                 # UI genérica: Modal, Button, SearchField, Skeleton, StatusMessage
├── hooks/                      # Hooks genéricos: useMediaQuery, useElementWidth
├── lib/
│   ├── http.ts                 # getJson: fetch que lança erro em status não-2xx
│   └── search/                 # Busca tolerante (tokenize, levenshtein, searchByText)
├── styles/                     # tokens.css (cores, fontes, raios) e global.css
└── test/                       # Setup do Vitest e fixtures
```

**Regras seguidas**

- **Dependências em uma direção só:** `app` → `features` → `components` / `hooks` / `lib`. Nunca ao contrário.
- **Cada feature expõe uma API pública** pelo `index.ts`. O resto do app não importa arquivos internos dela.
- **Cada componente tem sua pasta**, com `.tsx`, `.module.css` e `index.ts`.
- **Testes ficam ao lado do código que testam** (`*.test.ts`).

---

## Decisões técnicas

- **`useUsers` retorna uma união discriminada.** O estado é `{ status: 'loading' } | { status: 'error', message } | { status: 'success', users }`, então não existe estado impossível, como ter `users` e `error` ao mesmo tempo. A requisição é cancelada com `AbortController` se o componente desmontar.
- **O resultado da busca é derivado, não fica em estado.** `visibleUsers` é calculado com `useMemo` a partir de `users` e `query`, então não há nada para sincronizar.
- **`getJson` trata status HTTP.** O `fetch` nativo só rejeita em falha de rede; um 404 ou 500 passaria como sucesso sem esse cuidado.
- **`UserDetails` recebe o globo por um slot (`aside`).** Assim a feature de usuários não depende da feature do globo.
- **O globo é criado uma única vez.** Mudanças de foco e marcadores chegam por `globe.update()`, sem recriar o contexto WebGL a cada render.
- **Clique nos pontos sem depender da lib.** O cobe desenha num canvas e não diz qual ponto foi clicado. `projection.ts` reproduz a projeção dele para saber onde cada ponto está na tela, e o clique pega o ponto visível mais próximo do cursor. A área de clique (14px) é maior que o ponto (~6px), e pontos atrás do globo são ignorados.
- **O destaque guarda a origem (`list` ou `globe`).** Vindo da lista, o globo gira até o ponto. Vindo do globo, a lista rola até a linha, mas o globo não gira, senão o ponto fugiria do cursor.
- **Clique e arraste são diferenciados por distância.** Se o ponteiro andar menos de 4px entre apertar e soltar, é clique; mais que isso, é arraste e não abre o modal.
- **O globo é carregado sob demanda** (`React.lazy`) e fica num arquivo separado do bundle principal. A lista aparece antes, sem esperar o WebGL.
- **O modal usa `<dialog>` nativo**, que já traz foco preso, Esc e camada superior sem código extra.
- **[cobe](https://github.com/shuding/cobe) no lugar de three.js:** ~5 kB contra centenas, e faz exatamente o necessário (pontos num globo).
- **Fontes empacotadas com `@fontsource`**, sem depender de CDN externa. Só o subset latino é carregado.

---

## Testes

```bash
npm test
```

São 41 testes, divididos assim:

- **Fluxo completo do app** (`App.test.tsx`):
  - carregamento, lista, busca e estado vazio
  - abrir e fechar o modal com os campos exigidos
  - erro com retry
- **Lista** (`UserList.test.tsx`): destaque vindo do globo, rolagem até a linha, hover e clique.
- **Busca** (`searchByText.test.ts`, `searchUsersByName.test.ts`): tokenização, Levenshtein, tolerância a erros e ordenação por relevância.
- **Globo** (`projection.test.ts`, `rotation.test.ts`): ponto centralizado na tela, pontos atrás do globo, direção do arraste e ponto sob o cursor.
- **Utilitários:** iniciais e formatação de coordenadas.

O `fetch` é simulado com `vi.spyOn`, e o globo (WebGL) é substituído por um componente vazio, já que o jsdom não tem WebGL.

---

## Observações

- **As coordenadas do JSONPlaceholder são fictícias.** A Leanne Graham "mora" no Oceano Índico, por isso muitos pontos caem no mar. O app avisa isso no painel do globo.
- **A etiqueta com o nome da cidade no globo usa CSS Anchor Positioning.** Funciona em Chrome e Edge; nos outros navegadores ela não aparece e o resto funciona normalmente.
