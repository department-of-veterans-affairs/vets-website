/**
 * Conditional setup for dd-trace in CI environments
 * dd-trace/ci/init can cause hangs in local development
 * Only load it when running in CI
 */

if (process.env.CI || process.env.GITHUB_ACTIONS) {
  try {
    require('dd-trace/ci/init');
  } catch (error) {
    // Silently fail if dd-trace is not available
    if (process.env.LOG_LEVEL === 'debug') {
      console.warn('dd-trace/ci/init failed:', error.message);
    }
  }
}
