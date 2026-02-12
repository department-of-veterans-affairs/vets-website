import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

const getData = ({
  loggedIn = true,
  hasResponse = true,
  timestamp = new Date('09/07/2025'),
  confirmationNumber = 'CNF-1234-5678-VA',
  claimantType = 'VETERAN',
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
        formId: formConfig.formId,
        submission: {
          ...(hasResponse && {
            response: {
              attributes: {
                confirmationNumber,
              },
            },
            timestamp,
          }),
        },
        data: {
          claimantType,
          claimantFullName: {
            first: 'Jane',
            middle: 'C',
            last: 'ClaimantLastName',
          },
          veteranFullName: {
            first: 'John',
            middle: '',
            last: 'VeteranLastName',
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Confirmation page', () => {
  it('it should show status success', () => {
    const { mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
  });

  it('should not show the claimant name if the applicant is the veteran', () => {
    const { mockStore } = getData();
    const { queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText(/Jane/)).to.be.null;
    expect(queryByText(/ClaimantLastName/)).to.be.null;
  });

  it('should show the claimant name if the applicant is not the veteran', () => {
    const { mockStore } = getData({ claimantType: 'SPOUSE' });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/Jane/);
    getByText(/ClaimantLastName/);
  });

  it('should show the confirmation number if it is provided', () => {
    const { mockStore } = getData();

    const { queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText(/Your confirmation number is/i)).to.exist;
  });

  it('should not show the confirmation number if none is provided', () => {
    const { mockStore } = getData({ hasResponse: false });

    const { queryByText } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText(/Your confirmation number is/i)).to.be.null;
  });

  it('should show the "Check the status of your form on My VA" link', () => {
    const { mockStore } = getData();

    const { container } = render(
      <Provider store={mockStore}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    const link = container.querySelector(
      'va-link[text="Check the status of your form on My VA"][href="/my-va#benefit-applications"]',
    );

    expect(link).to.not.be.null;
  });
});
