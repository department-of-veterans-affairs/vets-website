import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
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
  const oldLocation = window.location;

  before(() => server.listen());
  afterEach(() => {
    cleanup();
    window.location = oldLocation;
    server.resetHandlers();
  });
  after(() => server.close());

  it('renders the static content correctly', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user/credential_emails', () =>
        jsonResponse({}),
      ),
    );
    const mockStore = store();
    const expectedReturnUrl = '/my-va';
    const { getByRole, getByTestId, container } = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );
    await waitFor(() => {
      expect(
        getByRole('heading', {
          name: /We’ll remove the DS Logon sign-in option after September 30, 2025/i,
        }),
      ).to.not.be.null;

      expect(getByTestId('interstitialP')).to.not.be.null;

      const vaLink = container.querySelector('va-link-action');
      expect(vaLink?.getAttribute('href')).to.equal(expectedReturnUrl);
    });
  });

  it('renders AccountSwitch when user has Login.gov account', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user/credential_emails', () =>
        jsonResponse({ logingov: 'logingov@test.com' }),
      ),
    );
    const mockStore = store();
    const { getByText, getByTestId } = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByText(/Start using your/i)).to.not.be.null;
      expect(getByTestId('logingovemail')).to.not.be.null;
    });
  });

  it('renders AccountSwitch when user has ID.me account', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user/credential_emails', () =>
        jsonResponse({ idme: 'idme@test.com' }),
      ),
    );
    const mockStore = store();
    const { getAllByRole, getByTestId } = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );

    await waitFor(() => {
      const headings = getAllByRole('heading', { level: 2 });
      expect(headings[0].textContent).to.match(/Start using your/i);
      expect(getByTestId('idmeemail')).to.not.be.null;
    });
  });

  it('uses the correct returnUrl from sessionStorage', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user/credential_emails', () =>
        jsonResponse({ logingov: 'logi@test.com' }),
      ),
    );
    const mockStore = store();
    const expectedReturnUrl = 'continue-url';
    sessionStorage.setItem('authReturnUrl', expectedReturnUrl);
    const { getByRole, getByTestId, container } = render(
      <Provider store={mockStore}>
        <InterstitialChanges />
      </Provider>,
    );

    await waitFor(() => {
      expect(
        getByRole('heading', {
          name: /We’ll remove the DS Logon sign-in option after September 30, 2025/i,
        }),
      ).to.not.be.null;

      expect(getByTestId('interstitialP')).to.not.be.null;

      const vaLink = container.querySelector('va-link-action');
      expect(vaLink?.getAttribute('href')).to.equal(expectedReturnUrl);
      sessionStorage.clear();
    });
  });
});
