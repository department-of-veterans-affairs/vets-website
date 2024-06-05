import React from 'react';
import { expect } from 'chai';
import SignInServiceUpdateLink from '../../../components/contact-information/email-addresses/SignInServiceUpdateLink';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { SERVICE_PROVIDERS } from '~/platform/user/authentication/constants';

Object.values(SERVICE_PROVIDERS).forEach(csp => {
  describe(`when 'signInServiceName' is '${csp.policy}'`, () => {
    const initialState = {
      user: { profile: { signIn: { serviceName: csp.policy } } },
    };

    const { link: expectedLink, label: expectedLabel } = SERVICE_PROVIDERS[
      csp.policy
    ];

    it('should render without crashing', () => {
      const { container } = renderInReduxProvider(<SignInServiceUpdateLink />, {
        initialState,
      });
      expect(container).to.be.a('HTMLDivElement');
    });

    it('should render the link with correct href and label', () => {
      const { getByText } = renderInReduxProvider(<SignInServiceUpdateLink />, {
        initialState,
      });
      const linkElement = getByText(
        `Update your sign-in information on the ${expectedLabel} website`,
      );

      expect(linkElement).to.exist;
      expect(linkElement.getAttribute('href')).to.equal(expectedLink);
    });
  });
});
