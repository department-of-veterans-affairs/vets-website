import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import { CSP_IDS } from '../../../authentication/constants';
import VerifyAlert from '../../../authorization/components/VerifyAlert';

describe('VerifyAlert component', () => {
  const services = {
    [CSP_IDS.MHV]: 'signInEither',
    [CSP_IDS.LOGIN_GOV]: 'verifyLoginGov',
    [CSP_IDS.ID_ME]: 'verifyIdMe',
  };

  Object.entries(services).forEach(([csp, variant]) => {
    it(`should match the ${csp} to the proper variant`, () => {
      const { container } = renderInReduxProvider(<VerifyAlert />, {
        initialState: {
          user: { profile: { signIn: { serviceName: csp } } },
        },
      });

      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql(variant);
    });
  });

  it('should return null for DS Logon', () => {
    const { container } = renderInReduxProvider(<VerifyAlert />, {
      initialState: {
        user: { profile: { signIn: { serviceName: 'dslogon' } } },
      },
    });

    expect(container?.querySelector('va-alert-sign-in')).to.not.exist;
  });
});
