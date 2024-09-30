import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { selectProfile } from 'platform/user/selectors';
import { AUTHN_SETTINGS } from '@department-of-veterans-affairs/platform-user/exports';
import InterstitialChanges from '../containers/InterstitialChanges';

const generateStore = ({
  signInChangesEnabled = true,
  email = null,
  logingovUuid = null,
  idmeUuid = null,
} = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      sign_in_changes_enabled: signInChangesEnabled,
    },
    user: {
      profile: {
        email,
        logingovUuid,
        idmeUuid,
      },
    },
  }),
  subscribe: sinon.stub(),
  dispatch: () => {},
});

describe('InterstitialChanges component', () => {
  let store;
  let dispatchStub;
  let sessionStorageStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    store = generateStore(dispatchStub);
    sessionStorageStub = sinon.stub(window.sessionStorage, 'getItem');
  });
  afterEach(() => {
    sessionStorageStub.restore();
    dispatchStub = undefined;
    store = {};
  });

  it('renders the static content correctly', () => {
    selectProfile.mockReturnValue({
      email: null,
      logingovUuid: null,
      idmeUuid: null,
    });
    sessionStorageStub
      .withArgs(AUTHN_SETTINGS.RETURN_URL)
      .returns('/continue-url');
    render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('heading', {
        name: /You’ll need to sign in with a different account after January 31, 2025/i,
      }),
    ).to.exist;
    expect(
      screen.getByText(
        /After this date, we'll remove the MyHealtheVet.gov sign-in option./i,
      ),
    ).to.exist;
    expect(
      screen.getByRole('link', {
        name: /Continue with your MyHealtheVet account for now/i,
      }),
    ).to.have.attribute('href', '/continue-url');
  });
  it('renders CreateAccount when user has no Login.gov or ID.me account', () => {
    selectProfile.mockReturnValue({
      email: 'test@example.com',
      logingovUuid: null,
      idmeUuid: null,
    });
    render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(screen.getByText(/Create an account now/i)).to.exist;
  });
  it('renders AccountSwitch when user has Login.gov account', () => {
    selectProfile.mockReturnValue({
      email: 'test@example.com',
      logingovUuid: 'some-logingov-uuid',
      idmeUuid: null,
    });
    render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );

    expect(screen.getByText(/Switch to your Login.gov account now/i)).to.exist;
    expect(screen.getByText(/test@example.com/i)).to.exist;
  });
  it('renders AccountSwitch when user has ID.me account', () => {
    selectProfile.mockReturnValue({
      email: 'test@example.com',
      logingovUuid: null,
      idmeUuid: 'some-idme-uuid',
    });
    render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(screen.getByText(/Switch to your ID.me account now/i)).to.exist;
    expect(screen.getByText(/test@example.com/i)).to.exist;
  });
  it('uses the correct returnUrl from sessionStorage', () => {
    selectProfile.mockReturnValue({
      email: null,
      logingovUuid: null,
      idmeUuid: null,
    });
    sessionStorageStub
      .withArgs(AUTHN_SETTINGS.RETURN_URL)
      .returns('/mock-return-url');
    render(
      <Provider store={store}>
        <InterstitialChanges />
      </Provider>,
    );
    expect(
      screen.getByRole('link', {
        name: /Continue with your MyHealtheVet account for now/i,
      }),
    ).to.have.attribute('href', '/mock-return-url');
  });
});
