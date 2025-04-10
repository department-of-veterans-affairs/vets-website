import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from './index';

const mockStore = configureStore([]);

const goodAvailableFormsResponse = {
  availableForms: [{ year: 2024, lastUpdated: '2025-02-03T18:50:40.548Z' }],
};
const emptyAvailableFormsResponse = {
  availableForms: [],
};

const setupAvailableFormsResponse = (server, status, responsePayload) => {
  server.use(
    rest.get(
      'https://dev-api.va.gov/v0/form1095_bs/available_forms',
      (_, res, ctx) => {
        if (responsePayload) {
          return res(ctx.status(status), ctx.json(responsePayload));
        }
        return res(ctx.status(status));
      },
    ),
  );
};

describe('App component', () => {
  let store;
  const server = setupServer();
  before(() => {
    server.listen();
  });
  after(() => {
    server.close();
  });
  setupAvailableFormsResponse(server, 200, goodAvailableFormsResponse);

  const unauthenticatedState = {
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
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
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
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
    featureToggles: {
      loading: false,
      showDigitalForm1095b: true,
    },
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
      const { container, getByTestId, queryByText } = renderWithProvider(
        authedAndVerifiedState,
      );
      await waitFor(() => {
        expect(queryByText('Loading')).not.to.exist;
      });
      await waitFor(() => {
        expect(
          container.querySelector(
            'va-link[text="Download PDF (best for printing)"]',
          ),
        ).to.exist;
      });

      expect(
        container.querySelector(
          'va-link[text="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"]',
        ),
      ).to.exist;
      fireEvent.click(
        $('va-link[text="Download PDF (best for printing)"]', container),
      );
      fireEvent.click(
        $(
          'va-link[text="Download Text file (best for screen readers, enlargers, and refreshable Braille displays)"]',
          container,
        ),
      );
      await waitFor(() => {
        expect(getByTestId('downloadError')).to.exist;
      });
      const target = getByTestId('downloadError');
      expect(document.activeElement).to.eq(target);
    });

    describe('when the forms endpoint fails', () => {
      it('renders an error alert', async () => {
        setupAvailableFormsResponse(server, 500, false);
        const { queryByText } = renderWithProvider(authedAndVerifiedState);
        await waitFor(() => {
          expect(queryByText('Loading')).not.to.exist;
        });
        await waitFor(() => {
          expect(queryByText('System error')).to.exist;
        });
      });
    });

    describe('when the feature flag is off', () => {
      it('renders an "unavailable" messsage', async () => {
        const testState = {
          ...authedAndVerifiedState,
          featureToggles: {
            ...authedAndVerifiedState.featureToggles,
            showDigitalForm1095b: false,
          },
          user: {
            ...authedAndVerifiedState.user,
            profile: {
              ...authedAndVerifiedState.user.profile,
              loading: false,
            },
          },
        };
        const { queryByText } = renderWithProvider(testState);
        await waitFor(() => {
          expect(queryByText('Loading')).not.to.exist;
        });
        await waitFor(() => {
          expect(
            queryByText(
              'Your 1095-B form isn’t available to download right now',
            ),
          ).to.exist;
        });
      });
    });
  });

  describe('when no 1095-B form data is found', () => {
    it('renders a message', async () => {
      setupAvailableFormsResponse(server, 200, emptyAvailableFormsResponse);
      const { queryByText } = renderWithProvider(authedAndVerifiedState);

      await waitFor(() => {
        expect(queryByText('Loading')).not.to.exist;
      });
      await waitFor(() => {
        expect(
          queryByText('You don’t have a 1095-B tax form available right now'),
        ).to.exist;
      });
    });
  });
});
