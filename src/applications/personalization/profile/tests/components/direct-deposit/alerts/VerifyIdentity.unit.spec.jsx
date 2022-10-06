import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';
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

      expect(loginGovAnchor.href).to.include(`logingov_signup_verified`);
      expect(idmeAnchor.href).to.include('idme_signup_verified');
      screen.unmount();
    });

    it('renders the proper URLs for VerifyIdentity (OAuth)', async () => {
      const screen = render(<VerifyIdentity useOAuth />);
      const logingovAcr =
        externalApplicationsConfig.default.oAuthOptions.acrVerify.logingov;
      const idmeAcr =
        externalApplicationsConfig.default.oAuthOptions.acrVerify.idme;
      const loginGovAnchor = await screen.findByTestId('logingov');
      const idmeAnchor = await screen.findByTestId('idme');

      expect(loginGovAnchor.href).to.include(`type=logingov`);
      expect(loginGovAnchor.href).to.include(`acr=${logingovAcr}`);
      expect(loginGovAnchor.href).to.include(`client_id=web`);
      expect(loginGovAnchor.href).to.include('/authorize');
      expect(loginGovAnchor.href).to.include('response_type=code');
      expect(loginGovAnchor.href).to.include('code_challenge=');
      expect(loginGovAnchor.href).to.include('state=');

      expect(idmeAnchor.href).to.include(`type=idme`);
      expect(idmeAnchor.href).to.include(`acr=${idmeAcr}`);
      expect(idmeAnchor.href).to.include(`client_id=web`);
      expect(idmeAnchor.href).to.include('/authorize');
      expect(idmeAnchor.href).to.include('response_type=code');
      expect(idmeAnchor.href).to.include('code_challenge=');
      expect(idmeAnchor.href).to.include('state=');
      screen.unmount();
    });
  });
});
