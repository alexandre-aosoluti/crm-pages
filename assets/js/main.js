(function () {
  'use strict';

  var THEME_KEY = 'aosoluti-theme';
  var LANG_KEY = 'aosoluti-lang';
  var CONSENT_KEY = 'aosoluti-consent';
  var CONSENT_VERSION = 1;
  var LANGS = ['pt-BR', 'en', 'es'];
  var dict = window.AOSOLUTI_I18N || {};
  var root = document.documentElement;

  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* armazenamento indisponível */ }
  }
  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* armazenamento indisponível */ }
  }

  /* ---------- Consentimento de armazenamento ----------
     Tema e idioma só são guardados no navegador se o visitante permitir.
     A escolha fica em "aosoluti-consent": { v, theme, lang, at }. */
  var PREFS = { theme: THEME_KEY, lang: LANG_KEY };
  var current = { theme: 'system', lang: 'pt-BR' };

  function readConsent() {
    try {
      var c = JSON.parse(read(CONSENT_KEY));
      if (c && c.v === CONSENT_VERSION) return c;
    } catch (e) { /* valor inválido */ }
    return null;
  }

  var consent = readConsent();

  function allowed(pref) { return !!(consent && consent[pref]); }

  function persist(pref, value) {
    current[pref] = value;
    if (allowed(pref)) write(PREFS[pref], value);
  }

  /* Sem consentimento válido, descarta preferências gravadas antes deste aviso existir. */
  Object.keys(PREFS).forEach(function (pref) {
    if (!allowed(pref)) remove(PREFS[pref]);
  });

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
    persist('theme', value);
    updateConsentValues();
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
    persist('lang', lang);
    updateConsentValues();
  }

  function detectLang() {
    var saved = allowed('lang') ? read(LANG_KEY) : null;
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

  /* ---------- Aviso e preferências de armazenamento ---------- */
  var banner = document.getElementById('consent-banner');
  var dialog = document.getElementById('consent-dialog');
  var prefTheme = document.getElementById('pref-theme');
  var prefLang = document.getElementById('pref-lang');

  var THEME_LABEL = { light: 'theme.light', dark: 'theme.dark', system: 'theme.system' };
  var LANG_LABEL = { 'pt-BR': 'Português (Brasil)', en: 'English', es: 'Español' };

  function updateConsentValues() {
    var themeValue = document.getElementById('pref-theme-value');
    var langValue = document.getElementById('pref-lang-value');
    if (themeValue) themeValue.textContent = t(root.lang, THEME_LABEL[current.theme]);
    if (langValue) langValue.textContent = LANG_LABEL[current.lang];
  }

  function fitBanner() {
    document.body.style.paddingBottom = banner && !banner.hidden ? banner.offsetHeight + 'px' : '';
  }

  function showBanner(show) {
    if (!banner) return;
    banner.hidden = !show;
    fitBanner();
  }

  function saveConsent(choice) {
    consent = {
      v: CONSENT_VERSION,
      theme: !!choice.theme,
      lang: !!choice.lang,
      at: new Date().toISOString()
    };
    write(CONSENT_KEY, JSON.stringify(consent));
    Object.keys(PREFS).forEach(function (pref) {
      if (consent[pref]) write(PREFS[pref], current[pref]);
      else remove(PREFS[pref]);
    });
    showBanner(false);
    if (dialog && dialog.open) dialog.close();
  }

  function openDialog() {
    if (!dialog) return;
    prefTheme.checked = allowed('theme');
    prefLang.checked = allowed('lang');
    updateConsentValues();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-consent]') : null;
    if (!el) return;
    var action = el.getAttribute('data-consent');
    if (action === 'accept') saveConsent({ theme: true, lang: true });
    else if (action === 'reject') saveConsent({ theme: false, lang: false });
    else if (action === 'save') saveConsent({ theme: prefTheme.checked, lang: prefLang.checked });
    else if (action === 'details') openDialog();
    else if (action === 'close' && dialog) dialog.close();
  });

  window.addEventListener('resize', fitBanner);

  /* ---------- Inicialização ---------- */
  applyTheme(allowed('theme') ? read(THEME_KEY) : 'system');
  applyLang(detectLang());
  showBanner(!consent);

  /* Tradução para outros scripts da página (ex.: formulário de contato). */
  window.AOSOLUTI = {
    t: function (key) { return t(root.lang, key); }
  };

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
