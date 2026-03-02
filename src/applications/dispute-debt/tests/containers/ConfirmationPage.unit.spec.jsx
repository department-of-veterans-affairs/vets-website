import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { createInitialState } from '@department-of-veterans-affairs/platform-forms-system/state/helpers';
import { I18nextProvider } from 'react-i18next';
import formConfig from '../../config/form';
import i18nDebtApp from '../../i18n';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

const createMockStore = (state = {}) => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
});

describe('ConfirmationPage', () => {
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
    user: {
      profile: {
        email: 'testemail@test.com',
      },
    },
  };

  it('renders without errors', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <I18nextProvider i18n={i18nDebtApp}>
          <ConfirmationPage {...defaultProps} />
        </I18nextProvider>
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders the submission alert message with the users email', () => {
    const { getByText, container } = render(
      <Provider store={createMockStore(defaultState)}>
        <I18nextProvider i18n={i18nDebtApp}>
          <ConfirmationPage {...defaultProps} />
        </I18nextProvider>
      </Provider>,
    );

    expect(getByText('Your dispute submission is in progress')).to.exist;
    const alert = container.querySelector('va-alert');
    expect(alert.textContent).to.include(
      'We sent a confirmation email to testemail@test.com',
    );
    expect(alert.textContent).to.include(
      'We’ll send you a confirmation letter in the mail once we’ve processed your dispute. You should receive that letter within 60 days.',
    );
  });

  it('renders the correct whats next steps', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <I18nextProvider i18n={i18nDebtApp}>
          <ConfirmationPage {...defaultProps} />
        </I18nextProvider>
      </Provider>,
    );

    const whatsNextSection = container.querySelector(
      '.confirmation-whats-next-process-list-section',
    );
    const [firstItem, secondItem] = whatsNextSection.querySelectorAll(
      'va-process-list-item',
    );

    expect(firstItem.getAttribute('header')).to.equal(
      'We’ll confirm when we processed your dispute',
    );
    expect(
      'After we receive your submission, we’ll review your dispute. You should receive a confirmation letter by mail within 60 days.',
    ).to.exist;
    expect(secondItem.getAttribute('header')).to.equal(
      'We’ll review your dispute',
    );
    expect(
      'A decision is normally made within 180 days.  We will send you a letter with the outcome.',
    ).to.exist;
  });

  it('renders the PDF download link with correct attributes', () => {
    const { container } = render(
      <Provider store={createMockStore(defaultState)}>
        <I18nextProvider i18n={i18nDebtApp}>
          <ConfirmationPage {...defaultProps} />
        </I18nextProvider>
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
