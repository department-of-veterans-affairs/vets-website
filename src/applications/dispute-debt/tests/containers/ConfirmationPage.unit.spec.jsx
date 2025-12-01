import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import formConfig from '../../config/form';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

const createMockStore = (state = {}) => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
});

describe('ConfirmationPage', () => {
  // const alert_title = ;
  // const alert_description = 'An email confirmation has been sent to . You should also receive a confirmation letter in the mail within 60 days. We expect to issue a decision within 180 days and will notify you of the outcome in a follow-up letter.';
  const defaultProps = {
    route: {
      formConfig,
    },
  };

  const defaultState = {
    form: {
      ...createInitialState(formConfig),
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

  it('renders the submission alert message with the users email', () => {
    const { getByText } = render(
      <Provider store={createMockStore(defaultState)}>
        <ConfirmationPage {...defaultProps} />
      </Provider>,
    );

    expect(getByText('Your dispute submission is in progress')).to.exist;
    // expect(getByText('An email confirmation has been sent to')).to.exist;
  });

  it('renders the PDF download link with correct attributes', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <ConfirmationPage {...defaultProps} />
      </Provider>,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;

    expect(vaLink.getAttribute('download')).to.equal('true');
    expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    expect(vaLink.getAttribute('filename')).to.equal(
      'VA-Dispute-Debt-Submission.pdf',
    );

    expect(vaLink.getAttribute('text')).to.equal(
      'Download a copy of your VA Form DISPUTE-DEBT',
    );
  });
});
