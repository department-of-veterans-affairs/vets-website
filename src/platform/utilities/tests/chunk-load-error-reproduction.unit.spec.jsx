import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { render, waitFor, act } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

// Shared ErrorBoundary for tests - catches errors and renders fallback
class TestErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, fallbackTestId } = this.props;
    if (hasError) {
      return <div data-testid={fallbackTestId}>Error occurred</div>;
    }
    return children;
  }
}

TestErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackTestId: PropTypes.string.isRequired,
};

/**
 * Helper to create a ChunkLoadError
 */
function createChunkLoadError(chunkName = 'test_component') {
  const error = new Error(`ChunkLoadError: Loading chunk ${chunkName} failed.`);
  error.name = 'ChunkLoadError';
  return error;
}

describe('ChunkLoadError Reproduction', () => {
  let consoleErrorStub;
  let consoleWarnStub;

  beforeEach(() => {
    // Suppress React error boundary console errors during test
    consoleErrorStub = sinon.stub(console, 'error');
    consoleWarnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    // Restore console stubs - use try/catch in case test failed before stubs were created
    try {
      consoleErrorStub?.restore();
      consoleWarnStub?.restore();
    } catch (e) {
      // Stub may already be restored or never created
    }
  });

  describe('React.lazy', () => {
    it('does not retry when import fails', async () => {
      let loadAttempts = 0;

      // Simulate a chunk that fails on first load but would succeed on retry
      const flakyImport = () => {
        loadAttempts += 1;
        if (loadAttempts === 1) {
          return Promise.reject(createChunkLoadError());
        }
        // Subsequent attempts would succeed (but React.lazy won't retry)
        return Promise.resolve({
          default: () => <div data-testid="loaded">Component Loaded!</div>,
        });
      };

      // Standard React.lazy - current implementation across the codebase
      const LazyComponent = React.lazy(flakyImport);

      // RTL recommends wrapping Suspense renders in `await act(async () => ...)`
      // See: https://github.com/testing-library/react-testing-library/issues/1375
      // The callback MUST be async for proper Suspense handling
      let getByTestId;
      await act(async () => {
        const result = render(
          <TestErrorBoundary fallbackTestId="error-boundary">
            <Suspense fallback={<div data-testid="loading">Loading...</div>}>
              <LazyComponent />
            </Suspense>
          </TestErrorBoundary>,
        );
        getByTestId = result.getByTestId;
      });

      // Wait for error boundary to catch the failure
      await waitFor(() => expect(getByTestId('error-boundary')).to.exist);

      expect(loadAttempts).to.equal(1);
    });
  });

  describe('loadWithRetry (direct function tests)', () => {
    // Test the retry logic directly without React rendering.
    // This avoids the RTL + Suspense + setTimeout timing issues that make
    // React component tests unreliable in CI.

    it('retries and succeeds after transient ChunkLoadError', async () => {
      const {
        loadWithRetry,
      } = await import('../lazy-load-with-retry');

      let loadAttempts = 0;

      const flakyImport = () => {
        loadAttempts += 1;
        if (loadAttempts === 1) {
          // First attempt fails with ChunkLoadError
          return Promise.reject(createChunkLoadError());
        }
        // Second attempt succeeds
        return Promise.resolve({ default: 'MockComponent' });
      };

      // Zero delay for fast test execution
      const result = await loadWithRetry(flakyImport, 3, 0, 0);

      expect(loadAttempts).to.equal(2);
      expect(result.default).to.equal('MockComponent');
    });

    it('gives up after max retries and throws the final error', async () => {
      const {
        loadWithRetry,
      } = await import('../lazy-load-with-retry');

      let loadAttempts = 0;

      const alwaysFailingImport = () => {
        loadAttempts += 1;
        return Promise.reject(createChunkLoadError('always_fail'));
      };

      // maxRetries: 2 means 1 initial + 2 retries = 3 total attempts
      let thrownError = null;
      try {
        await loadWithRetry(alwaysFailingImport, 2, 0, 0);
      } catch (error) {
        thrownError = error;
      }

      expect(loadAttempts).to.equal(3); // 1 initial + 2 retries
      expect(thrownError).to.not.be.null;
      expect(thrownError.name).to.equal('ChunkLoadError');
      expect(thrownError.message).to.include('always_fail');
    });

    it('does not retry for non-ChunkLoadError errors', async () => {
      const {
        loadWithRetry,
      } = await import('../lazy-load-with-retry');

      let loadAttempts = 0;

      const nonChunkError = () => {
        loadAttempts += 1;
        return Promise.reject(new Error('Some other error'));
      };

      let thrownError = null;
      try {
        await loadWithRetry(nonChunkError, 3, 0, 0);
      } catch (error) {
        thrownError = error;
      }

      // Should NOT retry for non-ChunkLoadError
      expect(loadAttempts).to.equal(1);
      expect(thrownError.message).to.equal('Some other error');
    });
  });

  describe('isChunkLoadError', () => {
    it('identifies errors by name', async () => {
      const { isChunkLoadError } = await import('../lazy-load-with-retry');

      const error = new Error('Something failed');
      error.name = 'ChunkLoadError';

      expect(isChunkLoadError(error)).to.be.true;
    });

    it('identifies errors by "Loading chunk" in message', async () => {
      const { isChunkLoadError } = await import('../lazy-load-with-retry');

      const error = new Error('Loading chunk main-abc123 failed');

      expect(isChunkLoadError(error)).to.be.true;
    });

    it('identifies CSS chunk load errors', async () => {
      const { isChunkLoadError } = await import('../lazy-load-with-retry');

      const error = new Error('Loading CSS chunk styles-xyz failed');

      expect(isChunkLoadError(error)).to.be.true;
    });

    it('returns false for non-chunk errors', async () => {
      const { isChunkLoadError } = await import('../lazy-load-with-retry');

      expect(isChunkLoadError(new Error('Network timeout'))).to.be.false;
      expect(isChunkLoadError(new TypeError('undefined is not a function'))).to
        .be.false;
      expect(isChunkLoadError(null)).to.be.false;
      expect(isChunkLoadError(undefined)).to.be.false;
    });
  });

  describe('calculateDelay', () => {
    it('uses exponential backoff', async () => {
      const { calculateDelay } = await import('../lazy-load-with-retry');

      // Stub Math.random to remove jitter for predictable tests
      const randomStub = sinon.stub(Math, 'random').returns(0);

      try {
        // With 0 jitter: delay = baseDelayMs * 2^attempt
        expect(calculateDelay(0, 1000, 10000)).to.equal(1000); // 1000 * 2^0 = 1000
        expect(calculateDelay(1, 1000, 10000)).to.equal(2000); // 1000 * 2^1 = 2000
        expect(calculateDelay(2, 1000, 10000)).to.equal(4000); // 1000 * 2^2 = 4000
        expect(calculateDelay(3, 1000, 10000)).to.equal(8000); // 1000 * 2^3 = 8000
      } finally {
        randomStub.restore();
      }
    });

    it('caps delay at maxDelayMs', async () => {
      const { calculateDelay } = await import('../lazy-load-with-retry');

      const randomStub = sinon.stub(Math, 'random').returns(0);

      try {
        // 1000 * 2^4 = 16000, but capped at 10000
        expect(calculateDelay(4, 1000, 10000)).to.equal(10000);
      } finally {
        randomStub.restore();
      }
    });

    it('adds jitter up to 30%', async () => {
      const { calculateDelay } = await import('../lazy-load-with-retry');

      // With Math.random returning 1 (max jitter): jitter = 0.3 * exponentialDelay
      const randomStub = sinon.stub(Math, 'random').returns(1);

      try {
        // 1000 * 2^0 = 1000, jitter = 0.3 * 1000 = 300, total = 1300
        expect(calculateDelay(0, 1000, 10000)).to.equal(1300);
      } finally {
        randomStub.restore();
      }
    });
  });
});
