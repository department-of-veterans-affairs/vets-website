/**
 * Module for frontend metrics monitoring interface
 * @module platform/monitoring/frontend-metrics
 */

import embedMetrics from './metrics';
import isMetricsEnabled from './feature-flag';
import withinMetricsSample from './sample-rate';

/**
 * Check if we want to run metrics. If so, initiate the metrics code.
 *
 * @return [Boolean] A boolean value indicating if the metrics code was called.
 */
export default function startMetrics() {
  if (isMetricsEnabled() && withinMetricsSample()) {
    return embedMetrics();
  }
  return false;
}
