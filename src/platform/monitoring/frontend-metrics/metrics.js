/**
 * Collection of functions to embed and capture frontend performance metrics.
 * Leverages the Performance interface in modern browsers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance
 */

import Raven from 'raven-js';

/**
 * Capture metrics with a PerformanceObserver object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe
 */
function captureMetrics() {
  const observer = new PerformanceObserver(list => {
    list.getEntriesByType('navigation').forEach(entry => {
      window.addEventListener('unload', () => {
        // TODO: Send method to backend outlined in https://github.com/department-of-veterans-affairs/vets.gov-team/issues/13355
      });
    });
  });

  try {
    observer.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    Raven.captureException(error);
  }
}

/**
 * Return whether the browser supports the APIs we'll be using
 */
function canCaptureMetrics() {
  if (performance === undefined) {
    return false;
  } else if (!('PerformanceObserver' in window)) {
    return false;
  }
  return true;
}

/**
 * Add a metricsObserver to the page after load event is complete.
 */
function addMetricsObserver() {
  window.addEventListener('load', () => {
    captureMetrics();
  });
}

export default function embedMetrics() {
  if (canCaptureMetrics()) {
    addMetricsObserver();
    return true;
  }
  return false;
}
