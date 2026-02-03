import React from 'react';
import { expect } from 'chai';
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
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
  });
});
