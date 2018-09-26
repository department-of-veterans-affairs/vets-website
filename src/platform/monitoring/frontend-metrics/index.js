/**
 * Module for frontend metrics monitoring interface
 * @module platform/monitoring/frontend-metrics
 */

import isMetricsEnabled from './feature-flag';
import withinMetricsSample from './sample-rate';

/**
 * Check to see if we want to run metrics. If so, import and initiate the metrics.
 * Uses the ES6 Module Loader.
 *
 * @see https://github.com/ModuleLoader/es-module-loader
 * @return [Boolean] A boolean value indicating if the metrics code was called.
 */
export default function startMetrics() {
  if (isMetricsEnabled() && withinMetricsSample()) {
    import('./metrics').then(metrics => {
      metrics.embedMetrics();
      return true;
    }).catch(error => {
      console.error(error);
    });
  }
  return false;
}
