import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { ConfirmationPage } from '../../containers/ConfirmationPage';

const createMockStore = (state = {}) => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
});

describe('ConfirmationPage', () => {
  const defaultProps = {
    route: {
      formConfig: {
        formId: 'DISPUTE-DEBT',
        trackingPrefix: 'dispute-debt',
        chapters: {
          personalInformationChapter: {},
          debtSelectionChapter: {},
        },
      },
    },
  };

  const defaultState = {
    form: {
      submission: {
        response: {
          pdfUrl: 'test-pdf-url.pdf',
          confirmationNumber: '12345',
        },
        timestamp: '2023-11-13T12:00:00Z',
      },
    },
  };

  it('renders without errors', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <ConfirmationPage {...defaultProps} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders the PDF download link with correct attributes', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <ConfirmationPage {...defaultProps} />
      </Provider>,
    );

    // Find the va-link element
    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    // Check attributes
    expect(vaLink.getAttribute('download')).to.equal('true');
    expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    expect(vaLink.getAttribute('filename')).to.equal(
      'VA-Dispute-Debt-Submission.pdf',
    );
    expect(vaLink.getAttribute('text')).to.equal(
      'Download a copy of your VA Form 5655',
    );

    // Check the link text content
    const linkText = vaLink.shadowRoot?.textContent.trim();
    expect(linkText).to.include('Download a copy of your VA Form DISPUTE-DEBT');
    expect(linkText).to.include('(PDF)');

    // Check the icon is present
    const icon = vaLink.shadowRoot?.querySelector('va-icon');
    expect(icon).to.exist;
    expect(icon.getAttribute('class')).to.include('link-icon--left');
  });
});
