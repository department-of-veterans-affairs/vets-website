/**
 * Returns whether the current request should be within metrics sample or not.
 * An integer from 1 to 100, representing the sample rate desired is defined in the create-settings build process.
 * For metrics code to be enabled, a randomly-generated number must be greater than that integer.
 * For example, in theory a "100" would mean 100% of requests will have the metrics enabled,
 * while a "40" means only 40% of requests should have metrics enabled.
 * @see module:config/create-settings
 */
export default function withinMetricsSample() {
  const metrics = window.settings.metrics;
  const randomizer = Math.floor(Math.random() * 100) + 1;
  return randomizer < metrics.samplePercentage;
}
