# aosoluti CRM — landing page

Página estática (HTML + CSS + JS puro), sem etapa de build.

```
index.html              landing page e ilustrações (SVG inline)
contato.html            formulário e canais de contato
privacidade.html        Política de Privacidade (LGPD)
termos.html             Termos de Uso
assets/css/styles.css   tokens de cor (tema claro/escuro), layout e responsivo
assets/js/i18n.js       textos da landing page em pt-BR, en e es
assets/js/i18n-pages.js textos de Contato, Privacidade e Termos
assets/js/main.js       seletor de tema, seletor de idioma
assets/js/contact.js    validação e envio do formulário de contato
assets/img/             favicon
```

## Rodar localmente

```
python3 -m http.server 8080
# abra http://localhost:8080
```

## Personalizar

- **Cores**: variáveis em `:root` (tema claro) e nos blocos `[data-theme="dark"]` / `prefers-color-scheme: dark` em `styles.css`. Os valores vêm do artefato "aosoluti CRM Logo".
- **Textos**: edite `assets/js/i18n.js`. Todo elemento com `data-i18n="chave"` é traduzido; atributos usam `data-i18n-attr="aria-label:chave"`.
- **Login**: os botões "Entrar" / "Acessar o CRM" apontam para `/login`. Troque o `href` em `index.html` pelo endereço do app.
- **Header e footer**: são iguais nas quatro páginas. Ao mudar um deles, replique nas outras.
- **Formulário de contato**: o envio fica desligado até você preencher `data-endpoint` no `<form id="contact-form">` de `contato.html` com a URL que recebe a mensagem. O formulário envia um `POST` em JSON com `name`, `email`, `phone`, `company`, `subject`, `message` e `lang`. Sem endpoint, o visitante vê um aviso para usar os outros canais.
- **Campos a preencher**: os textos entre colchetes, como `[E-MAIL DE CONTATO]`, `[RAZÃO SOCIAL]`, `[CNPJ]`, `[CIDADE/UF]` e `[DATA DA PUBLICAÇÃO]`, estão em `contato.html`, `privacidade.html`, `termos.html` e `assets/js/i18n-pages.js`. Os documentos legais são um modelo: revise com a assessoria jurídica antes de publicar.
- **Ilustrações**: SVGs inline no estilo flat de pessoas (inspirado em humaaans.com), com cores ligadas aos tokens para funcionar nos dois temas.

O tema e o idioma escolhidos ficam salvos no `localStorage` do visitante. Sem escolha salva, o tema segue o sistema e o idioma segue o navegador (padrão pt-BR).
