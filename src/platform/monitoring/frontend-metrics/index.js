/**
 * Module for frontend metrics monitoring interface
 * @module platform/monitoring/frontend-metrics
 */

import isMetricsEnabled from './feature-flag';
import withinMetricsSample from './sample-rate';
import embedMetrics from './metrics';

/**
 * Check to see if we want to run metrics. If so, import and initiate the metrics.
 * Uses the ES6 Module Loader.
 *
 * @see https://github.com/ModuleLoader/es-module-loader
 * @return [Boolean] A boolean value indicating if the metrics code was called.
 */

export default function startMetrics() {
  if (isMetricsEnabled() && withinMetricsSample()) {
    embedMetrics();
  }
  return false;
}
