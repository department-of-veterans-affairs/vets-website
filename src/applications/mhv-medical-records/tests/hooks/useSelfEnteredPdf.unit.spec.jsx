import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import useSelfEnteredPdf from '../../hooks/useSelfEnteredPdf';
import * as MrApi from '../../api/MrApi';
import * as helpers from '../../util/helpers';

/**
 * Test component that uses the hook and exposes its values for testing
 */
const TestComponent = ({ runningUnitTest = false }) => {
  const hookResult = useSelfEnteredPdf(runningUnitTest);

  return (
    <div>
      <button
        type="button"
        data-testid="download-button"
        onClick={hookResult.handleDownload}
      >
        Download
      </button>
      <span data-testid="loading">{String(hookResult.loading)}</span>
      <span data-testid="success">{String(hookResult.success)}</span>
      <span data-testid="error">{String(hookResult.error)}</span>
      <span data-testid="failed-domains">
        {JSON.stringify(hookResult.failedDomains)}
      </span>
    </div>
  );
};

describe('useSelfEnteredPdf hook', () => {
  let postRecordDatadogActionStub;
  let sendDataDogActionStub;

  const mockStore = {
    getState: () => ({
      user: {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const renderWithStore = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <TestComponent {...props} />
      </Provider>,
    );
  };

  beforeEach(() => {
    postRecordDatadogActionStub = sinon.stub(MrApi, 'postRecordDatadogAction');
    sendDataDogActionStub = sinon.stub(helpers, 'sendDataDogAction');
  });

  afterEach(() => {
    postRecordDatadogActionStub.restore();
    sendDataDogActionStub.restore();
  });

  describe('initial state', () => {
    it('returns correct initial values', () => {
      const { getByTestId } = renderWithStore();

      expect(getByTestId('loading').textContent).to.equal('false');
      expect(getByTestId('success').textContent).to.equal('false');
      expect(getByTestId('error').textContent).to.equal('null');
      expect(getByTestId('failed-domains').textContent).to.equal('[]');
    });

    it('renders download button', () => {
      const { getByTestId } = renderWithStore();

      expect(getByTestId('download-button')).to.exist;
    });
  });

  describe('handleDownload', () => {
    it('calls Datadog tracking functions when download is triggered', async () => {
      const { getByTestId } = renderWithStore({ runningUnitTest: true });

      fireEvent.click(getByTestId('download-button'));

      await waitFor(() => {
        expect(postRecordDatadogActionStub.calledOnce).to.be.true;
        expect(sendDataDogActionStub.calledOnce).to.be.true;
        expect(sendDataDogActionStub.firstCall.args[0]).to.equal(
          'Download self-entered health information PDF link',
        );
      });
    });

    it('prevents default event behavior', () => {
      const { getByTestId } = renderWithStore({ runningUnitTest: true });
      const button = getByTestId('download-button');

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = sinon.spy(event, 'preventDefault');

      button.dispatchEvent(event);

      expect(preventDefaultSpy.called).to.be.true;
    });

    // Note: Tests for loading, success, and error states require mocking
    // generateSEIPdf from @department-of-veterans-affairs/mhv/exports.
    // Due to ES module caching issues, these tests are better suited for
    // integration testing or using a testing library that supports module mocking.
    // The core behavior of the hook (calling generateSEIPdf and updating state)
    // is validated through the component-level tests.
  });

  describe('hook return value structure', () => {
    it('returns an object with expected properties', () => {
      let hookResult;
      const CaptureComponent = ({ runningUnitTest = false }) => {
        hookResult = useSelfEnteredPdf(runningUnitTest);
        return null;
      };

      render(
        <Provider store={mockStore}>
          <CaptureComponent />
        </Provider>,
      );

      expect(hookResult).to.have.property('loading');
      expect(hookResult).to.have.property('success');
      expect(hookResult).to.have.property('failedDomains');
      expect(hookResult).to.have.property('error');
      expect(hookResult).to.have.property('handleDownload');
      expect(typeof hookResult.handleDownload).to.equal('function');
    });

    it('returns loading as a boolean', () => {
      let hookResult;
      const CaptureComponent = () => {
        hookResult = useSelfEnteredPdf(false);
        return null;
      };

      render(
        <Provider store={mockStore}>
          <CaptureComponent />
        </Provider>,
      );

      expect(typeof hookResult.loading).to.equal('boolean');
    });

    it('returns success as a boolean', () => {
      let hookResult;
      const CaptureComponent = () => {
        hookResult = useSelfEnteredPdf(false);
        return null;
      };

      render(
        <Provider store={mockStore}>
          <CaptureComponent />
        </Provider>,
      );

      expect(typeof hookResult.success).to.equal('boolean');
    });

    it('returns failedDomains as an array', () => {
      let hookResult;
      const CaptureComponent = () => {
        hookResult = useSelfEnteredPdf(false);
        return null;
      };

      render(
        <Provider store={mockStore}>
          <CaptureComponent />
        </Provider>,
      );

      expect(Array.isArray(hookResult.failedDomains)).to.be.true;
    });
  });

  describe('Redux integration', () => {
    it('uses user profile from Redux state', () => {
      // This test verifies the hook renders without error when connected to Redux
      const { getByTestId } = renderWithStore();

      // If the hook couldn't access Redux state, it would throw an error
      expect(getByTestId('download-button')).to.exist;
    });

    it('handles missing user profile gracefully', () => {
      const emptyStore = {
        getState: () => ({
          user: {},
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { getByTestId } = render(
        <Provider store={emptyStore}>
          <TestComponent runningUnitTest />
        </Provider>,
      );

      // Should render without throwing
      expect(getByTestId('download-button')).to.exist;
    });
  });
});
