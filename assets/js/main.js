(function () {
  'use strict';

  var THEME_KEY = 'aosoluti-theme';
  var LANG_KEY = 'aosoluti-lang';
  var LANGS = ['pt-BR', 'en', 'es'];
  var dict = window.AOSOLUTI_I18N || {};
  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* armazenamento indisponível */ }
  }

  /* ---------- Tema: claro / sistema / escuro ---------- */
  var themeButtons = document.querySelectorAll('[data-theme-value]');

  function applyTheme(value) {
    if (value === 'light' || value === 'dark') {
      root.setAttribute('data-theme', value);
    } else {
      value = 'system';
      root.removeAttribute('data-theme');
    }
    themeButtons.forEach(function (btn) {
      var on = btn.getAttribute('data-theme-value') === value;
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });
    write(THEME_KEY, value);
  }

  themeButtons.forEach(function (btn, i) {
    btn.addEventListener('click', function () { applyTheme(btn.getAttribute('data-theme-value')); });
    btn.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = themeButtons[(i + step + themeButtons.length) % themeButtons.length];
      applyTheme(next.getAttribute('data-theme-value'));
      next.focus();
    });
  });

  applyTheme(read(THEME_KEY) || 'system');

  /* ---------- Idioma ---------- */
  var langSelect = document.getElementById('lang');
  var base = dict['pt-BR'] || {};

  function t(lang, key) {
    var table = dict[lang] || {};
    return table[key] != null ? table[key] : base[key];
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = 'pt-BR';
    root.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = t(lang, el.getAttribute('data-i18n'));
      if (value != null) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var value = t(lang, parts[1]);
        if (parts[0] && value != null) el.setAttribute(parts[0], value);
      });
    });

    var metaKey = document.body.getAttribute('data-meta-key') || 'meta.description';
    var meta = document.querySelector('meta[name="description"]');
    if (meta && t(lang, metaKey)) meta.setAttribute('content', t(lang, metaKey));

    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey && t(lang, titleKey)) document.title = t(lang, titleKey);

    if (langSelect) langSelect.value = lang;
    write(LANG_KEY, lang);
  }

  function detectLang() {
    var saved = read(LANG_KEY);
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || 'pt-BR').toLowerCase();
    if (nav.indexOf('pt') === 0) return 'pt-BR';
    if (nav.indexOf('es') === 0) return 'es';
    if (nav.indexOf('en') === 0) return 'en';
    return 'pt-BR';
  }

  if (langSelect) {
    langSelect.addEventListener('change', function () { applyLang(langSelect.value); });
  }
  applyLang(detectLang());

  /* Tradução para outros scripts da página (ex.: formulário de contato). */
  window.AOSOLUTI = {
    t: function (key) { return t(root.lang, key); }
  };

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
