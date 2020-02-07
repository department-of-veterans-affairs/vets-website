export default () => {
  document.addEventListener('click', event => {
    // Derive element properties.
    const element = event?.target;
    const tagName = element?.tagName;
    const href = element?.attributes?.href?.value;

    // Escape early if it's not an anchor tag.
    if (tagName !== 'A') {
      return;
    }

    // Escape early if it does not contain an href.
    if (!href) {
      return;
    }

    // Escape early if it's not a jump-link.
    if (!href.startsWith('#')) {
      return;
    }

    // Derive the jump element.
    const jumpElementID = href.replace('#', '');
    const jumpElement = document.getElementById(jumpElementID);

    // Escape early if no jump element was found.
    if (!jumpElement) {
      return;
    }

    // Prevent immediately jumping.
    event.preventDefault();

    // Smooth scroll to the element (Browser compatibility: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView).
    jumpElement.scrollIntoView({ behavior: 'smooth' });

    // Escape early if the hash is already up-to-date.
    if (window.location.hash === href) {
      return;
    }

    // Update the URL hash to equal the href since we did `event.preventDefault()` above.
    // WARNING: Do not update window.location.hash, otherwise it will autoscroll without 'smooth' behavior.
    history.pushState({}, '', href);
  });
};
