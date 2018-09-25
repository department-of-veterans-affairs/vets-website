import environment from '../utilities/environment';
import isMetricsEnabled from './feature-flag';
import Raven from 'raven-js';
import _ from 'lodash';

/**
 * Returns false if Paint timing is not supported or the time of first-contentful-paint if present.
 * @returns (number) The number retrieved from the paintEntries.startTime value, else false
 */
function contentfulPaintEntry() {
  const paintEntries = performance.getEntriesByName('first-contentful-paint');

  if (typeof paintEntries === 'undefined') {
    return false;
  }
  return paintEntries[0].startTime;
}

/**
 * Returns a formatted metrics payload FormData object to send to backend
 * @param (PerformanceNavigationTiming) An object with information from the browser's Performance API
 * @returns (FormData) A new FormData object with an array of metrics and page_id parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry
 */
function buildMetricsPayload(entry) {
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
    metrics = Object.assign({ firstContentfulPaint }, metrics);
  }

  const metricsData = new FormData();
  const metricsArray = [];
  const pageUrl = window.location.pathname;

  Object.keys(metrics).forEach(metric => {
    metricsArray.push(JSON.stringify({
      metric,
      duration: metrics[metric]
    }));
  });

  metricsData.append('metrics', metricsArray);
  metricsData.append('page_id', pageUrl);

  return metricsData;
}


/**
 * Sends a payload via beacon that asynchronously transmits data to the web server
 * when the User Agent has an opportunity to do so, without delaying the unload or
 * affecting the performance of the next navigation.
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
 */
function sendMetricsToBackend(metricsPayload) {
  const url = `${environment.API_URL}/v0/performance_monitorings`;
  if (!navigator.sendBeacon(url, metricsPayload)) {
    return false;
  }
  return true;
}

/**
 * Capture metrics with a PerformanceObserver object
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/observe
 */
function captureMetrics() {
  const observer = new PerformanceObserver(list => {
    list.getEntriesByType('navigation').forEach(entry => {
      window.addEventListener('unload', () => {
        _.throttle(sendMetricsToBackend(metricsPayload), 5000);
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
