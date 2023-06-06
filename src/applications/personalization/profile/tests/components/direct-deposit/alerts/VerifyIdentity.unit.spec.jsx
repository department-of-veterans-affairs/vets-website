import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import VerifyIdentity from '../../../../components/direct-deposit/alerts/VerifyIdentity';

const oldCrypto = global.window.crypto;

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('VerifyIdentity', () => {
    beforeEach(() => {
      global.window.crypto = mockCrypto;
      window.location = new URL('https://dev.va.gov/');
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
      cleanup();
    });

    it('passes axeCheck', () => {
      axeCheck(<VerifyIdentity />);
    });

    it('renders the proper URLs for VerifyIdentity (SAML)', async () => {
      const screen = render(<VerifyIdentity useOAuth={false} />);
      const loginGovAnchor = await screen.findByTestId('logingov');
      const idmeAnchor = await screen.findByTestId('idme');

      await waitFor(() =>
        expect(loginGovAnchor.href).to.include(`logingov_signup_verified`),
      );
      await waitFor(() =>
        expect(idmeAnchor.href).to.include('idme_signup_verified'),
      );
      screen.unmount();
    });

    it('renders the proper URLs for VerifyIdentity (OAuth)', async () => {
      const screen = render(<VerifyIdentity useOAuth />);
      const loginGovAnchor = await screen.findByTestId('logingov');
      const idmeAnchor = await screen.findByTestId('idme');

      await waitFor(() =>
        expect(loginGovAnchor.href).to.include(`type=logingov`),
      );
      await waitFor(() => expect(loginGovAnchor.href).to.include(`acr=min`));
      await waitFor(() =>
        expect(loginGovAnchor.href).to.include(`client_id=vaweb`),
      );
      await waitFor(() => expect(loginGovAnchor.href).to.include('/authorize'));
      await waitFor(() =>
        expect(loginGovAnchor.href).to.include('response_type=code'),
      );
      await waitFor(() =>
        expect(loginGovAnchor.href).to.include('code_challenge='),
      );
      await waitFor(() => expect(loginGovAnchor.href).to.include('state='));

      await waitFor(() => expect(idmeAnchor.href).to.include(`type=idme`));
      await waitFor(() => expect(idmeAnchor.href).to.include(`acr=min`));
      await waitFor(() =>
        expect(idmeAnchor.href).to.include(`client_id=vaweb`),
      );
      await waitFor(() => expect(idmeAnchor.href).to.include('/authorize'));
      await waitFor(() =>
        expect(idmeAnchor.href).to.include('response_type=code'),
      );
      await waitFor(() =>
        expect(idmeAnchor.href).to.include('code_challenge='),
      );
      await waitFor(() => expect(idmeAnchor.href).to.include('state='));
      screen.unmount();
    });
  });
});
