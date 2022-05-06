import React from 'react';
import {
  CSP_IDS,
  CSP_CONTENT,
  LINK_TYPES,
} from 'platform/user/authentication/constants';
import { expect } from 'chai';
import * as authUtilities from 'platform/user/authentication/utilities';
import AccountLink from 'platform/user/authentication/components/AccountLink';
import { shallow } from 'enzyme';

const csps = Object.values(CSP_IDS).filter(csp => csp !== 'myhealthevet');

describe('AccountLink', () => {
  it('should not render without a `csp`', () => {
    const wrapper = shallow(<AccountLink />);
    expect(wrapper.exists('a')).to.be.false;
    wrapper.unmount();
  });
  csps.forEach(csp => {
    it(`should render correctly for ${csp}`, () => {
      const wrapper = shallow(<AccountLink csp={csp} />);
      const anchor = wrapper.find('a');

      expect(anchor.prop('data-csp')).to.equal(csp);
      expect(anchor.text()).to.equal(
        `Create an account with ${CSP_CONTENT[csp].COPY}`,
      );

      wrapper.unmount();
    });

    it(`should set correct href for ${csp} type=create`, () => {
      const wrapper = shallow(
        <AccountLink csp={csp} type={LINK_TYPES.CREATE} />,
      );
      const anchor = wrapper.find('a');

      expect(anchor.prop('href')).to.equal(authUtilities.signupUrl(csp));
      expect(anchor.text()).to.equal(
        `Create an account with ${CSP_CONTENT[csp].COPY}`,
      );

      wrapper.unmount();
    });

    it(`should set correct href for ${csp} type=signin`, () => {
      const wrapper = shallow(
        <AccountLink csp={csp} type={LINK_TYPES.SIGNIN} />,
      );
      const anchor = wrapper.find('a');
      expect(anchor.prop('href')).to.equal(
        authUtilities.sessionTypeUrl({ type: csp }),
      );
      expect(anchor.text()).to.equal(
        `Sign in with ${CSP_CONTENT[csp].COPY} account`,
      );

      wrapper.unmount();
    });
  });
});
