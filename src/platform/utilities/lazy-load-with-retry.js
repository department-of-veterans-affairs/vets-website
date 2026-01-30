/**
 * Lazy loading utility with retry logic for chunk load failures.
 *
 * Safari and other browsers' tab suspension can cause chunk loads to fail
 * with status 0 when the network layer is in an unstable state after
 * page restoration. This wrapper adds automatic retry with exponential
 * backoff to handle transient failures.
 *
 * @module platform/utilities/lazy-load-with-retry
 */
import { lazy } from 'react';

/**
 * Default retry configuration
 */
const DEFAULT_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Check if an error is a chunk load error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if this is a chunk load error
 */
function isChunkLoadError(error) {
  return (
    error?.name === 'ChunkLoadError' ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('Loading CSS chunk')
  );
}

/**
 * Calculate delay with exponential backoff and jitter
 * @param {number} attempt - Current attempt number (0-indexed)
 * @param {number} baseDelayMs - Base delay in milliseconds
 * @param {number} maxDelayMs - Maximum delay in milliseconds
 * @returns {number} - Delay in milliseconds
 */
function calculateDelay(attempt, baseDelayMs, maxDelayMs) {
  const exponentialDelay = baseDelayMs * 2 ** attempt;
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

/**
 * Attempt to load a module with retries
 * @param {Function} importFn - The dynamic import function
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelayMs - Base delay between retries
 * @param {number} maxDelayMs - Maximum delay between retries
 * @returns {Promise} - Promise that resolves to the module
 */
async function loadWithRetry(importFn, maxRetries, baseDelayMs, maxDelayMs) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await importFn();
    } catch (error) {
      lastError = error;

      // Only retry chunk load errors
      if (!isChunkLoadError(error)) {
        throw error;
      }

      // Don't retry after the last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      const delay = calculateDelay(attempt, baseDelayMs, maxDelayMs);

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Create a lazy component with automatic retry on chunk load failure.
 *
 * Use this instead of React.lazy when loading components that may fail
 * due to network issues, especially on Safari/iOS.
 *
 * @example
 * // Instead of:
 * const MyComponent = lazy(() => import('./MyComponent'));
 *
 * // Use:
 * const MyComponent = lazyWithRetry(() => import('./MyComponent'));
 *
 * @param {Function} importFn - A function that returns a dynamic import promise
 * @param {object} [config] - Optional configuration
 * @param {number} [config.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [config.baseDelayMs=1000] - Base delay between retries (ms)
 * @param {number} [config.maxDelayMs=10000] - Maximum delay between retries (ms)
 * @returns {React.LazyExoticComponent} - A lazy component
 */
export function lazyWithRetry(importFn, config = {}) {
  const { maxRetries, baseDelayMs, maxDelayMs } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  return lazy(() =>
    loadWithRetry(importFn, maxRetries, baseDelayMs, maxDelayMs),
  );
}

// Export for testing - allows direct testing of retry logic without React rendering
export { loadWithRetry, isChunkLoadError, calculateDelay };

export default lazyWithRetry;
