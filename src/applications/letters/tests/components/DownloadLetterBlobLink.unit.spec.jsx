import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import DownloadLetterBlobLink from '../../components/DownloadLetterBlobLink';
import { DOWNLOAD_STATUSES } from '../../utils/constants';

const mockStore = configureStore([]);

describe('<DownloadLetterBlobLink />', () => {
  const defaultProps = {
    letterTitle: 'Test Letter',
    letterType: 'test_letter',
  };

  it('renders loading indicator when status is downloading', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.downloading,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    expect(container.querySelector('va-loading-indicator')).to.exist;
    expect(container.querySelector('va-loading-indicator')).to.have.attribute(
      'message',
      'Loading your letter...',
    );
  });

  it('renders download link when status is success', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [
          {
            letterType: 'test_letter',
            downloadUrl: 'http://example.com/test_letter.pdf',
          },
        ],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.success,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link).to.have.attribute(
      'href',
      'http://example.com/test_letter.pdf',
    );
    expect(link).to.have.attribute('text', 'Download Test Letter');
  });

  it('renders error alert when status is failure', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.failure,
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    const alertText = container.querySelector('p');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'error');
    expect(alert).to.have.attribute('role', 'alert');
    expect(alertText).to.exist;
    expect(alertText).to.have.text(
      'If you need help accessing your letter, please call VA Benefits and Services at . If you have hearing loss, call .',
    );
  });

  it('renders default message when status is unknown', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [],
        enhancedLetterStatus: {
          [defaultProps.letterType]: 'unknown_status',
        },
      },
    });

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const div = container.querySelector('div');
    expect(div).to.exist;
    expect(div).to.have.text('Refresh the browser to download your letter.');
  });

  it('dispatches getSingleLetterPDFLinkAction when accordion is open on mount', () => {
    const dispatchSpy = sinon.spy();
    const fakeRef = {
      current: document.createElement('details'),
    };
    fakeRef.current.setAttribute('open', '');

    const mockStorewithDispatch = {
      getState: () => ({
        letters: {
          enhancedLetters: [],
          enhancedLetterStatus: {},
        },
      }),
      subscribe: () => {},
      dispatch: dispatchSpy,
    };

    const { unmount } = render(
      <Provider store={mockStorewithDispatch}>
        <DownloadLetterBlobLink
          letterTitle="Test Letter"
          letterType="test_letter"
          accordionRef={fakeRef}
          LH_MIGRATION__options={{ foo: 'bar' }}
        />
      </Provider>,
    );

    expect(dispatchSpy.calledOnce).to.be.true;
    const dispatchedAction = dispatchSpy.firstCall.args[0];
    expect(dispatchedAction).to.be.a('function');

    unmount();
  });

  it('Logs letter download using client side monitoring.', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [
          {
            letterType: 'test_letter',
            downloadUrl: 'http://example.com/test_letter.pdf',
          },
        ],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.success,
        },
      },
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: true,
      },
    });

    // Stub datadogLogs.logger.info
    const loggerStub = sinon.stub(
      require('@datadog/browser-logs').datadogLogs.logger,
      'info',
    );

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const link = container.querySelector('va-link');

    // Simulate click
    fireEvent.click(link);

    expect(loggerStub.calledOnce).to.be.true;
    expect(loggerStub.firstCall.args[0]).to.equal('Letter downloaded.');
    expect(loggerStub.firstCall.args[1]).to.deep.equal({
      'letter-type': 'test_letter',
    });

    loggerStub.restore();
  });

  it('Does not log when feature flags are loading.', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [
          {
            letterType: 'test_letter',
            downloadUrl: 'http://example.com/test_letter.pdf',
          },
        ],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.success,
        },
      },
      featureToggles: {
        loading: true,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: true,
      },
    });

    // Stub datadogLogs.logger.info
    const loggerStub = sinon.stub(
      require('@datadog/browser-logs').datadogLogs.logger,
      'info',
    );

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const link = container.querySelector('va-link');

    // Simulate click
    fireEvent.click(link);

    expect(loggerStub.notCalled).to.be.true;
    loggerStub.restore();
  });

  it('Does not log when feature flag is false.', () => {
    const store = mockStore({
      letters: {
        enhancedLetters: [
          {
            letterType: 'test_letter',
            downloadUrl: 'http://example.com/test_letter.pdf',
          },
        ],
        enhancedLetterStatus: {
          [defaultProps.letterType]: DOWNLOAD_STATUSES.success,
        },
      },
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        letters_client_side_monitoring: false,
      },
    });

    // Stub datadogLogs.logger.info
    const loggerStub = sinon.stub(
      require('@datadog/browser-logs').datadogLogs.logger,
      'info',
    );

    const { container } = render(
      <Provider store={store}>
        <DownloadLetterBlobLink {...defaultProps} />
      </Provider>,
    );

    const link = container.querySelector('va-link');

    // Simulate click
    fireEvent.click(link);

    expect(loggerStub.notCalled).to.be.true;
    loggerStub.restore();
  });
});
