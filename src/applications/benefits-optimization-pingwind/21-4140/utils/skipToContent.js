export const skipToContent = event => {
  event?.preventDefault?.();

  const focusContent =
    typeof window !== 'undefined' ? window.focusContent : undefined;
  if (typeof focusContent === 'function') {
    focusContent(event);
    return;
  }

  if (typeof document === 'undefined') {
    return;
  }

  const target = document.querySelector('#main-content');
  if (!target) {
    return;
  }

  const addedTabIndex = !target.hasAttribute('tabindex');
  if (addedTabIndex) {
    target.setAttribute('tabindex', '-1');
  }

  const removeTabIndex = () => {
    if (addedTabIndex) {
      target.removeAttribute('tabindex');
    }
    target.removeEventListener('blur', removeTabIndex, true);
  };

  target.addEventListener('blur', removeTabIndex, true);

  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    const topOffset =
      target.getBoundingClientRect().top + (window.pageYOffset || 0);
    window.scrollTo(0, topOffset);
  } else if (typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ block: 'start' });
  }

  target.focus();
};
