import Raven from 'raven-js';
import isMetricsEnabled from './feature-flag';

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
 * Returns whether the browser supports the APIs we'll be using
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
*  Returns whether metrics are enabled via feature flag.
*  @returns (Boolean) True if metrics feature flag is enabled, else false
*  @see ./feature-flag.js
*/
function shouldCaptureMetrics() {
  if (isMetricsEnabled()) {
    return true;
  }
  return false;
}

/**
 * Adds a metricsObserver to the page after load.
 */
function addMetricsObserver() {
  window.addEventListener('load', () => {
    captureMetrics();
  });
}

/**
 * Provides an interface for capturing timing metrics from Performance API
 */
export default function startMetrics() {
  if (canCaptureMetrics() && shouldCaptureMetrics()) {
    addMetricsObserver();
    return true;
  }
  return false;
}
