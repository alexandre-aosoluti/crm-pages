/* Formulário de contato.
   Para ativar o envio, preencha data-endpoint no <form id="contact-form"> com a URL
   que recebe a mensagem (API própria ou serviço de formulários). O corpo é enviado
   como JSON: { name, email, phone, company, subject, message, lang }. */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('cf-status');
  var submit = form.querySelector('button[type="submit"]');
  var t = function (key) { return window.AOSOLUTI ? window.AOSOLUTI.t(key) : key; };
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var checks = [
    { id: 'cf-name', valid: function (el) { return el.value.trim() !== ''; } },
    { id: 'cf-email', valid: function (el) { return EMAIL_RE.test(el.value.trim()); } },
    { id: 'cf-message', valid: function (el) { return el.value.trim() !== ''; } },
    { id: 'cf-consent', valid: function (el) { return el.checked; } }
  ];

  function setFieldState(id, ok) {
    var el = document.getElementById(id);
    var msg = document.getElementById(id + '-err');
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (msg) msg.hidden = ok;
  }

  /* Mensagem de status traduzível: guarda a chave para o seletor de idioma retraduzir. */
  function showStatus(key, kind) {
    status.setAttribute('data-i18n', key);
    status.textContent = t(key);
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
    status.hidden = false;
  }

  function validate() {
    var firstInvalid = null;
    checks.forEach(function (c) {
      var el = document.getElementById(c.id);
      var ok = c.valid(el);
      setFieldState(c.id, ok);
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    return firstInvalid;
  }

  checks.forEach(function (c) {
    var el = document.getElementById(c.id);
    var evt = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evt, function () {
      if (el.getAttribute('aria-invalid') === 'true') setFieldState(c.id, c.valid(el));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var invalid = validate();
    if (invalid) {
      showStatus('contact.fixErrors', 'error');
      invalid.focus();
      return;
    }

    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) {
      showStatus('contact.notConfigured', 'error');
      return;
    }

    var data = new FormData(form);
    var payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      company: data.get('company'),
      subject: data.get('subject'),
      message: data.get('message'),
      lang: document.documentElement.lang
    };

    submit.disabled = true;
    showStatus('contact.sending', '');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showStatus('contact.sent', 'success');
      })
      .catch(function () {
        showStatus('contact.fail', 'error');
      })
      .then(function () {
        submit.disabled = false;
      });
  });
})();
