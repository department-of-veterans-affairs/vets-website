import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom-v5-compat';
import sinon from 'sinon';
import { useNavigationGuard } from './useNavigationGuard';

// Test component that uses the hook
const TestComponent = ({ hookOptions, onRender }) => {
  const hookResult = useNavigationGuard(hookOptions);

  if (onRender) {
    onRender(hookResult);
  }

  return <div data-testid="test-component">Test</div>;
};

describe('useNavigationGuard', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderWithRouter = (Component, props = {}) => {
    return render(<BrowserRouter>{Component}</BrowserRouter>, props);
  };

  describe('initialization', () => {
    it('should initialize with default values', () => {
      let hookResult;
      renderWithRouter(
        <TestComponent
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.isModalVisible).to.be.false;
      expect(hookResult.blockedLocation).to.be.null;
      expect(hookResult.confirmNavigation).to.be.a('function');
      expect(hookResult.cancelNavigation).to.be.a('function');
      expect(hookResult.setIsModalVisible).to.be.a('function');
    });

    it('should accept custom options', () => {
      const onNavigateAway = sinon.spy();
      let hookResult;

      renderWithRouter(
        <TestComponent
          hookOptions={{
            shouldBlock: true,
            otpPath: '/custom-otp',
            onNavigateAway,
          }}
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult).to.exist;
    });
  });

  describe('beforeunload event', () => {
    it('should add beforeunload listener when shouldBlock is true', () => {
      const addEventListenerSpy = sandbox.spy(window, 'addEventListener');

      renderWithRouter(<TestComponent hookOptions={{ shouldBlock: true }} />);

      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });

    it('should not add beforeunload listener when shouldBlock is false', () => {
      const addEventListenerSpy = sandbox.spy(window, 'addEventListener');

      renderWithRouter(<TestComponent hookOptions={{ shouldBlock: false }} />);

      // Should not be called with beforeunload for this specific render
      const beforeUnloadCalls = addEventListenerSpy
        .getCalls()
        .filter(call => call.args[0] === 'beforeunload');
      expect(beforeUnloadCalls.length).to.equal(0);
    });

    it('should remove beforeunload listener on unmount', () => {
      const removeEventListenerSpy = sandbox.spy(window, 'removeEventListener');

      const { unmount } = renderWithRouter(
        <TestComponent hookOptions={{ shouldBlock: true }} />,
      );

      unmount();

      expect(removeEventListenerSpy.calledWith('beforeunload')).to.be.true;
    });
  });

  describe('external link handling', () => {
    it('should add click listener when shouldBlock is true', () => {
      const addEventListenerSpy = sandbox.spy(document, 'addEventListener');

      renderWithRouter(<TestComponent hookOptions={{ shouldBlock: true }} />);

      const clickListenerCalls = addEventListenerSpy
        .getCalls()
        .filter(call => call.args[0] === 'click');
      expect(clickListenerCalls.length).to.be.at.least(1);
    });

    it('should remove click listener on unmount', () => {
      const removeEventListenerSpy = sandbox.spy(
        document,
        'removeEventListener',
      );

      const { unmount } = renderWithRouter(
        <TestComponent hookOptions={{ shouldBlock: true }} />,
      );

      unmount();

      const clickListenerCalls = removeEventListenerSpy
        .getCalls()
        .filter(call => call.args[0] === 'click');
      expect(clickListenerCalls.length).to.be.at.least(1);
    });
  });

  describe('navigation confirmation', () => {
    it('should hide modal when cancelNavigation is called', async () => {
      let hookResult;

      renderWithRouter(
        <TestComponent
          hookOptions={{ shouldBlock: true }}
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      // Simulate showing modal
      hookResult.setIsModalVisible(true);

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.true;
      });

      // Cancel navigation
      hookResult.cancelNavigation();

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.false;
      });
    });

    it('should call onNavigateAway when confirmNavigation is called', async () => {
      const onNavigateAway = sinon.spy();
      let hookResult;

      renderWithRouter(
        <TestComponent
          hookOptions={{ shouldBlock: true, onNavigateAway }}
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      // Simulate navigation
      hookResult.setIsModalVisible(true);

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.true;
      });

      hookResult.confirmNavigation();

      await waitFor(() => {
        expect(onNavigateAway.calledOnce).to.be.true;
      });
    });

    it('should hide modal when confirmNavigation is called', async () => {
      let hookResult;

      renderWithRouter(
        <TestComponent
          hookOptions={{ shouldBlock: true }}
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      hookResult.setIsModalVisible(true);

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.true;
      });

      hookResult.confirmNavigation();

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.false;
      });
    });
  });

  describe('modal visibility', () => {
    it('should allow manual control of modal visibility', async () => {
      let hookResult;

      renderWithRouter(
        <TestComponent
          hookOptions={{ shouldBlock: true }}
          onRender={result => {
            hookResult = result;
          }}
        />,
      );

      expect(hookResult.isModalVisible).to.be.false;

      hookResult.setIsModalVisible(true);

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.true;
      });

      hookResult.setIsModalVisible(false);

      await waitFor(() => {
        expect(hookResult.isModalVisible).to.be.false;
      });
    });
  });
});
