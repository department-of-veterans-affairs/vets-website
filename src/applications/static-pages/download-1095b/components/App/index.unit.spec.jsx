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

const mockStore = configureStore([]);

const goodAvailableFormsResponse = {
  availableForms: [{ year: 2024, lastUpdated: '2025-02-03T18:50:40.548Z' }],
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
    store = mockStore(state);
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
          'va-link[text="Download PDF (best for printing)"]',
        );
        expect(pdfLink).to.exist;
        const textLink = container.querySelector(
          'va-link[text="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"]',
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
  });

  describe('when no 1095-B form data is found', () => {
    it('renders a message', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { findByText } = renderWithProvider(authedAndVerifiedState);
      const message = await findByText(
        `You don’t have a 1095-B tax form available right now`,
      );
      expect(message).to.exist;
    });
  });
});
