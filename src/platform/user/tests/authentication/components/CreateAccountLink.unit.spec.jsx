import React from 'react';
import { expect } from 'chai';
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';
import {
  SERVICE_PROVIDERS,
  CSP_IDS,
} from 'platform/user/authentication/constants';
import * as authUtilities from 'platform/user/authentication/utilities';
import CreateAccountLink from 'platform/user/authentication/components/CreateAccountLink';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';

describe('CreateAccountLink', () => {
  const csps = ['logingov', 'idme'];
  const oldCrypto = global.window.crypto;

  csps.forEach(policy => {
    beforeEach(() => {
      global.window.crypto = mockCrypto;
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
      cleanup();
    });

    it(`should render correctly for each ${policy}`, async () => {
      const screen = render(<CreateAccountLink policy={policy} />);
      const anchor = await screen.findByTestId(policy);
      expect(anchor.textContent).to.include(
        `Create an account with ${SERVICE_PROVIDERS[policy].label}`,
      );

      screen.unmount();
    });

    it(`should set correct href for ${policy} (SAML)`, async () => {
      const screen = render(
        <CreateAccountLink policy={policy} useOAuth={false} />,
      );
      const anchor = await screen.findByTestId(policy);
      const href = await authUtilities.signupOrVerify({ policy, isLink: true });
      await waitFor(() => expect(anchor.href).to.eql(href));

      screen.unmount();
    });

    it(`should set correct href for ${policy} (OAuth)`, async () => {
      const screen = render(<CreateAccountLink policy={policy} useOAuth />);
      const anchor = await screen.findByTestId(policy);

      await waitFor(() => {
        expect(anchor.href).to.include(`type=${policy}`);
        expect(anchor.href).to.include(`acr=min`);
        expect(anchor.href).to.include(`client_id=vaweb`);
        expect(anchor.href).to.include('/authorize');
        expect(anchor.href).to.include('response_type=code');
        expect(anchor.href).to.include('code_challenge=');
        expect(anchor.href).to.include('state=');
      });
      screen.unmount();
    });

    it(`should not call updateStateAndVerifier for ${policy} (SAML)`, async () => {
      const screen = render(
        <CreateAccountLink policy={policy} useOAuth={false} />,
      );
      const anchor = await screen.findByTestId(policy);
      const href = await authUtilities.signupOrVerify({ policy, isLink: true });
      fireEvent.click(anchor);

      await waitFor(() => expect(anchor.href).to.eql(href));
      screen.unmount();
    });

    it(`should call updateStateAndVerifier ${policy} (OAuth)`, async () => {
      const screen = render(<CreateAccountLink policy={policy} useOAuth />);
      const anchor = await screen.findByTestId(policy);
      fireEvent.click(anchor);

      await waitFor(() => {
        expect(anchor.href).to.include(`type=${policy}`);
        expect(anchor.href).to.include(`acr=min`);
        expect(anchor.href).to.include(`client_id=vaweb`);
        expect(anchor.href).to.include('/authorize');
        expect(anchor.href).to.include('response_type=code');
        expect(anchor.href).to.include('code_challenge=');
        expect(anchor.href).to.include('state=');
      });

      screen.unmount();
    });

    it(`should use the provided clientId in the OAuth URL for ${policy}`, async () => {
      const screen = render(
        <CreateAccountLink policy={policy} useOAuth clientId="arp" />,
      );
      const anchor = await screen.findByTestId(policy);

      await waitFor(() => {
        expect(anchor.href).to.include('client_id=arp');
        expect(anchor.href).to.not.include('client_id=vaweb');
      });

      screen.unmount();
    });
  });

  describe('SiS eligibility via external application config', () => {
    beforeEach(() => {
      global.window.crypto = mockCrypto;
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
      cleanup();
    });

    // 'mhv' has OAuthEnabled: false in all environment configs
    it('falls back to SAML when externalApplication is SiS-ineligible (mhv)', async () => {
      const screen = render(
        <CreateAccountLink
          policy={CSP_IDS.LOGIN_GOV}
          externalApplication="mhv"
        />,
      );
      const anchor = await screen.findByTestId(CSP_IDS.LOGIN_GOV);

      await waitFor(() => {
        // SAML URL uses the v1 sessions path; OAuth uses v0/sign_in/authorize
        expect(anchor.href).to.include('/sessions/');
        expect(anchor.href).to.not.include('/sign_in/authorize');
      });

      screen.unmount();
    });

    it('uses SiS by default when no externalApplication is provided', async () => {
      const screen = render(<CreateAccountLink policy={CSP_IDS.LOGIN_GOV} />);
      const anchor = await screen.findByTestId(CSP_IDS.LOGIN_GOV);

      await waitFor(() => {
        expect(anchor.href).to.include('/sign_in/authorize');
        expect(anchor.href).to.include('acr=min');
      });

      screen.unmount();
    });
  });
});
