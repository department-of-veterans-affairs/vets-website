import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import * as authUtilities from 'platform/user/authentication/utilities';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
import VerifyAccountLink from 'platform/user/authentication/components/VerifyAccountLink';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import { Provider } from 'react-redux';

const csps = ['logingov', 'idme'];
const oldCrypto = global.window.crypto;
const store = {
  getState: () => ({
    featureToggles: {
      [TOGGLE_NAMES.identityIal2FullEnforcement]: false,
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
};

describe('VerifyAccountLink', () => {
  csps.forEach(policy => {
    beforeEach(() => {
      global.window.crypto = mockCrypto;
      window.location = new URL('https://dev.va.gov/');
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
      cleanup();
    });

    it(`should render correctly for each ${policy}`, async () => {
      const screen = render(
        <Provider store={store}>
          <VerifyAccountLink policy={policy} />
        </Provider>,
      );
      const anchor = await screen.findByTestId(policy);

      expect(anchor.textContent).to.include(
        `Create an account with ${SERVICE_PROVIDERS[policy].label}`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${policy} (SAML)`, async () => {
      const screen = render(
        <Provider store={store}>
          <VerifyAccountLink policy={policy} useOAuth={false} />
        </Provider>,
      );
      const anchor = await screen.findByTestId(policy);
      const href = await authUtilities.signupOrVerify({
        policy,
        isLink: true,
        isSignup: false,
        useOAuth: false,
      });

      await waitFor(() => expect(anchor.href).to.eql(href));
      screen.unmount();
    });

    it(`should set correct href for ${policy} (OAuth)`, async () => {
      const screen = render(
        <Provider store={store}>
          <VerifyAccountLink policy={policy} useOAuth />
        </Provider>,
      );
      const anchor = await screen.findByTestId(policy);
      const href = decodeURIComponent(anchor.href);
      const expectedAcr =
        externalApplicationsConfig.default.oAuthOptions.acrVerify[policy];

      await waitFor(() => expect(href).to.include(`type=${policy}`));
      await waitFor(() => expect(href).to.include(`acr=${expectedAcr}`));
      await waitFor(() => expect(href).to.include(`client_id=vaweb`));
      await waitFor(() => expect(href).to.include('/authorize'));
      await waitFor(() => expect(href).to.include('response_type=code'));
      await waitFor(() => expect(href).to.include('code_challenge='));
      await waitFor(() => expect(href).to.include('state='));
      screen.unmount();
    });
  });
});
