import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import {
  setupServer,
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
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
  const server = setupServer();
  const oldLocation = global.window.location;

  before(() => server.listen());
  afterEach(() => {
    cleanup();
    global.window.location = oldLocation;
    server.resetHandlers();
  });
  after(() => server.close());

  it('renders the static content correctly', async () => {
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/user/credential_emails`, () =>
        jsonResponse({}),
      ),
    );
    const mockStore = store();
    const expectedReturnUrl = '/';
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /The DS Logon sign-in option is going away soon/i,
        }),
      ).to.exist;
      expect(screen.getByTestId('interstitialP')).to.exist;
      expect(
        screen.container.querySelector(
          'va-link-action[text="Continue with your DS Logon account for now"]',
        ),
      ).to.have.attribute('href', expectedReturnUrl);
    });
  });

  it('renders AccountSwitch when user has Login.gov account', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/user/credential_emails`, () =>
        jsonResponse({ logingov: 'logingov@test.com' }),
      ),
    );
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Start using your/i)).to.exist;
      expect(screen.getByTestId('logingovemail')).to.exist;
    });
  });

  it('renders AccountSwitch when user has ID.me account', async () => {
    const mockStore = store();
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/user/credential_emails`, () =>
        jsonResponse({ idme: 'idme@test.com' }),
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
      expect(screen.getByTestId('idmeemail')).to.exist;
    });
  });

  it('uses the correct returnUrl from sessionStorage', async () => {
    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/user/credential_emails`, () =>
        jsonResponse({ logingov: 'logi@test.com' }),
      ),
    );
    const mockStore = store();
    const expectedReturnUrl = 'continue-url';
    sessionStorage.setItem('authReturnUrl', expectedReturnUrl);
    const screen = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /The DS Logon sign-in option is going away soon/i,
        }),
      ).to.exist;
      expect(screen.getByTestId('interstitialP')).to.exist;
      expect(
        screen.container.querySelector(
          'va-link-action[text="Continue with your DS Logon account for now"]',
        ),
      ).to.have.attribute('href', expectedReturnUrl);
      sessionStorage.clear();
    });
  });

  it('redirects user to homepage on errors', async () => {
    global.window.location = '/sign-in-changes-reminder';

    server.use(
      createGetHandler(`https://dev-api.va.gov/v0/user/credential_emails`, () =>
        jsonResponse({}, { status: 400 }),
      ),
    );
    const mockStore = store();
    const expectedLocation = '/';
    render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );

    await waitFor(() => {
      expect(global.window.location).to.eql(expectedLocation);
    });
  });
});
