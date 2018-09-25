/**
 * Returns whether the current Webpack build is executing with the --frontend-metrics-enabled flag set.
 * @returns {boolean}
 * @module platform/frontend-metrics/feature-flag
 */
export default function isMetricsEnabled() {
  return window.settings && window.settings.metrics.enabled;
}
