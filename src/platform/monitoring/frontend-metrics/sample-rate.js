/**
 * Returns whether the current request should be within metrics sample or not.
 * An integer from 1 to 100, representing the sample rate desired is defined in a constant.
 * For metrics code to be enabled, a randomly-generated number must be greater than that integer.
 * For example, in theory a "100" would mean 100% of requests will have the metrics enabled,
 * while a "40" means only 40% of requests should have metrics enabled.
 */
export default function withinMetricsSample() {
  // Update this constant to an integer fromn 0 to 100 to alter the sample rate.
  const sampleRate = 20;

  const randomizer = Math.floor(Math.random() * 100) + 1;
  return randomizer < sampleRate;
}
