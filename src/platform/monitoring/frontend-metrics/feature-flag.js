/**
 * Returns whether the current environment should have metrics enabled.
 * @returns {boolean}
 * @module platform/monitoring/frontend-metrics/feature-flag
 */
export default function isMetricsEnabled() {
  const environments = ['vagovdev', 'vagovstaging'];

  return !!environments.includes(__BUILDTYPE__);
}
