import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';

const getData = ({
  loggedIn = true,
  hasResponse = true,
  hasRegionalOffice = true,
  hasBankAccount = true,
  timestamp = new Date('09/07/2025'),
} = {}) => ({
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          verified: false,
        },
      },
      form: {
        submission: {
          ...(hasResponse && {
            response: {
              confirmationNumber: 'V-PEN-177',
              ...(hasRegionalOffice && {
                regionalOffice: [
                  'Attention: Western Region',
                  'VA Regional Office',
                  'P.O. Box 8888',
                  'Muskogee, OK 74402-8888',
                ],
              }),
            },
          }),
          timestamp,
        },
        data: {
          veteranFullName: { first: 'Jane', last: 'Doe' },
          ...(hasBankAccount && {
            bankAccount: {
              accountType: 'checking',
              bankName: 'Best Bank',
              accountNumber: '001122334455',
              routingNumber: '123123123',
            },
          }),
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Pension benefits confirmation page', () => {
  it('should render with correct content', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect($('h2', container)).to.exist;
    expect($('h2', container).textContent).to.eql(
      'Form submission started on September 7, 2025',
    );
    expect($('.confirmation-submission-alert-section', container)).to.exist;
    expect($('.confirmation-print-this-page-section', container)).to.exist;
    expect($('.confirmation-whats-next-process-list-section', container)).to
      .exist;
    const sections = $$('section');
    expect(sections.length).to.eq(3);
    expect($('h2', sections[0]).textContent).to.eql(
      'If you need to submit supporting documents',
    );
    expect($('va-link', sections[0])).to.have.attr(
      'text',
      'Use the Claim Status Tool to upload your documents',
    );
    expect($('.va-address-block', sections[0])).to.exist;

    expect($('h2', sections[1]).textContent).to.eql(
      'Direct deposit account information',
    );
    expect($('va-link', sections[1])).to.have.attr(
      'text',
      'Review your direct deposit information',
    );
    expect($('.va-address-block', sections[1])).to.exist;
    expect($('h2', sections[2]).textContent).to.eql(
      'When to tell us if your information changes',
    );
    const howToContactSection = $(
      '.confirmation-how-to-contact-section',
      container,
    );
    expect(howToContactSection).to.exist;
    expect($('va-telephone', howToContactSection)).to.exist;
    expect($('va-link', howToContactSection)).to.exist;
    expect($('va-link', howToContactSection)).to.have.attr(
      'text',
      'Contact us online through Ask VA',
    );
    expect($$('.va-address-block', container).length).to.eq(2);
    expect($('#pension_527ez_submission_confirmation', container)).to.exist;
  });

  it('should render if no submission response', () => {
    const { mockStore } = getData({ hasResponse: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect($('#pension_527ez_submission_confirmation', container)).not.to.exist;
  });

  it('should not include bank account section', () => {
    const { mockStore } = getData({ hasBankAccount: false });
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    const sections = $$('section');
    expect(sections.length).to.eq(2);
    expect($('h2', sections[0]).textContent).to.eql(
      'If you need to submit supporting documents',
    );
    expect($('h2', sections[1]).textContent).to.eql(
      'When to tell us if your information changes',
    );
    expect($$('.va-address-block', container).length).to.eq(1);
  });
});
