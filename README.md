# aosoluti CRM — landing page

Página estática (HTML + CSS + JS puro), sem etapa de build.

```
index.html            estrutura da página e ilustrações (SVG inline)
assets/css/styles.css tokens de cor (tema claro/escuro), layout e responsivo
assets/js/i18n.js     textos em pt-BR, en e es
assets/js/main.js     seletor de tema, seletor de idioma
assets/img/           favicon
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
- **Ilustrações**: SVGs inline no estilo flat de pessoas (inspirado em humaaans.com), com cores ligadas aos tokens para funcionar nos dois temas.

O tema e o idioma escolhidos ficam salvos no `localStorage` do visitante. Sem escolha salva, o tema segue o sistema e o idioma segue o navegador (padrão pt-BR).
