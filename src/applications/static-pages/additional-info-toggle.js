document.addEventListener('DOMContentLoaded', () => {
  const expanderButton = document.getElementById('crisis-expander-link');

  if (expanderButton) {
    const expanderContent = document.getElementById('crisis-expander-content');
    const chevron = expanderButton.querySelector('i.fa-angle-down');

    expanderButton.addEventListener('click', () => {
      const isAriaExpanded = JSON.parse(
        expanderButton.getAttribute('aria-expanded'),
      );

      expanderButton.setAttribute('aria-expanded', `${!isAriaExpanded}`);
      expanderContent.classList.toggle('expander-content-closed');
      chevron.classList.toggle('open');
    });
  }
});
