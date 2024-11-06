import { getMotionPreference, getElementPosition } from './utils';

// Let form system controll scroll behavior
window.history.scrollRestoration = 'manual';

const motionPreference = getMotionPreference() ? 'instant' : 'smooth';

/**
 * @typedef ScrollOptions
 * @type {Object}
 * @property {Number} top - top scroll position (overrides calculated position)
 * @property {Number} left=0 - left scroll position
 * @property {Number} offset - positive or negative top offset
 * @property {Number} delay - delay scroll time (ms)
 */
/**
 * Scroll element to top of the page
 * @param {String|Number|Element} el - selector, number, or element to position
 * @param {ScrollOptions} scrollOptions - settings & overrides
 */
export function scrollTo(el, scrollOptions = {}) {
  setTimeout(() => {
    const options = {
      top: getElementPosition(el) + (scrollOptions.offset || 0),
      left: 0,
      behavior: motionPreference,
      ...scrollOptions,
    };
console.log('scrollTo', el, options)
    document.body.scrollTo({
      top: Math.round(options.top),
      left: options.left,
      behavior: options.behavior,
    });
  }, scrollOptions.delay || 250);
}

export function scrollToTop(position = 'topScrollElement', scrollOptions = {}) {
  scrollTo(position, scrollOptions);
}
