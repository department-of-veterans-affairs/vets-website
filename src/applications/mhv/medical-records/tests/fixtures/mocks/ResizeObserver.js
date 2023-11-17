/* eslint-disable class-methods-use-this */

/**
 * Pulled this solution from https://stackoverflow.com/questions/64558062/how-to-mock-resizeobserver-to-work-in-unit-tests-using-react-testing-library
 * I also tested the solution using 'resize-observer-polyfill' and that works fine as well, but this
 * solution doesn't require adding any new packages.
 */
class ResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}
/* eslint-enable class-methods-use-this */

window.ResizeObserver = ResizeObserver;
export default ResizeObserver;
