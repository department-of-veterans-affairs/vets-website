import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';
import useBeforeUnloadGuard from '../../hooks/useBeforeUnloadGuard';
import * as useSessionExpirationModule from '../../hooks/use-session-expiration';
import * as helpersModule from '../../util/helpers';

describe('useBeforeUnloadGuard hook', () => {
  let mockUseSessionExpiration;
  let mockResetUserSession;
  let timeoutStub;
  let clearTimeoutSpy;

  beforeEach(() => {
    // Mock localStorage with direct property access
    Object.defineProperty(global, 'localStorage', {
      value: {
        atExpires: '123456789',
        hasSession: 'true',
        sessionExpiration: '2025-12-31T23:59:59Z',
        userFirstName: 'John',
        clear: sinon.stub(),
        getItem: sinon.stub(),
        setItem: sinon.stub(),
        removeItem: sinon.stub(),
      },
      writable: true,
    });

    // Mock resetUserSession
    timeoutStub = sinon.stub();
    mockResetUserSession = sinon
      .stub(helpersModule, 'resetUserSession')
      .returns({
        signOutMessage: 'You will be signed out due to inactivity',
        timeoutId: timeoutStub,
      });

    // Mock useSessionExpiration
    mockUseSessionExpiration = sinon.stub(
      useSessionExpirationModule,
      'useSessionExpiration',
    );

    // Mock clearTimeout
    clearTimeoutSpy = sinon.spy(global, 'clearTimeout');
  });

  afterEach(() => {
    if (mockResetUserSession) {
      mockResetUserSession.restore();
    }
    if (mockUseSessionExpiration) {
      mockUseSessionExpiration.restore();
    }
    if (clearTimeoutSpy) {
      clearTimeoutSpy.restore();
    }
  });

  describe('initialization', () => {
    it('should initialize with localStorage values', () => {
      renderHook(() => useBeforeUnloadGuard(false));

      expect(mockResetUserSession.calledOnce).to.be.true;
      expect(mockResetUserSession.firstCall.args[0]).to.deep.equal({
        atExpires: '123456789',
        hasSession: 'true',
        sessionExpiration: '2025-12-31T23:59:59Z',
        userFirstName: 'John',
      });
    });

    it('should call useSessionExpiration with beforeUnloadHandler and noTimeout callback', () => {
      renderHook(() => useBeforeUnloadGuard(false));

      expect(mockUseSessionExpiration.calledOnce).to.be.true;
      expect(mockUseSessionExpiration.firstCall.args).to.have.length(2);
      expect(typeof mockUseSessionExpiration.firstCall.args[0]).to.equal(
        'function',
      );
      expect(typeof mockUseSessionExpiration.firstCall.args[1]).to.equal(
        'function',
      );
    });
  });

  describe('beforeUnloadHandler', () => {
    it('should prevent default and set returnValue when when=true', () => {
      renderHook(() => useBeforeUnloadGuard(true));

      const beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      expect(mockEvent.preventDefault.calledOnce).to.be.true;
      expect(mockEvent.returnValue).to.equal(
        'You will be signed out due to inactivity',
      );
    });

    it('should not prevent default when when=false', () => {
      renderHook(() => useBeforeUnloadGuard(false));

      const beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      expect(mockEvent.preventDefault.called).to.be.false;
      expect(mockEvent.returnValue).to.be.null;
    });

    it('should not prevent default when when=undefined', () => {
      renderHook(() => useBeforeUnloadGuard(undefined));

      const beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      expect(mockEvent.preventDefault.called).to.be.false;
      expect(mockEvent.returnValue).to.be.null;
    });
  });

  describe('noTimeout callback', () => {
    it('should call clearTimeout with the timeoutId', () => {
      renderHook(() => useBeforeUnloadGuard(false));

      const noTimeoutCallback = mockUseSessionExpiration.firstCall.args[1];

      // Get the call count before our test action
      const initialCallCount = clearTimeoutSpy.callCount;

      noTimeoutCallback();

      // Verify clearTimeout was called exactly once more than before
      expect(clearTimeoutSpy.callCount).to.equal(initialCallCount + 1);
      expect(clearTimeoutSpy.calledWith(timeoutStub)).to.be.true;
    });
  });

  describe('localStorage values handling', () => {
    it('should handle missing localStorage values gracefully', () => {
      Object.defineProperty(global, 'localStorage', {
        value: {
          clear: sinon.stub(),
          getItem: sinon.stub(),
          setItem: sinon.stub(),
          removeItem: sinon.stub(),
        },
        writable: true,
      });

      renderHook(() => useBeforeUnloadGuard(false));

      expect(mockResetUserSession.calledOnce).to.be.true;
      expect(mockResetUserSession.firstCall.args[0]).to.deep.equal({
        atExpires: undefined,
        hasSession: undefined,
        sessionExpiration: undefined,
        userFirstName: undefined,
      });
    });

    it('should handle null localStorage values', () => {
      Object.defineProperty(global, 'localStorage', {
        value: {
          atExpires: null,
          hasSession: null,
          sessionExpiration: null,
          userFirstName: null,
          clear: sinon.stub(),
          getItem: sinon.stub(),
          setItem: sinon.stub(),
          removeItem: sinon.stub(),
        },
        writable: true,
      });

      renderHook(() => useBeforeUnloadGuard(false));

      expect(mockResetUserSession.calledOnce).to.be.true;
      expect(mockResetUserSession.firstCall.args[0]).to.deep.equal({
        atExpires: null,
        hasSession: null,
        sessionExpiration: null,
        userFirstName: null,
      });
    });
  });

  describe('when parameter changes', () => {
    it('should update beforeUnloadHandler behavior when when changes from false to true', () => {
      const { rerender } = renderHook(
        ({ when }) => useBeforeUnloadGuard(when),
        {
          initialProps: { when: false },
        },
      );

      // First render with when=false
      let beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent1 = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent1);
      expect(mockEvent1.preventDefault.called).to.be.false;

      // Re-render with when=true
      rerender({ when: true });
      beforeUnloadHandler = mockUseSessionExpiration.lastCall.args[0];
      const mockEvent2 = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent2);
      expect(mockEvent2.preventDefault.calledOnce).to.be.true;
      expect(mockEvent2.returnValue).to.equal(
        'You will be signed out due to inactivity',
      );
    });

    it('should update beforeUnloadHandler behavior when when changes from true to false', () => {
      const { rerender } = renderHook(
        ({ when }) => useBeforeUnloadGuard(when),
        {
          initialProps: { when: true },
        },
      );

      // First render with when=true
      let beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent1 = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent1);
      expect(mockEvent1.preventDefault.calledOnce).to.be.true;

      // Re-render with when=false
      rerender({ when: false });
      beforeUnloadHandler = mockUseSessionExpiration.lastCall.args[0];
      const mockEvent2 = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent2);
      expect(mockEvent2.preventDefault.called).to.be.false;
      expect(mockEvent2.returnValue).to.be.null;
    });
  });

  describe('signOutMessage handling', () => {
    it('should use the signOutMessage from resetUserSession', () => {
      const customSignOutMessage = 'Custom session timeout message';
      mockResetUserSession.returns({
        signOutMessage: customSignOutMessage,
        timeoutId: timeoutStub,
      });

      renderHook(() => useBeforeUnloadGuard(true));

      const beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      expect(mockEvent.returnValue).to.equal(customSignOutMessage);
    });

    it('should handle empty signOutMessage', () => {
      mockResetUserSession.returns({
        signOutMessage: '',
        timeoutId: timeoutStub,
      });

      renderHook(() => useBeforeUnloadGuard(true));

      const beforeUnloadHandler = mockUseSessionExpiration.firstCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      expect(mockEvent.returnValue).to.equal('');
    });
  });

  describe('memoization', () => {
    it('should memoize localStorage values', () => {
      const { rerender } = renderHook(() => useBeforeUnloadGuard(false));

      // Change localStorage after initial render
      global.localStorage.userFirstName = 'Jane';

      // Re-render should not pick up the changed localStorage value due to memoization
      rerender();

      // resetUserSession should still be called with the original values
      expect(mockResetUserSession.lastCall.args[0]).to.deep.equal({
        atExpires: '123456789',
        hasSession: 'true',
        sessionExpiration: '2025-12-31T23:59:59Z',
        userFirstName: 'John', // Original value, not 'Jane'
      });
    });
  });

  describe('multiple calls', () => {
    it('should handle multiple hook instances', () => {
      renderHook(() => useBeforeUnloadGuard(true));
      renderHook(() => useBeforeUnloadGuard(false));

      expect(mockResetUserSession.calledTwice).to.be.true;
      expect(mockUseSessionExpiration.calledTwice).to.be.true;
    });
  });

  describe('error handling', () => {
    it('should handle resetUserSession throwing an error', () => {
      mockResetUserSession.throws(new Error('Reset session failed'));

      const { result } = renderHook(() => useBeforeUnloadGuard(false));

      expect(result.error).to.be.an('error');
      expect(result.error.message).to.equal('Reset session failed');
    });

    it('should handle clearTimeout being called with invalid timeoutId', () => {
      mockResetUserSession.returns({
        signOutMessage: 'test message',
        timeoutId: null,
      });

      renderHook(() => useBeforeUnloadGuard(false));

      const noTimeoutCallback = mockUseSessionExpiration.firstCall.args[1];

      // Should not throw when calling clearTimeout with null
      expect(() => {
        noTimeoutCallback();
      }).to.not.throw();

      expect(clearTimeoutSpy.calledWith(null)).to.be.true;
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly in a complete scenario with session expiration', () => {
      const { rerender } = renderHook(
        ({ when }) => useBeforeUnloadGuard(when),
        {
          initialProps: { when: false },
        },
      );

      // Verify initial setup
      expect(mockResetUserSession.calledOnce).to.be.true;
      expect(mockUseSessionExpiration.calledOnce).to.be.true;

      // Simulate changing to block navigation
      rerender({ when: true });

      // Simulate beforeunload event
      const beforeUnloadHandler = mockUseSessionExpiration.lastCall.args[0];
      const mockEvent = {
        preventDefault: sinon.spy(),
        returnValue: null,
      };

      beforeUnloadHandler(mockEvent);

      // Verify event was prevented and message set
      expect(mockEvent.preventDefault.calledOnce).to.be.true;
      expect(mockEvent.returnValue).to.equal(
        'You will be signed out due to inactivity',
      );

      // Simulate timeout cleanup
      const noTimeoutCallback = mockUseSessionExpiration.lastCall.args[1];
      noTimeoutCallback();

      expect(clearTimeoutSpy.calledWith(timeoutStub)).to.be.true;
    });
  });
});
