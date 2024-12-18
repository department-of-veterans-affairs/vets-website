/* eslint-disable no-console */

/**
 * @param {object} memory - The memory usage object to format
 * @returns {object} - An object with formatted memory usage
 */
const formatMemoryUsage = memory => ({
  heapUsed: `${Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100} MB`,
  heapTotal: `${Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100} MB`,
  rss: `${Math.round((memory.rss / 1024 / 1024) * 100) / 100} MB`,
});

/**
 * @param {object} start - The starting memory usage object
 * @param {object} end - The ending memory usage object
 * @returns {object} - An object with formatted memory difference
 */
const formatMemoryDiff = (start, end) => ({
  heapUsed: `${Math.round(
    ((end.heapUsed - start.heapUsed) / 1024 / 1024) * 100,
  ) / 100} MB`,
  heapTotal: `${Math.round(
    ((end.heapTotal - start.heapTotal) / 1024 / 1024) * 100,
  ) / 100} MB`,
  rss: `${Math.round(((end.rss - start.rss) / 1024 / 1024) * 100) / 100} MB`,
});

/**
 * Track memory usage in the before and after hooks
 * of a unit test suite to see how much total memory is used
 *
 * @param {string} testName - The name of the test to track memory usage for
 * @returns {object} - An object with startTracking and endTracking methods
 *
 * @example
 * describe('Some hungry test suite', () => {
 *   const tracker = trackMemoryUsage('Some hungry test suite');
 *   before(() => {
 *     tracker.startTracking();
 *   });
 *   after(() => {
 *     tracker.endTracking();
 *   });
 * });
 *
 *
 */
const trackMemoryUsage = testName => {
  let initialMemory;

  const startTracking = () => {
    initialMemory = process.memoryUsage();
  };

  const endTracking = () => {
    console.log(`\n📊 Memory Usage for ${testName}`);
    console.log('\nInitial memory:', formatMemoryUsage(initialMemory));
    const finalMemory = process.memoryUsage();
    console.log('\nFinal memory:', formatMemoryUsage(finalMemory));
    console.log(
      '\nMemory difference:',
      formatMemoryDiff(initialMemory, finalMemory),
    );
    console.log('-'.repeat(50));
  };

  return {
    startTracking,
    endTracking,
  };
};

export default trackMemoryUsage;
