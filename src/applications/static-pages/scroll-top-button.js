export default function initScrollToTopButton() {
  const container = document.querySelector('.vsa-top-button-container');
  let upToTopButton = '';
  let footer = '';
  let threeFourthsContainer = '';

  function initVars() {
    threeFourthsContainer = container.querySelector('.usa-width-three-fourths');
    upToTopButton = container.querySelector('.vsa-top-button');
    footer = document.querySelector('.footer-inner');
    // NOTE: Guarded Return so button does not show at all with errors
    if (!threeFourthsContainer || !upToTopButton || !footer)
      return 'NODE_MISSING_CLASS';

    return 'SUCCESS';
  }

  function scrollListener() {
    // Responsible for toggling animation classes
    const scrollTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    const distanceOfScrollingBeforeAppearing = 600;
    const buttonTransitionIn = 'vsa-top-button-transition-in';
    const buttonTransitionOut = 'vsa-top-button-transition-out';
    const buttonContainerRelative = 'vsa-top-button-container-relative';
    const buttonTransitionReset = 'vsa-top-button-transition-reset';

    function doesElHaveClass(el, className) {
      return el.classList.value.indexOf(className) > -1;
    }

    function isScrolledIntoView(el) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;
      // Only partially || completely visible elements return true
      return elemTop >= 0 && elemTop <= window.innerHeight;
    }

    if (
      scrollTop > distanceOfScrollingBeforeAppearing &&
      !doesElHaveClass(upToTopButton, buttonTransitionIn)
    ) {
      upToTopButton.classList.add(buttonTransitionIn);
      upToTopButton.classList.remove(buttonTransitionOut);
    } else if (
      scrollTop < distanceOfScrollingBeforeAppearing &&
      doesElHaveClass(upToTopButton, buttonTransitionIn)
    ) {
      upToTopButton.classList.add(buttonTransitionOut);
      upToTopButton.classList.remove(buttonTransitionIn);
    }
    if (isScrolledIntoView(footer)) {
      container.classList.add(buttonContainerRelative);
      threeFourthsContainer.classList.add(buttonContainerRelative);
      upToTopButton.classList.add(buttonTransitionReset);
    } else if (doesElHaveClass(container, buttonContainerRelative)) {
      container.classList.remove(buttonContainerRelative);
      threeFourthsContainer.classList.remove(buttonContainerRelative);
      upToTopButton.classList.remove(buttonTransitionReset);
    }
  }

  function navigateToTop() {
    return window.scrollTo(0, 0);
  }

  function assignClickHandlerButtonToDom() {
    const button = container.querySelector('.usa-button.vsa-top-button');
    if (button) button.onclick = navigateToTop();
    // eslint-disable-next-line no-console
    if (!button) console.warn('MISSING_UP_TO_TOP_BUTTON');
  }

  function runScripts() {
    if (!container) return;
    if (initVars() === 'NODE_MISSING_CLASS') return;

    window.addEventListener('scroll', scrollListener);
    assignClickHandlerButtonToDom();
  }

  window.addEventListener('load', runScripts);
}
