/* Tela de login e cadastro.
   - "Criar conta" / "Entrar", no fim de cada formulário, alternam entre os dois modos.
   - Os formulários só validam no navegador: nenhum dado é enviado nem guardado. No sistema real,
     o acesso acontece pelo Keycloak (ver docs/implementacao/README.md). */
(function () {
  'use strict';

  var forms = { login: document.getElementById('login-form'), register: document.getElementById('register-form') };
  if (!forms.login || !forms.register) return;

  var t = function (key) { return window.AOSOLUTI ? window.AOSOLUTI.t(key) : key; };
  var title = document.querySelector('[data-auth-title]');
  var subtitle = document.querySelector('[data-auth-subtitle]');
  var HASH = { login: 'entrar', register: 'cadastro' };

  function setText(el, key) {
    el.setAttribute('data-i18n', key);
    el.textContent = t(key);
  }

  function resetForm(form) {
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    form.querySelectorAll('[id$="-err"]').forEach(function (el) { el.hidden = true; });
    var status = form.querySelector('[data-status]');
    status.hidden = true;
    status.removeAttribute('data-state');
  }

  function setMode(next, opts) {
    opts = opts || {};
    Object.keys(forms).forEach(function (k) {
      forms[k].hidden = k !== next;
      if (k !== next) resetForm(forms[k]);
    });
    setText(title, next === 'login' ? 'login.titleLogin' : 'login.titleRegister');
    setText(subtitle, next === 'login' ? 'login.subtitleLogin' : 'login.subtitleRegister');
    if (!opts.fromHash && history.replaceState) history.replaceState(null, '', '#' + HASH[next]);
    if (opts.focusField) {
      var first = forms[next].querySelector('input');
      if (first) first.focus();
    }
  }

  document.querySelectorAll('[data-auth-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setMode(btn.getAttribute('data-auth-go'), { focusField: true });
    });
  });

  /* ---------- Mostrar / ocultar senha ---------- */
  document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('data-toggle-password'));
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      var labelKey = show ? 'login.hidePassword' : 'login.showPassword';
      btn.setAttribute('data-i18n-attr', 'aria-label:' + labelKey);
      btn.setAttribute('aria-label', t(labelKey));
      btn.querySelector('[data-icon-show]').hidden = show;
      btn.querySelector('[data-icon-hide]').hidden = !show;
    });
  });

  /* ---------- Validação ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_PASSWORD = 12;
  var val = function (id) { return document.getElementById(id).value; };

  var rules = {
    'lf-email': function () { return EMAIL_RE.test(val('lf-email').trim()); },
    'lf-password': function () { return val('lf-password') !== ''; },
    'rf-name': function () { return val('rf-name').trim().split(/\s+/).filter(Boolean).length >= 2; },
    'rf-email': function () { return EMAIL_RE.test(val('rf-email').trim()); },
    'rf-password': function () { return val('rf-password').length >= MIN_PASSWORD; },
    'rf-confirm': function () { return val('rf-confirm') !== '' && val('rf-confirm') === val('rf-password'); }
  };

  function setFieldState(id, ok) {
    var el = document.getElementById(id);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    document.getElementById(id + '-err').hidden = ok;
  }

  function updatePasswordRules() {
    document.getElementById('rf-rule-length').setAttribute('data-ok', String(val('rf-password').length >= MIN_PASSWORD));
    document.getElementById('rf-rule-match').setAttribute('data-ok', String(val('rf-confirm') !== '' && val('rf-confirm') === val('rf-password')));
  }

  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () {
      if (id === 'rf-password' || id === 'rf-confirm') updatePasswordRules();
      if (el.getAttribute('aria-invalid') === 'true') setFieldState(id, rules[id]());
      if (id === 'rf-password' && document.getElementById('rf-confirm').getAttribute('aria-invalid') === 'true') {
        setFieldState('rf-confirm', rules['rf-confirm']());
      }
    });
  });

  function showStatus(form, key, state) {
    var status = form.querySelector('[data-status]');
    setText(status, key);
    status.setAttribute('data-state', state);
    status.hidden = false;
  }

  Object.keys(forms).forEach(function (k) {
    var form = forms[k];
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(rules).forEach(function (id) {
        if (!form.contains(document.getElementById(id))) return;
        var ok = rules[id]();
        setFieldState(id, ok);
        if (!ok && !firstInvalid) firstInvalid = document.getElementById(id);
      });
      if (firstInvalid) {
        showStatus(form, 'login.fixErrors', 'error');
        firstInvalid.focus();
        return;
      }
      /* Nenhum dado é enviado nem guardado por esta página. */
      showStatus(form, 'login.notAvailable', 'info');
    });
  });

  /* ---------- Estado inicial (login.html#cadastro abre o cadastro) ---------- */
  function fromHash() {
    var h = location.hash.replace('#', '');
    setMode(h === HASH.register ? 'register' : 'login', { fromHash: true });
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
