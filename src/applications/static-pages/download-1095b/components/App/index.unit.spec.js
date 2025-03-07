import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from './index';

const mockStore = configureStore([]);

describe('App component', () => {
  let store;

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

  describe('when not authenticated', () => {
    it('renders the sign-in alert', async () => {
      store = mockStore(unauthenticatedState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
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
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        await waitFor(() => {
          expect($('.idme-verify-button', container).outerHTML).to.exist;
        });
      });
    });
    describe('when using Login.gov', () => {
      it('renders the sign-in alert', async () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'logingov';
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        await waitFor(() => {
          expect($('.logingov-verify-button', container).outerHTML).to.exist;
        });
      });
    });
    describe('when not using ID.me or Login.gov', () => {
      it('renders the sign-in alert', async () => {
        const testState = unverifiedState;
        testState.user.profile.signIn.serviceName = 'mhv';
        store = mockStore(testState);
        const { container } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
        await waitFor(() => {
          expect($('.logingov-verify-button', container).outerHTML).to.exist;
          expect($('.idme-verify-button', container).outerHTML).to.exist;
        });
      });
    });
  });
  describe('when authenticated and verified', () => {
    const responsePayload = {
      availableForms: [{ year: 2024, lastUpdated: '2025-02-03T18:50:40.548Z' }],
    };

    const server = setupServer();

    before(() => {
      server.listen();
    });
    after(() => {
      server.close();
    });

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

      store = mockStore(testState);
      const { container } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      await waitFor(() => {
        expect(
          container.querySelector(
            'va-loading-indicator[message="Loading your 1095-B information..."]',
          ),
        ).to.exist;
      });
    });

    it('renders the download form', async () => {
      store = mockStore(authedAndVerifiedState);
      server.use(
        rest.get(
          'https://dev-api.va.gov/v0/form1095_bs/available_forms',
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(responsePayload));
          },
        ),
      );
      const { container, queryByText } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      await waitFor(() => {
        expect(queryByText('Loading')).not.to.exist;
      });
      container.querySelector(
        'va-link[text="Download PDF (best for printing)"]',
      );
    });

    describe('when the forms endpoint fails', () => {
      it('renders an error alert', async () => {
        store = mockStore(authedAndVerifiedState);
        server.use(
          rest.get(
            'https://dev-api.va.gov/v0/form1095_bs/available_forms',
            (_, res, ctx) => {
              return res(ctx.status(500));
            },
          ),
        );
        const { queryByText } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
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
        };
        store = mockStore(testState);
        const { queryByText } = render(
          <Provider store={store}>
            <App />
          </Provider>,
        );
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
    const server = setupServer();

    // todo - this is repeated from above, can make this DRY?
    before(() => {
      server.listen();
    });
    after(() => {
      server.close();
    });

    it('renders a message', async () => {
      const responsePayload = {
        availableForms: [], // empty list of 1095-B forms
      };
      store = mockStore(authedAndVerifiedState);
      server.use(
        rest.get(
          'https://dev-api.va.gov/v0/form1095_bs/available_forms',
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(responsePayload));
          },
        ),
      );

      const { queryByText } = render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

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
