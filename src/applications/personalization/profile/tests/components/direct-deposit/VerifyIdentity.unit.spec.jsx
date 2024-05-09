import React from 'react';
import { cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { renderComponentForA11y } from 'platform/user/tests/helpers';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import VerifyIdentity from '../../../components/direct-deposit/alerts/VerifyIdentity';

const initialState = {
  featureToggles: {
    profileShowCredentialRetirementMessaging: true,
  },
  user: {
    profile: {
      signIn: {
        serviceName: 'idme',
      },
    },
  },
};

describe('authenticated experience -- profile -- direct deposit', () => {
  const oldCrypto = global.window.crypto;
  describe('VerifyIdentity', () => {
    beforeEach(() => {
      global.window.crypto = mockCrypto;
      window.location = new URL('https://dev.va.gov/');
    });

    afterEach(() => {
      global.window.crypto = oldCrypto;
      cleanup();
    });

    it('passes axeCheck', async () => {
      const { container } = renderInReduxProvider(
        <VerifyIdentity useOAuth={false} />,
        {
          initialState,
        },
      );

      await expect(
        renderComponentForA11y(container, { isWrapped: true }),
      ).to.be.accessible();
    });

    it('renders the proper URLs for VerifyIdentity (SAML)', async () => {
      const screen = renderInReduxProvider(
        <VerifyIdentity useOAuth={false} />,
        { initialState },
      );
      const loginGovAnchor = await screen.findByTestId('logingov');
      const idmeAnchor = await screen.findByTestId('idme');

      await waitFor(() => {
        expect(loginGovAnchor.href).to.include(`logingov_signup_verified`);
        expect(idmeAnchor.href).to.include('idme_signup_verified');
      });
      screen.unmount();
    });

    it('renders the proper URLs for VerifyIdentity (OAuth)', async () => {
      const screen = renderInReduxProvider(<VerifyIdentity useOAuth />, {
        initialState,
      });
      const loginGovAnchor = await screen.findByTestId('logingov');
      const idmeAnchor = await screen.findByTestId('idme');

      await waitFor(() => {
        expect(loginGovAnchor.href).to.include(`type=logingov`);
        expect(loginGovAnchor.href).to.include(`acr=min`);
        expect(loginGovAnchor.href).to.include(`client_id=vaweb`);
        expect(loginGovAnchor.href).to.include('/authorize');
        expect(loginGovAnchor.href).to.include('response_type=code');
        expect(loginGovAnchor.href).to.include('code_challenge=');
        expect(loginGovAnchor.href).to.include('state=');
        expect(idmeAnchor.href).to.include(`type=idme`);
        expect(idmeAnchor.href).to.include(`acr=min`);
        expect(idmeAnchor.href).to.include(`client_id=vaweb`);
        expect(idmeAnchor.href).to.include('/authorize');
        expect(idmeAnchor.href).to.include('response_type=code');
        expect(idmeAnchor.href).to.include('code_challenge=');
        expect(idmeAnchor.href).to.include('state=');
      });

      screen.unmount();
    });
  });
});
