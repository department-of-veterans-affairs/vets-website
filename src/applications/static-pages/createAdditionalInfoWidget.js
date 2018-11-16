export default function createAdditionalInfoWidget() {
  const widgets = Array.from(
    document.querySelectorAll('.additional-info-button'),
  );

  if (widgets.length) {
    widgets.forEach(el => {
      el.addEventListener('click', () => {
        const chevron = el.querySelector('i.fa-angle-down');
        const ariaExpanded =
          el.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
        el.parentNode.classList.toggle('form-expanding-group-open');
        el.setAttribute('aria-expanded', ariaExpanded);
        chevron.classList.toggle('open');
      });
    });
  }
}
