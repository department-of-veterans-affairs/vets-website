import React from 'react';
import { expect } from 'chai';
import { render, act } from '@testing-library/react';
import sinon from 'sinon';
import * as uiUtils from '@department-of-veterans-affairs/platform-utilities/ui';
import useNewestAlertFocus from '../../hooks/useNewestAlertFocus';

describe('useNewestAlertFocus hook', () => {
  let focusElementStub;

  // Test component that uses the hook and exposes its return values
  const TestComponent = ({ visibleAlerts, onHookResult }) => {
    const result = useNewestAlertFocus(visibleAlerts);
    // Expose hook result to test via callback
    if (onHookResult) {
      onHookResult(result);
    }
    return null;
  };

  beforeEach(() => {
    focusElementStub = sinon.stub(uiUtils, 'focusElement');
  });

  afterEach(() => {
    focusElementStub.restore();
  });

  describe('newestAlert calculation', () => {
    it('returns null when visibleAlerts is empty', () => {
      let hookResult;
      render(
        <TestComponent
          visibleAlerts={[]}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.be.null;
    });

    it('returns the first alert as newest on initial render', () => {
      let hookResult;
      render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.equal('alert1');
    });

    it('returns the first new alert when multiple alerts appear at once', () => {
      let hookResult;
      render(
        <TestComponent
          visibleAlerts={['alert1', 'alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.equal('alert1');
    });

    it('identifies newly added alert after rerender', () => {
      let hookResult;
      const { rerender } = render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.equal('alert1');

      rerender(
        <TestComponent
          visibleAlerts={['alert1', 'alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.equal('alert2');
    });

    it('returns null when no new alerts are added on subsequent render', () => {
      let hookResult;
      const { rerender } = render(
        <TestComponent
          visibleAlerts={['alert1', 'alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // First render, alert1 is newest
      expect(hookResult.newestAlert).to.equal('alert1');

      // Rerender triggers useEffect which updates prevAlertsRef
      // Then another rerender should show null for newestAlert
      rerender(
        <TestComponent
          visibleAlerts={['alert1', 'alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // After the effect runs, prevAlertsRef is updated
      // On the next rerender, newestAlert should be null
      rerender(
        <TestComponent
          visibleAlerts={['alert1', 'alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.be.null;
    });

    it('detects new alert when previous alert is removed and new one added', () => {
      let hookResult;
      const { rerender } = render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // First rerender to trigger effect and update prevAlertsRef
      rerender(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // Now change to alert2
      rerender(
        <TestComponent
          visibleAlerts={['alert2']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.equal('alert2');
    });
  });

  describe('focusRef callback behavior', () => {
    it('returns a function for focusRef', () => {
      let hookResult;
      render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.focusRef).to.be.a('function');
    });

    it('does not call focusElement when node is null', done => {
      let hookResult;
      render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // Call focusRef with null (simulating unmount)
      hookResult.focusRef(null);

      setTimeout(() => {
        expect(focusElementStub.called).to.be.false;
        done();
      }, 150);
    });

    it('does not call focusElement when newestAlert is null', done => {
      let hookResult;
      const { rerender } = render(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      // Rerender twice to make newestAlert null
      rerender(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );
      rerender(
        <TestComponent
          visibleAlerts={['alert1']}
          onHookResult={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.newestAlert).to.be.null;

      // Create a mock node
      const wrapperNode = document.createElement('div');

      // Call focusRef - should not focus since newestAlert is null
      act(() => {
        hookResult.focusRef(wrapperNode);
      });

      setTimeout(() => {
        expect(focusElementStub.called).to.be.false;
        done();
      }, 150);
    });
  });
});
