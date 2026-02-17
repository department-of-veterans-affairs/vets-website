import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import PropTypes from 'prop-types';
import * as analytics from '../../utils/analytics';
import {
  Type2FailureAnalyticsProvider,
  useSlimAlertRegistration,
  DEBOUNCE_MS,
} from '../../contexts/Type2FailureAnalyticsContext';

// Test component that uses the hook
function TestAlert({ claimId, hasFailures }) {
  useSlimAlertRegistration({ alertKey: claimId, hasFailures });
  return hasFailures ? <div data-testid={`alert-${claimId}`}>Alert</div> : null;
}

TestAlert.propTypes = {
  claimId: PropTypes.string.isRequired,
  hasFailures: PropTypes.bool,
};

TestAlert.defaultProps = {
  hasFailures: false,
};

describe('Type2FailureAnalyticsContext', () => {
  let recordType2FailureEventStub;
  // Use a slightly larger wait than the actual debounce for safety
  const TEST_WAIT_MS = DEBOUNCE_MS + 50;

  beforeEach(() => {
    recordType2FailureEventStub = sinon.stub(
      analytics,
      'recordType2FailureEvent',
    );
  });

  afterEach(() => {
    // Restore specific stub
    if (recordType2FailureEventStub) {
      recordType2FailureEventStub.restore();
    }
    // Cleanup React DOM
    cleanup();
  });

  // Helper to wait for debounce using real timers (more reliable in this test environment)
  const waitForDebounce = () =>
    new Promise(resolve => setTimeout(resolve, TEST_WAIT_MS));
  // Helper to assert event was called with specific count
  const expectEventCalledWithCount = count => {
    expect(recordType2FailureEventStub.calledOnce).to.be.true;
    const callArgs = recordType2FailureEventStub.getCall(0).args[0];
    expect(callArgs).to.deep.equal({ count });
  };

  describe('useSlimAlertRegistration', () => {
    it('should fire exactly one analytics event when single alert mounts', async () => {
      render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      expectEventCalledWithCount(1);
    });

    it('should fire exactly one analytics event when multiple alerts mount', async () => {
      render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures />
          <TestAlert claimId="claim-3" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      expectEventCalledWithCount(3);
    });

    it('should not fire event if no slim alerts are visible', async () => {
      render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures={false} />
          <TestAlert claimId="claim-2" hasFailures={false} />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      expect(recordType2FailureEventStub.notCalled).to.be.true;
    });

    it('should only count alerts with hasFailures=true', async () => {
      render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures={false} />
          <TestAlert claimId="claim-3" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      expectEventCalledWithCount(2);
    });

    it('should handle rapid mount/unmount correctly', async () => {
      const { unmount } = render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      // Unmount before debounce completes
      await new Promise(resolve => setTimeout(resolve, 100)); // Halfway through debounce
      unmount();

      // Wait past debounce
      await waitForDebounce();

      // Event should not fire because all alerts unmounted before debounce completed
      expect(recordType2FailureEventStub.notCalled).to.be.true;
    });

    it('should handle alerts mounting at different times', async () => {
      const { rerender } = render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      // Wait partially through debounce
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mount more alerts (this should reset the debounce timer)
      rerender(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures />
          <TestAlert claimId="claim-3" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      // Should fire once with count of 3
      expectEventCalledWithCount(3);
    });

    it('should cleanup timers on unmount', async () => {
      const { unmount } = render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      // Unmount before debounce completes
      unmount();

      await waitForDebounce();

      // Event should not fire
      expect(recordType2FailureEventStub.notCalled).to.be.true;
    });

    it('should reset state on provider unmount (new page visit)', async () => {
      // First page visit
      const { unmount } = render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      expect(recordType2FailureEventStub.calledOnce).to.be.true;

      // Unmount provider (simulating navigation away from claims list)
      unmount();

      // New page visit - mount new provider
      render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-2" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      // Event should fire again because provider was unmounted/remounted
      expect(recordType2FailureEventStub.calledTwice).to.be.true;
    });

    it('should fire again when provider remounts with new key (pagination pattern)', async () => {
      // Simulate page 1
      const { unmount } = render(
        <Type2FailureAnalyticsProvider key="page-1">
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      // Event fires for page 1 with 2 alerts
      expectEventCalledWithCount(2);

      // Unmount (React does this automatically when key changes)
      unmount();

      // Simulate page 2 - new provider instance with different key
      render(
        <Type2FailureAnalyticsProvider key="page-2">
          <TestAlert claimId="claim-3" hasFailures />
          <TestAlert claimId="claim-4" hasFailures />
          <TestAlert claimId="claim-5" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();

      // Event fires again for page 2 with 3 alerts
      expect(recordType2FailureEventStub.calledTwice).to.be.true;
      const secondCall = recordType2FailureEventStub.getCall(1).args[0];
      expect(secondCall).to.deep.equal({ count: 3 });
    });

    it('should clear pending timer when all alerts unmount', async () => {
      const { rerender } = render(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
          <TestAlert claimId="claim-2" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );
      // Unmount one alert
      rerender(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures />
        </Type2FailureAnalyticsProvider>,
      );
      // Unmount the last alert before debounce completes
      rerender(
        <Type2FailureAnalyticsProvider>
          <TestAlert claimId="claim-1" hasFailures={false} />
        </Type2FailureAnalyticsProvider>,
      );

      await waitForDebounce();
      // Event should not fire because all alerts unmounted
      expect(recordType2FailureEventStub.notCalled).to.be.true;
    });
  });
});
