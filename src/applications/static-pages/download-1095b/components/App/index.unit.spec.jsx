import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from './index';
import { NotFoundComponent, PdfHelp } from './utils';

const mockStore = configureStore([]);
const toggleKeyForm1095bMultipleYears = 'form1095b_multiple_years';

const goodAvailableFormsResponse = {
  availableForms: [{ year: 2024, lastUpdated: '2025-02-03T18:50:40.548Z' }],
};
const multiYearAvailableFormsResponse = {
  availableForms: [
    { year: 2022, lastUpdated: '2023-02-03T18:50:40.548Z' },
    { year: 2025, lastUpdated: '2025-02-03T18:50:40.548Z' },
    { year: 2024, lastUpdated: '2024-02-03T18:50:40.548Z' },
    { year: 2023, lastUpdated: '2023-02-03T18:50:40.548Z' },
  ],
};
const emptyAvailableFormsResponse = {
  availableForms: [],
};

const setupAvailableFormsResponse = (mswServer, status, responsePayload) => {
  mswServer.use(
    createGetHandler(
      'https://dev-api.va.gov/v0/form1095_bs/available_forms',
      () => jsonResponse(responsePayload || {}, { status }),
    ),
  );
};

describe('App component', () => {
  let store;

  const unauthenticatedState = {
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        loa: {
          current: null,
        },
      },
    },
  };
  const unverifiedState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        loa: {
          current: 1,
        },
        signIn: {
          serviceName: null,
        },
      },
    },
  };
  const authedAndVerifiedState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        loa: {
          current: 3,
        },
      },
    },
  };

  const renderWithProvider = state => {
    store = mockStore({
      featureToggles: {
        loading: false,
        [toggleKeyForm1095bMultipleYears]: false,
      },
      ...state,
    });

    return render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  };

  describe('when not authenticated', () => {
    it('renders the sign-in alert', async () => {
      const { container } = renderWithProvider(unauthenticatedState);
      await waitFor(() => {
        expect($('va-button', container).outerHTML).to.contain(
          'Sign in or create an account',
        );
      });
    });
  });
  describe('when not verified', () => {
    describe('when using ID.me', () => {
      it('renders the sign-in alert', async () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'idme';
        const { container } = renderWithProvider(testState);
        await waitFor(() => {
          expect($('.idme-verify-button', container).outerHTML).to.exist;
        });
      });
    });
    describe('when using Login.gov', () => {
      it('renders the sign-in alert', async () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'logingov';
        const { container } = renderWithProvider(testState);
        await waitFor(() => {
          expect($('.logingov-verify-button', container).outerHTML).to.exist;
        });
      });
    });
    describe('when not using ID.me or Login.gov', () => {
      it('renders the sign-in alert', async () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'mhv';
        const { container } = renderWithProvider(testState);
        await waitFor(() => {
          expect($('.logingov-verify-button', container).outerHTML).to.exist;
          expect($('.idme-verify-button', container).outerHTML).to.exist;
        });
      });
    });
  });

  describe('when authenticated and verified', () => {
    it('renders the loading message', async () => {
      const testState = {
        ...authedAndVerifiedState,
        user: {
          ...authedAndVerifiedState.user,
          profile: {
            ...authedAndVerifiedState.user.profile,
            loading: true,
          },
        },
      };
      const { container } = renderWithProvider(testState);
      await waitFor(() => {
        expect(
          container.querySelector(
            'va-loading-indicator[message="Loading your 1095-B information..."]',
          ),
        ).to.exist;
      });
    });

    it('renders the download form', async () => {
      setupAvailableFormsResponse(server, 200, goodAvailableFormsResponse);
      const { container } = renderWithProvider(authedAndVerifiedState);
      await waitFor(() => {
        const pdfLink = container.querySelector(
          'va-link[text="Download 2024 PDF (best for printing)"]',
        );
        expect(pdfLink).to.exist;
        const textLink = container.querySelector(
          'va-link[text="Download 2024 Text file (best for screen readers, enlargers, and refreshable Braille displays)"]',
        );
        expect(textLink).to.exist;
      });
    });

    describe('when the forms endpoint fails', () => {
      it('renders an error alert', async () => {
        setupAvailableFormsResponse(server, 500, false);
        const { findByText } = renderWithProvider(authedAndVerifiedState);
        const alert = await findByText('System error');
        expect(alert).to.exist;
      });
    });

    describe('when feature flag is enabled', () => {
      it('renders newest 3 years in descending order', async () => {
        setupAvailableFormsResponse(
          server,
          200,
          multiYearAvailableFormsResponse,
        );
        const { container } = renderWithProvider({
          ...authedAndVerifiedState,
          featureToggles: {
            loading: false,
            [toggleKeyForm1095bMultipleYears]: true,
          },
        });
        await waitFor(() => {
          const content = container.textContent;
          expect(content).to.include('Tax year: 2025');
          expect(content).to.include('Tax year: 2024');
          expect(content).to.include('Tax year: 2023');
          expect(content).to.not.include('Tax year: 2022');

          const pos2025 = content.indexOf('Tax year: 2025');
          const pos2024 = content.indexOf('Tax year: 2024');
          const pos2023 = content.indexOf('Tax year: 2023');
          expect(pos2025).to.be.lessThan(pos2024);
          expect(pos2024).to.be.lessThan(pos2023);
        });
      });
    });
  });

  describe('when no 1095-B form data is found', () => {
    it('renders default copy when feature flag is off', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { findByText } = renderWithProvider(authedAndVerifiedState);
      const message = await findByText(
        `You don’t have a 1095-B tax form available right now`,
      );
      expect(message).to.exist;
    });

    it('renders the default notFound copy when feature flag is off', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { findByText, queryByText } = renderWithProvider(
        authedAndVerifiedState,
      );
      const bodyCopy = await findByText(
        text =>
          text.includes('You don’t have a 1095-B tax form available.') &&
          text.includes('were a CHAMPVA beneficiary') &&
          text.includes('weren’t enrolled in VA healthcare.'),
      );
      expect(bodyCopy).to.exist;
      expect(queryByText(/last three years/i)).to.not.exist;
    });

    it('renders multiple-years copy when feature flag is on', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { container } = renderWithProvider({
        ...authedAndVerifiedState,
        featureToggles: {
          loading: false,
          [toggleKeyForm1095bMultipleYears]: true,
        },
      });
      await waitFor(() => {
        const alertBody = container.querySelector('va-alert p');
        expect(alertBody).to.exist;
        expect(alertBody.textContent).to.include(
          'You do not have any 1095-B tax forms available.',
        );
        expect(alertBody.textContent).to.include('the last three years');
      });
    });

    it('renders the multi-year notFound copy when no links are available', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { container } = renderWithProvider({
        ...authedAndVerifiedState,
        featureToggles: {
          loading: false,
          [toggleKeyForm1095bMultipleYears]: true,
        },
      });
      await waitFor(() => {
        const alertBody = container.querySelector('va-alert p');
        expect(alertBody).to.exist;
        expect(alertBody.textContent).to.include(
          'You do not have any 1095-B tax forms available.',
        );
        expect(alertBody.textContent).to.include('the last three years');
      });
    });
  });

  describe('utils', () => {
    describe('NotFoundComponent', () => {
      it('renders default copy when feature flag is off', async () => {
        const toggleStore = mockStore({
          featureToggles: {
            loading: false,
            [toggleKeyForm1095bMultipleYears]: false,
          },
        });

        const { container } = render(
          <Provider store={toggleStore}>
            <NotFoundComponent />
          </Provider>,
        );

        const headline = container.querySelector('va-alert h3');
        const body = container.querySelector('va-alert p');
        expect(headline.textContent).to.equal(
          'You don’t have a 1095-B tax form available right now',
        );
        expect(body.textContent).to.include('CHAMPVA beneficiary');
        expect(body.textContent).to.not.include('last three years');
      });

      it('renders multiple-years copy when feature flag is on', () => {
        const toggleStore = mockStore({
          featureToggles: {
            loading: false,
            [toggleKeyForm1095bMultipleYears]: true,
          },
        });

        const { container } = render(
          <Provider store={toggleStore}>
            <NotFoundComponent />
          </Provider>,
        );

        const headline = container.querySelector('va-alert h3');
        expect(headline.textContent).to.include(
          'have any 1095-B tax forms available',
        );
        const alertBody = container.querySelector('va-alert p');
        expect(alertBody).to.exist;
        expect(alertBody.textContent).to.include(
          'You do not have any 1095-B tax forms available.',
        );
        expect(alertBody.textContent).to.include('the last three years');
      });
    });

    describe('PdfHelp', () => {
      it('does not render missing-year note when feature flag is off', () => {
        const toggleStore = mockStore({
          featureToggles: {
            loading: false,
            [toggleKeyForm1095bMultipleYears]: false,
          },
        });

        const { queryByText } = render(
          <Provider store={toggleStore}>
            <PdfHelp />
          </Provider>,
        );

        expect(queryByText(/missing a 1095-B/i)).to.not.exist;
      });

      it('renders missing-year note when feature flag is on', () => {
        const toggleStore = mockStore({
          featureToggles: {
            loading: false,
            [toggleKeyForm1095bMultipleYears]: true,
          },
        });

        const { getByText } = render(
          <Provider store={toggleStore}>
            <PdfHelp />
          </Provider>,
        );

        expect(
          getByText(
            /If this page is missing a 1095-B for a year you were enrolled in VA health care within the past 3 years/i,
          ),
        ).to.exist;
      });
    });
  });
});
