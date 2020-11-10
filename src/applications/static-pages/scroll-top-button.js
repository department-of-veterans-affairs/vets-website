/**
 * This button is used for navigating the user back to the top of the page.
 * It's to be used on long article pages.
 * There is some complexity in the animation toggling function "scrollListener"
 * html is located in src/site/components/up_to_top_button.html
 */

let threeFourthsContainer = '';
let footer = '';
const container = document.querySelector('.vsa-top-button-container');
const distanceOfScrollingBeforeAppearing = 600;
const BUTTON_CLASSES = {
  TRANSITION_IN: 'vsa-top-button-transition-in',
  TRANSITION_OUT: 'vsa-top-button-transition-out',
  CONTAINER_RELATIVE: 'vsa-top-button-container-relative',
  TRANSITION_RESET: 'vsa-top-button-transition-reset',
};

function navigateToTop() {
  return window.scrollTo(0, 0);
}

function scrollListener(button) {
  // Responsible for toggling animation classes
  const scrollFromTop =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;

  function doesElHaveClass(el, className) {
    return el.classList.contains(className);
  }

  function isScrolledIntoView(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    // Only partially || completely visible elements return true
    return elemTop >= 0 && elemTop <= window.innerHeight;
  }

  const {
    TRANSITION_IN,
    TRANSITION_OUT,
    TRANSITION_RESET,
    CONTAINER_RELATIVE,
  } = BUTTON_CLASSES;

  if (
    scrollFromTop > distanceOfScrollingBeforeAppearing &&
    !doesElHaveClass(button, TRANSITION_IN)
  ) {
    button.classList.add(TRANSITION_IN);
    button.classList.remove(TRANSITION_OUT);
  } else if (
    scrollFromTop < distanceOfScrollingBeforeAppearing &&
    doesElHaveClass(button, TRANSITION_IN)
  ) {
    button.classList.add(TRANSITION_OUT);
    button.classList.remove(TRANSITION_IN);
  }
  if (isScrolledIntoView(footer)) {
    container.classList.add(CONTAINER_RELATIVE);
    threeFourthsContainer.classList.add(CONTAINER_RELATIVE);
    button.classList.add(TRANSITION_RESET);
  } else if (doesElHaveClass(container, CONTAINER_RELATIVE)) {
    container.classList.remove(CONTAINER_RELATIVE);
    threeFourthsContainer.classList.remove(CONTAINER_RELATIVE);
    button.classList.remove(TRANSITION_RESET);
  }
}

function setup() {
  const upToTopButton = container.querySelector('.vsa-top-button');

  if (!upToTopButton) {
    // The current page likely does not contain a "Back to top" button in its layout.
    return;
  }

  // ... Grab other DOM refs
  threeFourthsContainer = container.querySelector('.usa-width-three-fourths');
  footer = document.querySelector('.footer-inner');
  if (!threeFourthsContainer || !footer) return;

  // Attach listeners
  upToTopButton.addEventListener('click', navigateToTop);
  window.addEventListener('scroll', () => scrollListener(upToTopButton));
}

export default () => document.addEventListener('DOMContentLoaded', setup);
