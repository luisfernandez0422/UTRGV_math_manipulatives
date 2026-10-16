(() => {
  'use strict';
  const list = document.getElementById('poster-list');
  const count = document.getElementById('poster-count');
  const empty = document.getElementById('poster-empty');
  const filters = document.querySelector('.filters');
  const title = document.getElementById('empty-title');
  const description = document.getElementById('empty-description');
  const labels = { teachers: 'For teachers', students: 'For students' };

  // Only allow assets within this Downloads folder; no external scripts or URLs.
  function assetPath(value, extensions) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const base = new URL('./', window.location.href);
      const url = new URL(value, base);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) ||
          !extensions.some(ext => url.pathname.toLowerCase().endsWith(ext))) return null;
      return url.href;
    } catch { return null; }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  if (!Array.isArray(window.MATH_POSTERS)) {
    count.textContent = 'Posters unavailable';
    title.textContent = 'The poster collection could not load';
    description.textContent = 'Please refresh this page or try again later.';
    empty.hidden = false;
    return;
  }
  const posters = window.MATH_POSTERS.filter(p => p && typeof p.title === 'string' &&
    p.title.trim() && assetPath(p.pdf, ['.pdf']) && Array.isArray(p.audiences) &&
    p.audiences.some(a => labels[a]));

  function render(category) {
    list.replaceChildren();
    const shown = posters.filter(p => category === 'all' || p.audiences.includes(category));
    count.textContent = `${shown.length} ${shown.length === 1 ? 'poster' : 'posters'}`;
    empty.hidden = shown.length !== 0;
    title.textContent = posters.length ? 'No posters in this category yet' : 'Posters are on the way';
    description.textContent = posters.length
      ? 'Choose All posters to browse the available collection.'
      : 'Printable mathematics posters will appear here as they are added. Please check back soon.';
    for (const p of shown) {
      const item = element('li');
      const card = element('article', 'card poster-card');
      const preview = element('div', 'poster-preview');
      const previewURL = assetPath(p.preview, ['.png', '.jpg', '.jpeg', '.webp', '.svg']);
      const fallback = () => preview.replaceChildren(element('span', '', 'Preview unavailable · Open the PDF below'));
      if (previewURL) {
        const img = element('img');
        img.src = previewURL;
        img.alt = p.previewAlt || `Preview of ${p.title}`;
        img.loading = 'lazy';
        img.addEventListener('error', fallback, { once: true });
        preview.append(img);
      } else fallback();
      const body = element('div', 'card-body');
      body.append(element('p', 'topic', [...new Set(p.audiences)].filter(a => labels[a]).map(a => labels[a]).join(' · ')));
      body.append(element('h3', '', p.title));
      if (p.description) body.append(element('p', 'description', p.description));
      body.append(element('p', 'poster-meta', ['PDF', p.paperSize, p.fileSize].filter(Boolean).join(' · ')));
      const actions = element('div', 'poster-actions');
      const view = element('a', '', 'View PDF');
      view.href = assetPath(p.pdf, ['.pdf']);
      view.target = '_blank';
      view.rel = 'noopener';
      view.setAttribute('aria-label', `View ${p.title} PDF (opens in a new tab)`);
      const download = element('a', '', 'Download PDF ↓');
      download.href = view.href;
      download.download = new URL(view.href).pathname.split('/').pop();
      download.setAttribute('aria-label', `Download ${p.title} PDF`);
      actions.append(view, download);
      body.append(actions);
      card.append(preview, body);
      item.append(card);
      list.append(item);
    }
  }
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    for (const other of filters.querySelectorAll('button')) {
      other.setAttribute('aria-pressed', String(other === button));
    }
    render(button.dataset.category);
  });
  render('all');
})();
