for (const gallery of document.querySelectorAll('[data-screenshot-gallery]')) {
  const dialog = gallery.querySelector('dialog');
  const links = [...gallery.querySelectorAll('[data-screenshot-trigger]')];
  const image = gallery.querySelector('[data-lightbox-image]');
  const caption = gallery.querySelector('[data-lightbox-caption]');
  const counter = gallery.querySelector('[data-lightbox-counter]');
  if (!(dialog instanceof HTMLDialogElement) || !dialog.showModal || !links.length) continue;

  let currentIndex = 0;
  let opener;
  let backdropPointerDown = false;

  function showImage(index) {
    currentIndex = (index + links.length) % links.length;
    const link = links[currentIndex];
    const thumbnail = link.querySelector('img');
    image.src = link.href;
    image.alt = thumbnail.alt;
    image.width = thumbnail.width;
    image.height = thumbnail.height;
    caption.textContent = link.dataset.caption;
    counter.textContent = `${currentIndex + 1} / ${links.length}`;
  }

  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showImage(index);
      dialog.showModal();
      document.documentElement.classList.add('screenshot-modal-open');
    });
  });

  gallery.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  gallery.querySelector('[data-lightbox-prev]').addEventListener('click', () => showImage(currentIndex - 1));
  gallery.querySelector('[data-lightbox-next]').addEventListener('click', () => showImage(currentIndex + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  function isBackdrop(event) {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }
  dialog.addEventListener('pointerdown', (event) => { backdropPointerDown = isBackdrop(event); });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && backdropPointerDown && isBackdrop(event)) dialog.close();
    backdropPointerDown = false;
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('screenshot-modal-open');
    opener?.focus({ preventScroll: true });
  });
}
