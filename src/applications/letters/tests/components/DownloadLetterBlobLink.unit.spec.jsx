import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
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
});
