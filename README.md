# aosoluti CRM — landing page

Site estático com [Tailwind CSS v4](https://tailwindcss.com). O layout é feito com classes utilitárias no HTML; o CSS gerado (`assets/css/styles.css`) fica versionado, então o site funciona em qualquer hospedagem estática sem etapa de build no servidor.

```
index.html              landing page e ilustrações (SVG inline)
precos.html             planos, comparação e perguntas frequentes
contato.html            formulário e canais de contato
privacidade.html        Política de Privacidade (LGPD)
termos.html             Termos de Uso
src/styles.css          fonte do CSS: tokens de tema e itens específicos
assets/css/styles.css   CSS gerado pelo Tailwind (não edite à mão)
assets/js/i18n.js       textos da landing page em pt-BR, en e es
assets/js/i18n-pages.js textos de Preços, Contato, Privacidade e Termos
assets/js/main.js       tema, idioma e aviso de armazenamento
assets/js/contact.js    validação e envio do formulário de contato
assets/js/pricing.js    alternância entre cobrança mensal e anual
assets/img/             favicon
```

## Rodar localmente

```
npm install
npm run watch     # recompila o CSS a cada alteração
npm run serve     # abra http://localhost:8080
```

Antes de commitar, rode `npm run build` para gerar o CSS minificado.

## CSS: Tailwind + itens específicos

- **Classes utilitárias** no HTML para layout, espaçamento, tipografia e cores.
- **Cores do tema** como utilitários ligados a variáveis CSS: `bg-bg`, `bg-bg-alt`, `bg-surface`, `text-ink`, `text-ink-2`, `border-line`, `bg-accent`, `text-accent-strong`, `text-hot` etc. Elas trocam de valor sozinhas no tema escuro, então não é preciso usar `dark:`.
- **Tokens extras**: `font-display` (Space Grotesk), `font-sans` (Figtree), `rounded-card`, `rounded-panel`, `shadow-card`, `max-w-page` e o breakpoint `lg` em 960px.
- **CSS próprio** (`src/styles.css`) só para o que não é utilitário: paletas clara/escura, base tipográfica, animações das ilustrações, seta dos `<select>`, chave liga/desliga (`.switch`), marcadores dos documentos legais e seta das perguntas frequentes.

## Personalizar

- **Cores**: variáveis em `:root` (tema claro) e nos blocos `[data-theme="dark"]` / `prefers-color-scheme: dark` em `src/styles.css`. Os valores vêm do artefato "aosoluti CRM Logo". Depois de mudar, rode `npm run build`.
- **Textos**: edite `assets/js/i18n.js`. Todo elemento com `data-i18n="chave"` é traduzido; atributos usam `data-i18n-attr="aria-label:chave"`.
- **Login**: os botões "Entrar" / "Acessar o CRM" apontam para `/login`. Troque o `href` em `index.html` pelo endereço do app.
- **Header e footer**: são iguais nas cinco páginas. Ao mudar um deles, replique nas outras.
- **Formulário de contato**: o envio fica desligado até você preencher `data-endpoint` no `<form id="contact-form">` de `contato.html` com a URL que recebe a mensagem. O formulário envia um `POST` em JSON com `name`, `email`, `phone`, `company`, `subject`, `message` e `lang`. Sem endpoint, o visitante vê um aviso para usar os outros canais.
- **Campos a preencher**: os textos entre colchetes, como `[E-MAIL DE CONTATO]`, `[RAZÃO SOCIAL]`, `[CNPJ]`, `[CIDADE/UF]` e `[DATA DA PUBLICAÇÃO]`, estão em `contato.html`, `privacidade.html`, `termos.html` e `assets/js/i18n-pages.js`. Os documentos legais são um modelo: revise com a assessoria jurídica antes de publicar.
- **Preços**: os valores em `precos.html` são fictícios. Cada preço tem `data-price-monthly` e `data-price-annual`, e o total anual fica em `data-annual-total`. Os nomes e recursos dos planos estão em `assets/js/i18n-pages.js` (chaves `pricing.*`).
- **Ilustrações**: SVGs inline no estilo flat de pessoas (inspirado em humaaans.com), com cores ligadas aos tokens para funcionar nos dois temas.

## Aviso de armazenamento (cookies / localStorage)

O site não usa cookies. Tema e idioma só são guardados no `localStorage` se o visitante permitir:

- Na primeira visita aparece um aviso com **Aceitar**, **Recusar** e **Ver o que é guardado**. Esta última opção abre uma janela com cada item (`aosoluti-theme`, `aosoluti-lang`), o valor atual e uma chave para permitir ou não.
- A escolha fica em `aosoluti-consent` (`{ v, theme, lang, at }`), para o aviso não voltar a cada visita.
- Sem permissão, nada além da escolha é gravado: tema e idioma voltam ao padrão (tema do sistema, idioma do navegador, padrão pt-BR) a cada visita.
- O link **Preferências de privacidade**, no rodapé, reabre a janela para mudar a escolha.
- Ao adicionar uma nova informação guardada no navegador, inclua-a na janela (`index.html`), em `main.js` (`PREFS`), na seção 7 da Política de Privacidade e aumente `CONSENT_VERSION` para perguntar de novo.
