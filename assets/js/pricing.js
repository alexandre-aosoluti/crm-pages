/* Página de preços: alterna entre cobrança mensal e anual. */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('[data-billing]');
  if (!buttons.length) return;

  var t = function (key) { return window.AOSOLUTI ? window.AOSOLUTI.t(key) : key; };
  var mode = 'monthly';

  function render() {
    buttons.forEach(function (btn) {
      var on = btn.getAttribute('data-billing') === mode;
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('[data-price-monthly]').forEach(function (el) {
      el.textContent = el.getAttribute('data-price-' + mode);
    });
    document.querySelectorAll('[data-bill-monthly]').forEach(function (el) {
      var text = t(el.getAttribute('data-bill-' + mode));
      el.textContent = text.replace('{total}', el.getAttribute('data-annual-total') || '');
    });
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      mode = btn.getAttribute('data-billing');
      render();
    });
    btn.addEventListener('keydown', function (e) {
      var step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = buttons[(i + step + buttons.length) % buttons.length];
      mode = next.getAttribute('data-billing');
      render();
      next.focus();
    });
  });

  /* O seletor de idioma retraduz a página; refaz os textos de cobrança no idioma novo. */
  document.addEventListener('aosoluti:lang', render);
  render();
})();
