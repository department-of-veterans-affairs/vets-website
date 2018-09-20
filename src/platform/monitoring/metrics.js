/**
 * Captures timing metrics from Performance API
 */

import environment from '../utilities/environment';

function canCaptureMetrics() {
  if (!window.performance) {
    return false;
  } else if (!("PerformanceObserver" in window)) {
    return false;
  }
  return true;
}

function captureMetrics() {
  // ensure browser supports upcoming performance API
  if (canCaptureMetrics) {
    // instantiate a new PerformanceObserver object
    const observer = new PerformanceObserver(list => {
      // this callback is called whenever new performance entries are recorded
      // iterate over each entry
      list.getEntriesByType('navigation').forEach(entry => {
        const initialPageLoad = entry.responseStart - entry.requestStart;
        const firstByte       = entry.responseStart - entry.fetchStart;
        const domInteractive  = entry.domInteractive;
        const domComplete     = entry.domComplete;
        const domSetup        = entry.domContentLoadedEventEnd - entry.domInteractive;
        const firstPaint      = performance.getEntriesByName('first-contentful-paint')[0].startTime;

        const metrics = {
          initialPageLoad,
          firstByte,
          domInteractive,
          domComplete,
          domSetup,
          firstPaint
        };

        console.log(metrics);
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      // TODO: Add sentry error logging
      console.error(error);
    }
  } else {
    // TODO: Don't log this to console, do something else
    console.log('Performance timing isn\'t supported in this browser.');
  }
}

export function shouldCaptureMetrics() {
  // Check for staging/production etc.
  if (environment.BASE_URL.indexOf('localhost') > 0) {
    return true;
  } else if (environment.BASE_URL.indexOf('staging') > 0) {
    return true;
  } else if (environment.BASE_URL.indexOf('dev') > 0) {
    return true;
  }
  return false;
}

export function addMetricsObserver() {
  console.log('Capturing Metrics');
  captureMetrics();
  return true;
}
