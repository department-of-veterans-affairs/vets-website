/**
 * Provides a collection of functions to embed frontend performance metrics capturing into a given page.
 * Leverages the Performance interface in modern browsers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance
 * @module platform/monitoring/frontend-metrics/metrics
 */

import environment from '../../utilities/environment';
import Raven from 'raven-js';
import { whitelistedPaths } from './whitelisted-paths';

/**
 * Returns false if PaintTiming is not supported. Else returns the time of first-contentful-paint.
 *
 * @returns {number} The number retrieved from the paintEntries.startTime value, else false
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformancePaintTiming#Example
 */
function contentfulPaintEntry() {
  const paintEntries = performance.getEntriesByName('first-contentful-paint');
  if (typeof paintEntries === 'undefined') {
    return false;
  }
  return paintEntries[0].startTime;
}

/**
 * Parse a PerformanceNavigationTiming object into a metrics payload [FormData] object to send to backend.
 * Also includes first-contentful-paint metric if it's available.
 *
 * @param {PerformanceNavigationTiming} An object with information from the browser's Performance API
 * @returns {FormData} A new FormData object with a data parameter, as a JSON string of metrics data
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
// Exported for unit tests
export function buildMetricsPayload(entry) {
  const totalPageLoad = entry.duration;
  const firstByte = entry.responseStart;
  const domProcessing = entry.domComplete - entry.domInteractive;
  const domComplete = entry.domComplete - entry.requestStart;
  const domInteractive = entry.domInteractive;

  let metrics = {
    totalPageLoad,
    firstByte,
    domProcessing,
    domComplete,
    domInteractive,
  };

  if (contentfulPaintEntry()) {
    const firstContentfulPaint = contentfulPaintEntry();
    metrics = Object.assign(
      {
        firstContentfulPaint,
      },
      metrics,
    );
  }
  const metricsPayload = new FormData();
  const metricsArray = [];
  const pageUrl = window.location.pathname;

  Object.keys(metrics).forEach(metric => {
    metricsArray.push({
      metric,
      duration: metrics[metric],
    });
  });

  // eslint-disable-next-line camelcase
  const data = JSON.stringify({ metrics: metricsArray, page_id: pageUrl });
  metricsPayload.append('data', data);

  return metricsPayload;
}

/**
 * Sends a payload via beacon. Asynchronously transmits data to the web server
 * when the User-Agent has an opportunity to do so, without delaying the unload event
 * or affecting the performance of the next navigation.
 *
 * @returns {boolean}
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
 */
// Exported for unit tests
export function sendMetricsToBackend(metricsPayload) {
  const url = `${environment.API_URL}/v0/performance_monitorings`;
  if (!navigator.sendBeacon(url, metricsPayload)) {
    return false;
  }
  return true;
}

/**
 * Capture browser-provided navigation timing metrics from a PerformanceObserver object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
 */
// Exported for unit tests
export function captureMetrics() {
  const observer = new PerformanceObserver(list => {
    window.addEventListener('unload', () => {
      list.getEntriesByType('navigation').forEach(entry => {
        const metricsPayload = buildMetricsPayload(entry);
        sendMetricsToBackend(metricsPayload);
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
 * Check whether the browser supports the APIs we'll be using.
 *
 * @returns {boolean} Value is true if the current browser supports the PerformanceObserver object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe
 */
function canCaptureMetrics() {
  return window.performance && window.PerformanceObserver;
}

/**
 * Check the current path is in our whitelisted constant
 *
 * @returns {boolean}
 */
function pathIsWhitelisted() {
  const path = window.location.pathname;
  return !!whitelistedPaths.includes(path);
}

/**
 * Add a PerformanceObserver to the page after load event is complete.
 */
function addMetricsObserver() {
  window.addEventListener('load', () => {
    captureMetrics();
  });
}

/**
 * Check if this environment can support metrics and if pathname should have metrics embedded
 *
 * @returns [boolean}
 */
export default function embedMetrics() {
  if (canCaptureMetrics() && pathIsWhitelisted()) {
    addMetricsObserver();
    return true;
  }
  return false;
}
