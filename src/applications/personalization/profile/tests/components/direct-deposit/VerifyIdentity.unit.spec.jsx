import React from 'react';
import { cleanup } from '@testing-library/react';
import { expect } from 'chai';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import VerifyIdentity from '../../../components/direct-deposit/alerts/VerifyIdentity';

describe('authenticated experience -- profile -- direct deposit', () => {
  describe('VerifyIdentity', () => {
    afterEach(cleanup);

    it('shoud render the va-alert-sign-in: idme', () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: {
          user: { profile: { signIn: { serviceName: 'idme' } } },
        },
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
    });

    it('shoud render the va-alert-sign-in: logingov', () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: {
          user: { profile: { signIn: { serviceName: 'logingov' } } },
        },
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('verifyLoginGov');
    });

    it('shoud render the va-alert-sign-in: mhv', () => {
      const { container } = renderInReduxProvider(<VerifyIdentity />, {
        initialState: {
          user: { profile: { signIn: { serviceName: 'mhv' } } },
        },
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('signInEither');
    });
  });
});
