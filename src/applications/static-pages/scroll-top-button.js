/**
 * This button is used for navigating the user back to the top of the page.
 * It's to be used on long article pages.
 * There is some complexity in the animation toggling function "scrollListener"
 * html is located in src/site/components/up_to_top_button.html
 */
import { focusElement } from 'platform/utilities/ui';

function navigateToTop() {
  focusElement('body.merger');
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
  buttonContainer,
  footer,
  layoutContainer,
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
    buttonContainer.classList.add(buttonClasses.containerRelative);
    layoutContainer.classList.add(buttonClasses.containerRelative);
    button.classList.add(buttonClasses.transitionReset);
  } else if (
    doesElHaveClass(buttonContainer, buttonClasses.containerRelative)
  ) {
    buttonContainer.classList.remove(buttonClasses.containerRelative);
    layoutContainer.classList.remove(buttonClasses.containerRelative);
    button.classList.remove(buttonClasses.transitionReset);
  }
}

function setup() {
  const buttonContainer = document.getElementById('top-button-container');
  if (!buttonContainer) return;

  const upToTopButton = document.querySelector('.vsa-top-button');
  if (!upToTopButton) return;
  // The current page likely does not contain a "Back to top" button in its layout.

  const layoutContainer = document.getElementById('usa-width-container');
  const footer = document.getElementById('footerNav');

  const buttonClasses = {
    transitionIn: 'va-top-button-transition-in',
    transitionOut: 'va-top-button-transition-out',
    containerRelative: 'va-top-button-container-relative',
    transitionReset: 'va-top-button-transition-reset',
  };

  if (!layoutContainer || !footer) return;
  // Attach listeners
  upToTopButton.addEventListener('click', navigateToTop);
  window.addEventListener('scroll', () =>
    scrollListener(
      upToTopButton,
      buttonContainer,
      footer,
      layoutContainer,
      buttonClasses,
    ),
  );
}

export default () => document.addEventListener('DOMContentLoaded', setup);
