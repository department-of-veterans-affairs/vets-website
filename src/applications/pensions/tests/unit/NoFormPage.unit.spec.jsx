import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { NoFormPage } from '../../components/NoFormPage';

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
  veteranFullName: {},
  'view:wartimeWarning': {},
  nationalGuard: { address: { country: 'USA' } },
  powDateRange: {},
  severancePay: {},
  'view:history': {},
  spouseAddress: { country: 'USA' },
  netWorth: { bank: 0, interestBank: 0, ira: 0, stocks: 0, realProperty: 0 },
  monthlyIncome: {
    socialSecurity: 0,
    civilService: 0,
    railroad: 0,
    blackLung: 0,
    serviceRetirement: 0,
    ssi: 0,
  },
  expectedIncome: { salary: 0, interest: 0 },
  spouseNetWorth: {
    bank: 0,
    interestBank: 0,
    ira: 0,
    stocks: 0,
    realProperty: 0,
  },
  spouseMonthlyIncome: {
    socialSecurity: 0,
    civilService: 0,
    railroad: 0,
    blackLung: 0,
    serviceRetirement: 0,
    ssi: 0,
  },
  spouseExpectedIncome: { salary: 0, interest: 0 },
  bankAccount: {},
  'view:stopWarning': {},
  veteranAddress: { country: 'USA' },
  'view:evidenceInfo': {},
  'view:uploadMessage': {},
};

describe('NoFormPage', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should render if it DOES NOT have form data in progress', async () => {
    server.use(
      createGetHandler(
        'https://dev-api.va.gov/v0/in_progress_forms/21P-527EZ',
        () => jsonResponse({ formData: {}, metadata: {} }, { status: 200 }),
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
        'Review pension benefits application',
      );
    });
  });

  it('should render if it DOES have form data in progress', async () => {
    server.use(
      createGetHandler(
        'https://dev-api.va.gov/v0/in_progress_forms/21P-527EZ',
        () =>
          jsonResponse(
            {
              formData: { ...mockFormData },
              metadata: { inProgressFormId: 5, createdAt: 1695063470866 },
            },
            { status: 200 },
          ),
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
        'You can’t use our online application right now',
      );
      expect($$('h2', container).length <= 12).to.be.true;
    });
  });
});
