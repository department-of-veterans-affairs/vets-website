/**
 * Collection of functions to embed and capture frontend performance metrics.
 * Leverages the Performance interface in modern browsers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance
 * @module platform/monitoring/frontend-metrics/metrics
 */

import environment from '../../utilities/environment';
import './whitelisted-paths';
import Raven from 'raven-js';
import { whitelistedPaths } from './whitelisted-paths';

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
    metrics = Object.assign({
      firstContentfulPaint
    }, metrics);
  }
  const metricsPayload = new FormData();
  const metricsArray = [];
  const pageUrl = window.location.pathname;

  Object.keys(metrics).forEach(metric => {
    metricsArray.push({
      metric,
      duration: metrics[metric]
    });
  });
  const data = JSON.stringify({ metrics: metricsArray, pageId: pageUrl });

  metricsPayload.append('data', data);
  return metricsPayload;
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
      const metricsPayload = buildMetricsPayload(entry);
      window.addEventListener('unload', () => {
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

function isWhitelisted() {
  return !!whitelistedPaths.includes(window.location.pathname.slice(0, -1));
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
  if (canCaptureMetrics() && isWhitelisted()) {
    addMetricsObserver();
    return true;
  }
  return false;
}
