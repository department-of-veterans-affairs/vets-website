import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { NoFormPage } from '../components/NoFormPage';

const store = ({ isLoggedIn = false } = {}) => ({
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
};

describe('NoFormPage', () => {
  const server = setupServer();
  before(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  it('should render if NOT logged in', async () => {
    server.use(
      rest.get(
        'https://dev-api.va.gov/v0/in_progress_forms/21P-530',
        (req, res, ctx) => {
          const responseData = { formData: {}, metadata: {} };
          return res(ctx.json(responseData), ctx.status(200));
        },
      ),
    );
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <NoFormPage />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
    await waitFor(() => {
      expect($('h1', container).textContent).to.eql(
        'Review burial benefits application',
      );
      expect($$('h2', container)[0].textContent).to.eql(
        'You don’t have any saved online burial forms.',
      );
    });
  });

  it('should render if IS logged in && DOES NOT have form data in progress', async () => {
    server.use(
      rest.get(
        'https://dev-api.va.gov/v0/in_progress_forms/21P-530',
        (req, res, ctx) => {
          const responseData = { formData: {}, metadata: {} };
          return res(ctx.json(responseData), ctx.status(200));
        },
      ),
    );
    const mockStore = store({ isLoggedIn: true });
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

  it('should render if IS logged in && DOES have form data in progress', async () => {
    server.use(
      rest.get(
        'https://dev-api.va.gov/v0/in_progress_forms/21P-530',
        (req, res, ctx) => {
          const responseData = {
            formData: { ...mockFormData },
            metadata: { inProgressFormId: 5, createdAt: 1695063470866 },
          };
          return res(ctx.json(responseData), ctx.status(200));
        },
      ),
    );
    const mockStore = store({ isLoggedIn: true });
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
