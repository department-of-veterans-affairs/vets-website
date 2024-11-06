import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import InterstitialChanges from '../containers/InterstitialChanges';

const store = ({ signInChangesEnabled = true } = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      sign_in_changes_enabled: signInChangesEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('InterstitialChanges', () => {
  const oldLocation = global.window.location;
  const server = setupServer();

  before(() => server.listen());
  afterEach(() => {
    global.window.location = oldLocation;
    cleanup();
    server.resetHandlers();
  });
  after(() => server.close());

  it('renders the static content correctly', () => {
    const mockStore = store();
    const expectedReturnUrl = '/';
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /You’ll need to sign in with a different account after January 31, 2025/i,
      }),
    ).to.exist;
    expect(screen.getByText(/After this date, we'll remove/i)).to.exist;
    expect(
      screen.container.querySelector(
        'va-link[text="Continue with your My HealtheVet account for now"]',
      ),
    ).to.have.attribute('href', expectedReturnUrl);
  });

  it('renders AccountSwitch when user has Login.gov account', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/user/credential_emails`,
        (_, res, ctx) => {
          return res(ctx.status(401), ctx.json({ logingov: 'logi@test.com' }));
        },
      ),
    );
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Start using your/i)).to.exist;
      expect(screen.getByText(/log\*{5}@test\.com/i)).to.exist;
    });
  });
  it('renders AccountSwitch when user has ID.me account', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/user/credential_emails`,
        (_, res, ctx) => {
          return res(ctx.status(401), ctx.json({ idme: 'idme@test.com' }));
        },
      ),
    );
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(
        screen.getAllByRole('heading', { level: 2 })[0].textContent,
      ).to.match(/Start using your/i);
      expect(screen.getByText(/idm\*@test\.com/i)).to.exist;
    });
  });

  it('uses the correct returnUrl from sessionStorage', () => {
    const mockStore = store();
    const expectedReturnUrl = 'continue-url';
    sessionStorage.setItem('authReturnUrl', expectedReturnUrl);
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /You’ll need to sign in with a different account after/i,
      }),
    ).to.exist;
    expect(screen.getByText(/After this date, we'll remove/i)).to.exist;
    expect(
      screen.container.querySelector(
        'va-link[text="Continue with your My HealtheVet account for now"]',
      ),
    ).to.have.attribute('href', expectedReturnUrl);
    sessionStorage.clear();
  });
});
