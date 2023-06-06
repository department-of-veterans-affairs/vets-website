import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import EmailAddressNotification from '@@profile/components/contact-information/email-addresses/EmailAddressNotification';

describe('EmailAddressNotification', () => {
  Object.values(SERVICE_PROVIDERS).forEach(csp => {
    describe(`when 'signInServiceName' is '${csp.policy}'`, () => {
      const { link: expectedLink, label: expectedLabel } = SERVICE_PROVIDERS[
        csp.policy
      ];
      const wrapper = shallow(
        <EmailAddressNotification signInServiceName={csp.policy} />,
      );

      const anchor = wrapper.find('a');

      it('should render the correct button text', () => {
        expect(anchor.text().includes(expectedLabel)).to.be.true;
      });
      it('should render the correct link url', () => {
        expect(anchor.props().href).to.equal(expectedLink);
      });
      wrapper.unmount();
    });
  });
});
