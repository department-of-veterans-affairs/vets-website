import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { render, waitFor, act, cleanup } from '@testing-library/react';
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

describe('ChunkLoadError Reproduction', () => {
  let consoleErrorStub;
  let consoleWarnStub;

  beforeEach(() => {
    // Suppress React error boundary console errors during test
    consoleErrorStub = sinon.stub(console, 'error');
    consoleWarnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    // Explicitly cleanup RTL to prevent test pollution
    cleanup();
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
          const error = new Error(
            'ChunkLoadError: Loading chunk test_component failed.',
          );
          error.name = 'ChunkLoadError';
          return Promise.reject(error);
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

  describe('lazyWithRetry', () => {
    it('retries and succeeds after transient failure', async () => {
      // Import the fix
      const { lazyWithRetry } = await import('../lazy-load-with-retry');

      let loadAttempts = 0;

      const flakyImport = () => {
        loadAttempts += 1;
        if (loadAttempts === 1) {
          // First attempt fails
          const error = new Error(
            'ChunkLoadError: Loading chunk test_component failed.',
          );
          error.name = 'ChunkLoadError';
          return Promise.reject(error);
        }
        // Second attempt succeeds
        return Promise.resolve({
          default: () => (
            <div data-testid="success">Component Loaded After Retry!</div>
          ),
        });
      };

      // Using lazyWithRetry with short delays for testing
      const LazyComponent = lazyWithRetry(flakyImport, {
        maxRetries: 3,
        baseDelayMs: 10, // Short delay for tests
        maxDelayMs: 50,
      });

      // For lazyWithRetry tests, we can't use act() because the retry mechanism
      // uses setTimeout internally. Instead, let waitFor poll until completion.
      const { getByTestId } = render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <LazyComponent />
        </Suspense>,
      );

      // Should eventually succeed after retry - give enough time for retry delays
      await waitFor(() => expect(getByTestId('success')).to.exist, {
        timeout: 2000,
      });

      expect(loadAttempts).to.equal(2);
    });

    it('gives up after max retries', async () => {
      const { lazyWithRetry } = await import('../lazy-load-with-retry');

      let loadAttempts = 0;

      const alwaysFailingImport = () => {
        loadAttempts += 1;
        const error = new Error(
          'ChunkLoadError: Loading chunk always_fail failed.',
        );
        error.name = 'ChunkLoadError';
        return Promise.reject(error);
      };

      const LazyComponent = lazyWithRetry(alwaysFailingImport, {
        maxRetries: 2,
        baseDelayMs: 10,
        maxDelayMs: 50,
      });

      // For lazyWithRetry tests, we can't use act() because the retry mechanism
      // uses setTimeout internally. Instead, let waitFor poll until completion.
      const { getByTestId } = render(
        <TestErrorBoundary fallbackTestId="final-error">
          <Suspense fallback={<div data-testid="loading">Loading...</div>}>
            <LazyComponent />
          </Suspense>
        </TestErrorBoundary>,
      );

      // Wait for all retries + error boundary render
      await waitFor(() => expect(getByTestId('final-error')).to.exist, {
        timeout: 2000,
      });

      // Should have tried initial + maxRetries times (1 + 2 = 3)
      expect(loadAttempts).to.equal(3);
    });
  });
});
