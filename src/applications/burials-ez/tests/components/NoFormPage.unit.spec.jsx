import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { NoFormPage } from '../../components/NoFormPage';

const store = ({ isLoggedIn = true } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: isLoggedIn,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const mockFormData = {
  formData: {
    vaFileNumber: '123456789',
    burialAllowanceRequested: 'nonService',
    'view:nonServiceWarning': {},
    previouslyReceivedAllowance: false,
    transportationReceipts: [
      {
        name: 'Screenshot 2023-09-12 at 9.00.56 AM.png',
        size: 253195,
        confirmationCode: 'd2e0a00c-ec55-4e37-ac85-d6b58c10a98a',
        isEncrypted: false,
      },
    ],
    'view:serviceRecordWarning': {},
    claimantAddress: {
      street: '123 Faker Street',
      city: 'Bogusville',
      country: 'USA',
      state: 'GA',
      postalCode: '30058',
    },
    claimantEmail: 'test2@test1.net',
    claimantPhone: '4445551212',
    'view:claimedBenefits': { burialAllowance: true },
    deathDate: '1999-02-01',
    burialDate: '1999-02-03',
    'view:burialDateWarning': {},
    locationOfDeath: { location: 'stateVeteransHome' },
    veteranFullName: { first: 'Steven', last: 'Franks' },
    veteranSocialSecurityNumber: '576555555',
    veteranDateOfBirth: '1978-01-01',
    claimantFullName: { first: 'Mark', last: 'Webb', suffix: 'Jr.' },
    relationship: { type: 'spouse' },
    'view:serviceRecordNotification': {},
  },
  metadata: {
    version: 0,
    inProgressFormId: 1,
  },
};

describe('NoFormPage', () => {
  it('should render if DOES NOT have form data in progress', async () => {
    mockApiRequest({ formData: {}, metadata: {} });
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <NoFormPage />
      </Provider>,
    );
    await waitFor(() => {
      expect($('h1', container).textContent).to.eql(
        'Review burial benefits application',
      );
    });
  });

  it('should render if DOES have form data in progress', async () => {
    mockApiRequest(mockFormData);
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <NoFormPage />
      </Provider>,
    );
    await waitFor(() => {
      expect($$('h2', container)[0].textContent).to.eql(
        'This online form isn’t working right now',
      );
      expect($$('h2', container).length <= 9).to.be.true;
    });
  });

  it('should render if DOES have form data in progress && supports no form data', async () => {
    const defaultMockData = { ...mockFormData };
    defaultMockData.formData = {};
    mockApiRequest(defaultMockData);
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <NoFormPage />
      </Provider>,
    );
    await waitFor(() => {
      expect($$('h2', container)[0].textContent).to.eql(
        'This online form isn’t working right now',
      );
      expect($$('h2', container).length <= 9).to.be.true;
    });
  });
});
