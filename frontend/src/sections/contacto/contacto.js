(function (root) {
  var TL = root.TL = root.TL || {}, NUMBER = '525539761846';
  var section = root.document && (TL.$ ? TL.$('#contacto') : root.document.getElementById('contacto'));
  if (!section) return;
  var form = section.querySelector('form'), status = section.querySelector('[data-status]'), mainLink = section.querySelector('[data-contact-whatsapp]');
  function urlFor(message) { var fromShared = typeof TL.whatsapp === 'function' ? TL.whatsapp(message) : ''; return typeof fromShared === 'string' && fromShared ? fromShared : 'https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(message); }
  function diagnosticText() { var current = TL.diagnostic && typeof TL.diagnostic.getState === 'function' ? TL.diagnostic.getState() : null; if (!current) return ''; return '\n\nDiagnóstico Tlatolli:\n' + TL.diagnostic.buildMessage(current.answers, current.result); }
  function open(message) { if (TL.track) TL.track('whatsapp_click', { label: 'formulario' }); var url = urlFor(message), popup = root.open ? root.open(url, '_blank', 'noopener,noreferrer') : null; status.textContent = popup ? 'WhatsApp se abrió en una pestaña nueva.' : 'Si WhatsApp no se abrió, usa este enlace. '; var link = root.document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Abrir WhatsApp'; status.appendChild(link); }
  function updateMainLink(event) { if (mainLink) mainLink.href = event.detail && event.detail.result ? urlFor(TL.diagnostic.buildMessage(event.detail.answers, event.detail.result)) : 'https://wa.me/' + NUMBER; }
  root.document.addEventListener('tl:diagnostic', updateMainLink);
  form.addEventListener('submit', function (event) { event.preventDefault(); var data = new FormData(form), name = String(data.get('name') || '').trim(), business = String(data.get('business') || '').trim(), need = String(data.get('need') || '').trim(); if (!name || !business || !need) { status.textContent = 'Completa nombre, negocio y necesidad.'; return; } open(['Hola Tlatolli, quiero conversar sobre mi negocio.', 'Nombre: ' + name, 'Negocio: ' + business, 'Necesidad: ' + need].join('\n') + diagnosticText()); });
})(typeof window !== 'undefined' ? window : globalThis);
