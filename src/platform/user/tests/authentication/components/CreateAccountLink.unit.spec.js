import React from 'react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { expect } from 'chai';
import * as authUtilities from 'platform/user/authentication/utilities';
import CreateAccountLink from 'platform/user/authentication/components/CreateAccountLink';
import { render, waitFor } from '@testing-library/react';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';

const csps = ['logingov', 'idme'];

describe('CreateAccountLink', () => {
  csps.forEach(policy => {
    const oldCrypto = global.window.crypto;

    beforeEach(() => {
      global.window.crypto = mockCrypto;
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
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
      const screen = render(<CreateAccountLink policy={policy} />);
      const anchor = await screen.findByTestId(policy);
      const href = await authUtilities.signupOrVerify({ policy, isLink: true });
      await waitFor(() => expect(anchor.href).to.eql(href));

      screen.unmount();
    });

    it(`should set correct href for ${policy} (OAuth)`, async () => {
      const screen = render(<CreateAccountLink policy={policy} useOAuth />);
      const anchor = await screen.findByTestId(policy);

      await waitFor(() => expect(anchor.href).to.include(`type=${policy}`));
      await waitFor(() => expect(anchor.href).to.include(`acr=min`));
      await waitFor(() => expect(anchor.href).to.include(`client_id=web`));
      await waitFor(() => expect(anchor.href).to.include('/authorize'));
      await waitFor(() => expect(anchor.href).to.include('response_type=code'));
      await waitFor(() => expect(anchor.href).to.include('code_challenge='));
      await waitFor(() => expect(anchor.href).to.include('state='));
      screen.unmount();
    });
  });
});
