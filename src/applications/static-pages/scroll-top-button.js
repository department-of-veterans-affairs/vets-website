/**
 * This button is used for navigating the user back to the top of the page.
 * It's to be used on long article pages.
 * There is some complexity in the animation toggling function "scrollListener"
 * html is located in src/site/components/up_to_top_button.html
 */

function navigateToTop() {
  return window.scrollTo(0, 0);
}

function doesElHaveClass(el, className) {
  return el.classList.contains(className);
}

function isScrolledIntoView(el) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  // Only partially || completely visible elements return true
  return elemTop >= 0 && elemTop <= window.innerHeight;
}

function getScrolledDistanceFromTopOfScreen() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
}

// Responsible for toggling animation classes
function scrollListener(
  button,
  container,
  footer,
  threeFourthsContainer,
  buttonClasses,
) {
  const distanceOfScrollingBeforeAppearing = 600;
  const scrollFromTop = getScrolledDistanceFromTopOfScreen();

  if (
    scrollFromTop > distanceOfScrollingBeforeAppearing &&
    !doesElHaveClass(button, buttonClasses.transitionIn)
  ) {
    button.classList.add(buttonClasses.transitionIn);
    button.classList.remove(buttonClasses.transitionOut);
  } else if (
    scrollFromTop < distanceOfScrollingBeforeAppearing &&
    doesElHaveClass(button, buttonClasses.transitionIn)
  ) {
    button.classList.add(buttonClasses.transitionOut);
    button.classList.remove(buttonClasses.transitionIn);
  }

  if (isScrolledIntoView(footer)) {
    container.classList.add(buttonClasses.containerRelative);
    threeFourthsContainer.classList.add(buttonClasses.containerRelative);
    button.classList.add(buttonClasses.transitionReset);
  } else if (doesElHaveClass(container, buttonClasses.containerRelative)) {
    container.classList.remove(buttonClasses.containerRelative);
    threeFourthsContainer.classList.remove(buttonClasses.containerRelative);
    button.classList.remove(buttonClasses.transitionReset);
  }
}

function setup() {
  const container = document.querySelector('.vsa-top-button-container');
  if (!container) return;

  const upToTopButton = container.querySelector('.vsa-top-button');
  if (!upToTopButton) return;
  // The current page likely does not contain a "Back to top" button in its layout.

  const threeFourthsContainer = container.querySelector(
    '.usa-width-three-fourths',
  );
  const footer = document.querySelector('.footer-inner');
  const buttonClasses = {
    transitionIn: 'vsa-top-button-transition-in',
    transitionOut: 'vsa-top-button-transition-out',
    containerRelative: 'vsa-top-button-container-relative',
    transitionReset: 'vsa-top-button-transition-reset',
  };

  if (!threeFourthsContainer || !footer) return;
  // Attach listeners
  upToTopButton.addEventListener('click', navigateToTop);
  window.addEventListener('scroll', () =>
    scrollListener(
      upToTopButton,
      container,
      footer,
      threeFourthsContainer,
      buttonClasses,
    ),
  );
}

export default () => document.addEventListener('DOMContentLoaded', setup);
