import React from 'react';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import VerifyIdentity from '../../../components/direct-deposit/alerts/VerifyIdentity';

const generateStore = serviceName => ({
  featureToggles: {
    profileShowCredentialRetirementMessaging: true,
  },
  user: {
    profile: { signIn: { serviceName } },
  },
});

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('VerifyIdentity', () => {
    afterEach(() => {
      cleanup();
    });

    it('renders the correct verify alert for ID.me', async () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: generateStore('idme'),
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
    });

    it('renders the correct verify alert for Login.gov', async () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: generateStore('logingov'),
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('verifyLoginGov');
    });

    it('renders the correct verify alert for ID.me', async () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: generateStore('mhv'),
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('signInEither');
    });
  });
});
