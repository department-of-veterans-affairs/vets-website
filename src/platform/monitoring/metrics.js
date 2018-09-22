/**
 * Captures timing metrics from Performance API
 */

import environment from '../utilities/environment';
import { isMetricsEnabled } from '../brand-consolidation/feature-flag';

/**
 *
*/
function sendMetricsToBackend(metrics) {
  const metricsData = new FormData();
  const url = `${environment.API_URL}/v0/performance_monitorings`;
  const pageUrl = window.location.pathname; // document.URL;

  const metricsArray = [];
  Object.keys(metrics).forEach(metric => {
    metricsArray.push({ metric, duration: metrics[metric] });
  });

  metricsData.append('metrics', JSON.stringify(metricsArray));
  metricsData.append('page_id', pageUrl);

  if (!navigator.sendBeacon(url, metricsData)) {
    console.log('beacon NOT sent!');
  }
}

/**
 *
 */
function captureMetrics() {
  const observer = new PerformanceObserver(list => {
    // This callback is called whenever new performance entries are recorded
    list.getEntriesByType('navigation').forEach(entry => {
      const totalPageLoad   = entry.duration;
      const firstByte       = entry.responseStart;
      const domProcessing   = entry.domComplete - entry.domInteractive;
      const domComplete     = entry.domComplete - entry.requestStart;

      // If browser doesn't support first-contentful-paint, we set the value to 0
      const paintEntries    = performance.getEntriesByName('first-contentful-paint');
      const firstPaint      = typeof paintEntries === 'undefined' ? 0 : paintEntries[0].startTime;

      const metrics = {
        totalPageLoad,
        firstByte,
        domProcessing,
        domComplete,
        firstPaint,
      };

      sendMetricsToBackend(metrics);
    });
  });

  try {
    observer.observe({ entryTypes: ['navigation'] });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns whether the browser supports the APIs we'll be using
 */
export function canCaptureMetrics() {
  if (performance === undefined) {
    return false;
  } else if (!('PerformanceObserver' in window)) {
    return false;
  }
  return true;
}

/**
*  Returns whether metrics are enabled via feature flag.
*/
export function shouldCaptureMetrics() {
  if (isMetricsEnabled()) {
    return true;
  }
  return false;
}

/**
 * Adds a metricsObserver to the page after load.
 */
export function addMetricsObserver() {
  window.addEventListener('load', () => {
    console.log('Capturing Metrics');
    captureMetrics();
  });
}

/**
 * Adds a sendBeacon() call to unload action.
 */
export function addMetricsBeacon() {
  window.addEventListener('unload', () => {
    console.log('Sending Metrics');
    sendMetricsToBackend();
  });
}
